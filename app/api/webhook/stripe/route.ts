import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { amplifyConfigure } from "@/app/_lib/configureAmplify";
import { checkSamePurchaseHistory } from "@/app/_lib/fetch/purchaseHistory/checkSamePurchaseHistory";
import { checkUserExistsBySub } from "@/app/_lib/fetch/user/checkUserExistsBySub";
import { loginAdmin } from "@/app/_lib/loginAdmin";
import { getKnittingPatternWithAuthClient } from "@/db/repository/knittingPattern/getKnittingPatternWithAuth";
import { updateKnittingPattern } from "@/db/repository/knittingPattern/updateKnittingPattern";
import { createPurchaseHistory } from "@/db/repository/purchaseHistory/createPurchaseHistory";
import { env } from "@/lib/env";
import { getLogger } from "@/lib/logger";
import stripe from "@/lib/stripe";

amplifyConfigure();

const log = getLogger(import.meta.url);

// 定数
const WEBHOOK_EVENTS = {
	CHECKOUT_SESSION_COMPLETED: "checkout.session.completed",
} as const;

const HTTP_STATUS = {
	OK: 200,
	BAD_REQUEST: 400,
} as const;

const ERROR_MESSAGES = {
	NO_SIGNATURE: "No signature",
	MISSING_METADATA: "Metadataが存在しません",
	KNITTING_PATTERN_NOT_FOUND: "編み図が取得できません",
	EVENT_HANDLING_FAILED: "イベントのハンドルに失敗しました",
	BAD_REQUEST: "不適切なリクエストです",
} as const;

// 型定義
type CheckoutSessionMetadata = {
	sub: string;
	knittingPatternSlug: string;
};

type PurchaseHistoryData = {
	sessionId: string;
	user: string;
	knittingPatternSlug: string;
	purchasedAt: string;
};

// メタデータ検証
function validateCheckoutSessionMetadata(
	session: Stripe.Checkout.Session,
): CheckoutSessionMetadata {
	if (
		!session.metadata ||
		!session.metadata.sub ||
		!session.metadata.knittingPatternSlug
	) {
		log.warn({ sessionId: session.id }, ERROR_MESSAGES.MISSING_METADATA);
		throw new Error(ERROR_MESSAGES.MISSING_METADATA);
	}

	return {
		sub: session.metadata.sub,
		knittingPatternSlug: session.metadata.knittingPatternSlug,
	};
}

// checkout.session.completed イベントハンドラー
async function handleCheckoutSessionCompleted(
	session: Stripe.Checkout.Session,
): Promise<void> {
	const { sub, knittingPatternSlug } = validateCheckoutSessionMetadata(session);

	const purchaseHistoryFields = {
		sessionId: session.id,
		user: sub,
		knittingPatternSlug,
	};

	// 管理者でログインし、並行して検証を実行
	await loginAdmin();

	// 編み図の存在確認と詳細取得を並行実行
	const [knittingPattern] = await Promise.all([
		getKnittingPatternWithAuthClient(knittingPatternSlug),
		checkUserExistsBySub(sub),
		checkSamePurchaseHistory(purchaseHistoryFields),
	]);

	if (!knittingPattern) {
		throw new Error(ERROR_MESSAGES.KNITTING_PATTERN_NOT_FOUND);
	}

	// 購入履歴作成とダウンロード数更新を並行実行
	const purchaseHistoryData: PurchaseHistoryData = {
		...purchaseHistoryFields,
		purchasedAt: new Date(session.created * 1000).toISOString(),
	};

	const [purchaseHistory] = await Promise.all([
		createPurchaseHistory(purchaseHistoryData),
		updateKnittingPattern({
			slug: knittingPattern.slug,
			downloadCount: (knittingPattern.downloadCount || 0) + 1,
		}),
	]);

	log.info({ purchaseHistory }, "購入履歴を作成しました");
}

// Webhook署名検証
async function verifyWebhookSignature(req: Request): Promise<Stripe.Event> {
	const body = await req.text();
	const requestHeader = await headers();
	const sig = requestHeader.get("Stripe-Signature");

	if (!sig) {
		throw new Error(ERROR_MESSAGES.NO_SIGNATURE);
	}

	try {
		return stripe.webhooks.constructEvent(body, sig, env.STRIPE_WEBHOOK_SECRET);
	} catch (error) {
		const err =
			error instanceof Error ? error : new Error(ERROR_MESSAGES.BAD_REQUEST);
		log.error({ error }, ERROR_MESSAGES.BAD_REQUEST);
		throw err;
	}
}

export async function POST(req: Request) {
	// リクエストの検証
	let event: Stripe.Event;
	try {
		event = await verifyWebhookSignature(req);
	} catch (error) {
		const err =
			error instanceof Error ? error : new Error(ERROR_MESSAGES.BAD_REQUEST);
		return new NextResponse(`Webhook Error: ${err.message}`, {
			status: HTTP_STATUS.BAD_REQUEST,
		});
	}

	// イベントの処理
	try {
		switch (event.type) {
			case WEBHOOK_EVENTS.CHECKOUT_SESSION_COMPLETED: {
				await handleCheckoutSessionCompleted(
					event.data.object as Stripe.Checkout.Session,
				);
				break;
			}
		}
		return new NextResponse("OK", { status: HTTP_STATUS.OK });
	} catch (error) {
		log.error({ error }, ERROR_MESSAGES.EVENT_HANDLING_FAILED);
		return new NextResponse(ERROR_MESSAGES.EVENT_HANDLING_FAILED, {
			status: HTTP_STATUS.BAD_REQUEST,
		});
	}
}
