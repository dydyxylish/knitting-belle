import Link from "next/link";
import { Suspense } from "react";

import { env } from "@/lib/env";
import { FallbackThanks } from "./_components/FallbackThanks";
import { ThanksComment } from "./_components/ThanksComment";
import { ValidateWrapper } from "./_containers/ValidateWrapper";

export default async function Page({
	searchParams,
}: {
	searchParams: Promise<{ session_id?: string }>;
}) {
	const { session_id: sessionId } = await searchParams;
	return (
		<div className="flex flex-col items-center">
			<Suspense fallback={<FallbackThanks />}>
				<ThanksComment />
				<div className="mt-6 flex flex-col items-center gap-6 px-8 font-kiwi">
					<h1 className="text-xl">ご購入ありがとうございます</h1>
					<p>以下のボタンから、PDFファイルをダウンロードしてください</p>
					<span>
						※このページのダウンロードリンクは約{env.SIGNED_URL_EXPIRE_MINUTES}
						分間有効です。期限後は
						<Link href="/account" className="text-blue-600 text-sm underline">
							マイページ
						</Link>
						から再取得してください。
					</span>
					<span>※マイページからのダウンロードは何度でも可能です。</span>
				</div>
				<div className="mt-10">
					<ValidateWrapper sessionId={sessionId} />
				</div>
			</Suspense>
		</div>
	);
}
