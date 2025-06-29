import { signOut } from "aws-amplify/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { amplifyConfigure } from "@/app/_lib/amplifyServerUtils";
import { createPurchaseHistory } from "@/app/_lib/create/createPurchaseHistory";
import { checkKnittingPatternExists } from "@/app/_lib/fetch/knittingPattern/checkKnittingPatternExists";
import { checkSamePurchaseHistory } from "@/app/_lib/fetch/purchaseHistory/checkSamePurchaseHistory";
import { checkUserExistsBySub } from "@/app/_lib/fetch/user/checkUserExistsBySub";
import { loginAdmin } from "@/app/_lib/loginAdmin";
import { getLogger } from "@/lib/logger";
import stripe from "@/lib/stripe";

amplifyConfigure();

const log = getLogger(import.meta.url);

const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export async function POST(req: Request) {
	// リクエストの検証
	const body = await req.text();
	const requestHeader = await headers();
	const sig = requestHeader.get("Stripe-Signature");
	let event: Stripe.Event;
	try {
		if (!sig) throw new Error("No signature");
		event = stripe.webhooks.constructEvent(body, sig, stripeWebhookSecret);
	} catch (error) {
		const err = error instanceof Error ? error : new Error("Bad Request");
		log.error({ error }, "不適切なリクエストです");
		return new NextResponse(`Webhook Error: ${err.message}`, {
			status: 400,
		});
	}

	// イベントの処理
	try {
		await loginAdmin();

		switch (event.type) {
			case "payment_intent.succeeded": {
				const paymentIntent = event.data.object;
				const { sub, knittingPatternSlug } = paymentIntent.metadata;

				if (!(await checkKnittingPatternExists(knittingPatternSlug)))
					throw new Error("編み図が取得できません");

				if (!(await checkUserExistsBySub(sub)))
					throw new Error("有効なユーザではありません");

				//重複チェック
				// TODO: 同時にリクエストが来た場合に、コミットメント制御しなければ、重複した購入履歴が作成されてしまう可能性がある？
				const purchaseHistoryFields = {
					paymentIntentId: paymentIntent.id,
					user: sub,
					knittingPatternSlug: knittingPatternSlug,
				};
				const notExistSamePurchaseHistory = await checkSamePurchaseHistory(
					purchaseHistoryFields,
				);
				if (!notExistSamePurchaseHistory)
					throw new Error("購入履歴が既に存在しています");

				const purchaseHistory = await createPurchaseHistory({
					...purchaseHistoryFields,
					purchasedAt: new Date(paymentIntent.created * 1000).toISOString(),
				});
				log.info({ purchaseHistory }, "購入履歴を作成しました");

				break;
			}
		}
		return new NextResponse("OK", { status: 200 });
	} catch (error) {
		console.error(error);
		log.error({ error }, "イベントのハンドルに失敗しました");
		return new NextResponse("イベントのハンドルに失敗しました", {
			status: 400,
		});
	} finally {
		await signOut();
	}
}
