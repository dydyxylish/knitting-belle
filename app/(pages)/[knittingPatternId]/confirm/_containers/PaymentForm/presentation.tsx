"use client";

import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import type { z } from "zod";

import { makePayment } from "@/app/_lib/serverAction/payment";
import { paymentSchema, type uuidSchema } from "@/lib/schema";

interface PaymentFormPresentationProps {
	knittingPatternId: z.infer<typeof uuidSchema>;
}

export const PaymentFormPresentation = ({
	knittingPatternId,
}: PaymentFormPresentationProps) => {
	const [form, fields] = useForm({
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: paymentSchema });
		},
	});
	return form.valid ? (
		<form id={form.id} action={makePayment} noValidate>
			<input
				hidden
				name={fields.knittingPatternId.name}
				defaultValue={knittingPatternId}
			/>
			<button type="submit">購入する</button>
		</form>
	) : (
		<button type="button" disabled>
			購入するにはログインしてください
		</button>
	);
};
