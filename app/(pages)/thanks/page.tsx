import Link from "next/link";
import { Suspense } from "react";

import { FallbackButton } from "./_components/FallbackButton";
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
			<ThanksComment />
			<div className="mt-6 flex flex-col items-center gap-6 px-8 font-kiwi">
				<h1 className="text-xl">ご購入ありがとうございます</h1>
				<p>以下のボタンから、PDFファイルをダウンロードしてください</p>
				<span>
					※ご購入後は
					<Link href="/account" className="text-blue-600 text-sm underline">
						マイページ
					</Link>
					から、いつでも再ダウンロード可能です
				</span>
			</div>
			<div className="mt-10">
				<Suspense fallback={<FallbackButton />}>
					<ValidateWrapper sessionId={sessionId} />
				</Suspense>
			</div>
		</div>
	);
}
