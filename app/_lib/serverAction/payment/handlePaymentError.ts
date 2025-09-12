import "server-only";

import { redirect } from "next/navigation";

import type { PaymentResult, PaymentValidationResult } from "./types";

export function handlePaymentError(
	validationResult: PaymentValidationResult,
): PaymentResult | undefined {
	if (validationResult.success) return;

	const error = validationResult.error;

	switch (error.type) {
		case "FORM_ERROR":
		case "PRODUCT_ERROR":
			redirect("/cancel");
			break;

		case "AUTH_ERROR":
			if (error.submission) {
				error.submission.reply({
					fieldErrors: {
						sessionError: [
							"セッションがきれています。再度ログインしてください",
						],
					},
				});
				return {
					error: {
						sessionError: "セッションがきれています。再度ログインしてください",
					},
				};
			}
			redirect("/cancel");
			break;

		case "DUPLICATE_ERROR":
			if (error.submission) {
				error.submission.reply({
					fieldErrors: {
						duplicateError: [`お客様は、こちらの編み図を既に購入済みです`],
					},
				});
				return {
					error: {
						duplicateError: "お客様は、こちらの編み図を既に購入済みです",
					},
				};
			}
			redirect("/cancel");
			break;

		default:
			redirect("/cancel");
	}
}
