"use server";
import "server-only";

import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";

import { isAuthenticated } from "@/lib/isAuthenticated";
import { getLogger } from "@/lib/logger";
import { paymentSchema } from "@/lib/schema";
import stripe from "@/lib/stripe";
import { getCachedKnittingPattern } from "../fetch/knittingPattern/getCachedKnittingPattern";

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

	const knittingPattern = await getCachedKnittingPattern(
		submission.value.knittingPatternId,
	);
	log.error(knittingPattern);
	if (knittingPattern instanceof Error) {
		log.error({ notFoundKnittingPatter: true }, "指定商品が無効です");
		redirect("/cancel");
	} else if (!isAuthenticated()) {
		log.error({ isAuthenticated: false }, "セッションがきれています");
		redirect("/cancel");
	}

	const successUrl = "http://localhost:3000/thanks";
	const cancelUrl = "http://localhost:3000/cancel";
	const lineItems = [
		{
			price_data: {
				currency: "jpy",
				product_data: {
					name: knittingPattern.title,
					description: knittingPattern.description,
					// images: [product.image],
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
		success_url: successUrl,
		cancel_url: cancelUrl,
	});
	if (session.url) {
		redirect(session.url);
	}
	log.error({ session }, "セッションの作成に失敗しました");
	redirect("/cancel");
}
