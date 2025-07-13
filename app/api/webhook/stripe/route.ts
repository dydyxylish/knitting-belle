import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { amplifyConfigure } from "@/app/_lib/configureAmplify";
import { createPurchaseHistory } from "@/app/_lib/create/createPurchaseHistory";
import { checkKnittingPatternExists } from "@/app/_lib/fetch/knittingPattern/checkKnittingPatternExists";
import { getKnittingPatternWithAuth } from "@/app/_lib/fetch/knittingPattern/getKnittingPatternWithAuth";
import { checkSamePurchaseHistory } from "@/app/_lib/fetch/purchaseHistory/checkSamePurchaseHistory";
import { checkUserExistsBySub } from "@/app/_lib/fetch/user/checkUserExistsBySub";
import { loginAdmin } from "@/app/_lib/loginAdmin";
import { updateDownloadCount } from "@/app/_lib/update/updateDownloadCount";
import { env } from "@/lib/env";
import { getLogger } from "@/lib/logger";
import stripe from "@/lib/stripe";

amplifyConfigure();

const log = getLogger(import.meta.url);

export async function POST(req: Request) {
	// リクエストの検証
	const body = await req.text();
	const requestHeader = await headers();
	const sig = requestHeader.get("Stripe-Signature");
	let event: Stripe.Event;
	try {
		if (!sig) throw new Error("No signature");
		event = stripe.webhooks.constructEvent(
			body,
			sig,
			env.STRIPE_WEBHOOK_SECRET,
		);
	} catch (error) {
		const err = error instanceof Error ? error : new Error("Bad Request");
		log.error({ error }, "不適切なリクエストです");
		return new NextResponse(`Webhook Error: ${err.message}`, {
			status: 400,
		});
	}

	// イベントの処理
	try {
		switch (event.type) {
			case "checkout.session.completed": {
				const session = event.data.object;
				if (
					!session.metadata ||
					!session.metadata.sub ||
					!session.metadata.knittingPatternSlug
				) {
					console.warn("Metadataが存在しません:", session.id);
					throw new Error("Metadataが存在しません");
				}

				const sub = session.metadata.sub;
				const knittingPatternSlug = session.metadata.knittingPatternSlug;
				const purchaseHistoryFields = {
					sessionId: session.id,
					user: sub,
					knittingPatternSlug: knittingPatternSlug,
				};

				await loginAdmin();
				await Promise.all([
					checkKnittingPatternExists(knittingPatternSlug),
					checkUserExistsBySub(sub),
					checkSamePurchaseHistory(purchaseHistoryFields),
				]);

				const purchaseHistory = await createPurchaseHistory({
					...purchaseHistoryFields,
					purchasedAt: new Date(session.created * 1000).toISOString(),
				});
				log.info({ purchaseHistory }, "購入履歴を作成しました");

				// TODO: [REFACTOR]上でもknittingPattern取得しているため重複している
				// ダウンロード数+1
				const knittingPattern =
					await getKnittingPatternWithAuth(knittingPatternSlug);
				if (!knittingPattern) throw new Error("編み図が取得できません");
				await updateDownloadCount({
					slug: knittingPattern?.slug,
					downloadCount: (knittingPattern.downloadCount || 0) + 1,
				});

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
	}
}
