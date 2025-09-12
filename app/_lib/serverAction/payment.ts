"use server";
import "server-only";

import { redirect } from "next/navigation";

import { getLogger } from "@/lib/logger";
import { createStripeCheckoutSession } from "./payment/createStripeCheckoutSession";
import { handlePaymentError } from "./payment/handlePaymentError";
import type { PaymentResult } from "./payment/types";
import { validatePaymentRequest } from "./payment/validatePaymentRequest";

const log = getLogger(import.meta.url);

export async function makePayment(
	formData: FormData,
): Promise<PaymentResult | undefined> {
	let checkoutUrl: string;
	try {
		// Validate payment request
		const validationResult = await validatePaymentRequest(formData);

		if (!validationResult.success) {
			return handlePaymentError(validationResult);
		}

		const { knittingPattern, user } = validationResult.data;

		// Create Stripe checkout session
		checkoutUrl = await createStripeCheckoutSession(knittingPattern, user);
	} catch (error) {
		log.error({ error }, "決済処理中にエラーが発生しました");
		redirect("/cancel");
	}
	// Redirect to Stripe checkout
	redirect(checkoutUrl);
}
