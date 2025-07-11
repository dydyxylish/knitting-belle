"use client";

import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Loader2, SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import type { z } from "zod";

import { Button } from "@/app/_components/ui/button";
import { Toaster } from "@/app/_components/ui/sonner";
import { makePayment } from "@/app/_lib/serverAction/payment";
import { paymentSchema } from "@/lib/schema";
import { LoginDialog } from "../AuthOrCheckOut/presentation";

export const CheckOutButtonPresentation = ({
	knittingPatternSlug,
}: z.infer<typeof paymentSchema>) => {
	const [form, fields] = useForm({
		defaultValue: {
			knittingPatternSlug,
		},
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: paymentSchema });
		},
	});
	const [activeSession, setActiveSession] = useState(true);
	const [isPending, startTransition] = useTransition();
	const transitionCallback = (formData: FormData) => async () => {
		const result = await makePayment(formData);
		if (result?.error) {
			console.log(result.error);
			const errors = Object.entries(result.error);
			errors.forEach(([key, msg]) => {
				switch (key) {
					case "duplicateError": {
						toast.warning(msg, {
							description: DuplicateMsg,
						});
						break;
					}
					case "sessionError": {
						setActiveSession(false);
						toast.error(msg);
						break;
					}
				}
			});
		}
	};

	const formOrLogin =
		form.valid && activeSession ? (
			<form
				id={form.id}
				action={(formData) => startTransition(transitionCallback(formData))}
				noValidate
			>
				<input
					hidden
					name={fields.knittingPatternSlug.name}
					defaultValue={knittingPatternSlug}
				/>
				<Button
					type="submit"
					disabled={isPending}
					className="flex h-11 gap-2 bg-amber-200 font-semibold text-foreground/70 tracking-wider hover:bg-amber-200"
				>
					{isPending ? (
						<>
							<Loader2 className="size-5 animate-spin" />
							処理中…
						</>
					) : (
						<>
							<SquareArrowOutUpRight />
							決済ページへ進む
						</>
					)}
				</Button>
			</form>
		) : (
			<LoginDialog />
		);

	return (
		<>
			<Toaster
				position="bottom-center"
				theme="light"
				richColors
				closeButton
				duration={Infinity}
			/>
			{formOrLogin}
		</>
	);
};

const DuplicateMsg = () => (
	<p>
		購入済みの編み図は
		<Link href="/account" className="text-blue-600 underline">
			マイページ
		</Link>
		からダウンロードできます
	</p>
);
