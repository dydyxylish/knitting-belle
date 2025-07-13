"use server";
import "server-only";

import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";

import { env } from "@/lib/env";
import { isAuthenticated } from "@/lib/isAuthenticated";
import { getLogger } from "@/lib/logger";
import { paymentSchema } from "@/lib/schema";
import stripe from "@/lib/stripe";
import { getCurrentUserInfo } from "../../../lib/getUserInfo";
import { getKnittingPattern } from "../fetch/knittingPattern/getKnittingPattern";
import { hasAlreadyKnittingPattern } from "../fetch/purchaseHistory/hasAlreadyKnittingPattern";
import { getImagePathsBySlugWithCookie } from "../fetch/yarnCraftImage/getImagePathsBySlugWithCookie";

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

	if (!(await isAuthenticated())) {
		log.error({ isAuthenticated: false }, "セッションがきれています");
		return submission.reply({
			fieldErrors: {
				sessionError: ["セッションがきれています。再度ログインしてください"],
			},
		});
	}

	const knittingPattern = await getKnittingPattern(
		submission.value.knittingPatternSlug,
	);
	if (!knittingPattern) {
		log.error({ notFoundKnittingPatter: true }, "指定商品が無効です");
		redirect("/cancel");
	}

	const user = await getCurrentUserInfo();
	if (!user) redirect("/cancel");
	// すでに購入済のユーザが同じ商品を選択していたら、エラー
	if (
		user.sub &&
		(await hasAlreadyKnittingPattern({
			user: user.sub,
			knittingPatternSlug: knittingPattern.slug,
		}))
	) {
		log.warn(
			{ user, knittingPattern },
			`ユーザ${user.email}は${knittingPattern.slug}を購入済みです`,
		);
		return submission.reply({
			fieldErrors: {
				duplicateError: [`お客様は、こちらの編み図を既に購入済みです`],
			},
		});
	}

	const images = await getImagePathsBySlugWithCookie(knittingPattern.slug);
	const lineItems = [
		{
			price_data: {
				currency: "jpy",
				product_data: {
					name: knittingPattern.title,
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
