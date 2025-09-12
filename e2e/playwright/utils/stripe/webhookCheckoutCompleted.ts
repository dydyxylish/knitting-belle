import { STRIPE_WEBHOOK_ENDPOINT } from "@/e2e/playwright/utils/const";
import stripe from "@/e2e/playwright/utils/stripe/createStripe";
import {
	type GeneratePayloadProps,
	generatePayload,
} from "@/e2e/playwright/utils/stripe/generatePayload";
import { env } from "@/lib/env";
import { getLogger } from "@/lib/logger";

const log = getLogger(import.meta.url);

export const webhookCheckoutCompleted = async (
	metadata: GeneratePayloadProps,
) => {
	log.info({ metadata }, "webhookCheckoutCompleted");
	const payloadObject = JSON.stringify(generatePayload(metadata));
	const header = stripe.webhooks.generateTestHeaderString({
		payload: payloadObject,
		secret: env.STRIPE_WEBHOOK_SECRET,
	});
	await fetch(STRIPE_WEBHOOK_ENDPOINT, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Stripe-Signature": header,
		},
		body: payloadObject,
	});
};
