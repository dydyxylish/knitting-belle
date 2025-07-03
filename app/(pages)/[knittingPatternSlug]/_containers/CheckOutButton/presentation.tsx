"use client";

import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import type { z } from "zod";

import { makePayment } from "@/app/_lib/serverAction/payment";
import { paymentSchema } from "@/lib/schema";

export const CheckOutButtonPresentation = ({
	knittingPatternSlug,
}: z.infer<typeof paymentSchema>) => {
	const [form, fields] = useForm({
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: paymentSchema });
		},
	});
	return form.valid ? (
		<form id={form.id} action={makePayment} noValidate>
			<input
				hidden
				name={fields.knittingPatternSlug.name}
				defaultValue={knittingPatternSlug}
			/>
			<button type="submit">購入する</button>
		</form>
	) : (
		<button type="button" disabled>
			購入するにはログインしてください
		</button>
	);
};
