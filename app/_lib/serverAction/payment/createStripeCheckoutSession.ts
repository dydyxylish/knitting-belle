import "server-only";

import type { Schema } from "@/amplify/data/resource";
import { env } from "@/lib/env";
import { getLogger } from "@/lib/logger";
import stripe from "@/lib/stripe";
import { getImagePathsBySlugWithCookie } from "../../fetch/yarnCraftImage/getImagePathsBySlugWithCookie";
import type { User } from "./types";

const log = getLogger(import.meta.url);

export async function createStripeCheckoutSession(
	knittingPattern: Schema["KnittingPattern"]["type"],
	user: User,
): Promise<string> {
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
		throw new Error("Stripeセッションの作成に失敗しました");
	}

	return session.url;
}
