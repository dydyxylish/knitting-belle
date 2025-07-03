"use server";
import "server-only";

import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";

import { env } from "@/lib/env";
import { isAuthenticated } from "@/lib/isAuthenticated";
import { getLogger } from "@/lib/logger";
import { paymentSchema } from "@/lib/schema";
import stripe from "@/lib/stripe";
import { getKnittingPattern } from "../fetch/knittingPattern/getKnittingPattern";
import { hasAlreadyKnittingPattern } from "../fetch/purchaseHistory/hasAlreadyKnittingPattern";
import { getCurrentUserInfo } from "../fetch/user/getUserInfo";
import { getImagePaths } from "../fetch/yarnCraftImage/getImagePaths";

const log = getLogger(import.meta.url);

export async function makePayment(formData: FormData) {
	const submission = parseWithZod(formData, {
		schema: paymentSchema,
	});
	log.debug({ submission }, "submission");

	if (submission.status !== "success") {
		log.error({ submission }, "フォーム入力値に不備があります");
		redirect("/cancel");
	}

	const knittingPattern = await getKnittingPattern(
		submission.value.knittingPatternSlug,
	);
	if (!knittingPattern) {
		log.error({ notFoundKnittingPatter: true }, "指定商品が無効です");
		redirect("/cancel");
	} else if (!isAuthenticated()) {
		log.error({ isAuthenticated: false }, "セッションがきれています");
		redirect("/cancel");
	}

	// すでに購入済のユーザが同じ商品を選択していたら、エラー
	const user = await getCurrentUserInfo();
	if (!user) redirect("/cancel");
	if (
		user.sub &&
		(await hasAlreadyKnittingPattern({
			user: user.sub,
			knittingPatternSlug: knittingPattern.slug,
		}))
	) {
		log.warn(
			{ user, knittingPattern },
			`ユーザ${user.email}は${knittingPattern.slug}をすでに購入済です`,
		);
		// TODO 「すでに購入済です」エラーをフロントに返し、画面表示
	}

	const images = await getImagePaths(knittingPattern.slug);
	const lineItems = [
		{
			price_data: {
				currency: "jpy",
				product_data: {
					name: knittingPattern.title,
					description: knittingPattern.description,
					images: images.slice(0, 1),
				},
				unit_amount: knittingPattern.price,
			},
			quantity: 1,
		},
	];
	const session = await stripe.checkout.sessions.create({
		payment_method_types: ["card"],
		line_items: lineItems,
		mode: "payment",
		success_url: env.STRIPE_SUCCESS_URL,
		cancel_url: env.STRIPE_CANCEL_URL,
		metadata: {
			sub: user.sub || "",
			knittingPatternSlug: knittingPattern.slug,
		},
	});

	if (!session.url) {
		log.error({ session }, "セッションの作成に失敗しました");
		redirect("/cancel");
	}
	redirect(session.url);
}
