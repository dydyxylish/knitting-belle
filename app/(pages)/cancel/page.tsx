import Link from "next/link";

import { env } from "@/lib/env";

export default function CancelPage() {
	return (
		<div className="flex min-h-screen items-center justify-center px-4 py-8">
			<div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
				<div className="mb-6">
					<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
						<svg
							className="h-8 w-8 text-red-500"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-label="キャンセル"
						>
							<title>キャンセル</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</div>
				</div>

				<h1 className="mb-4 font-bold text-2xl text-gray-800">
					ご注文がキャンセルされました
				</h1>
				<p className="mb-8 text-gray-600 leading-relaxed">
					お支払い処理がキャンセルされました。
					<br />
					ご不明な点がございましたら、お気軽にお問い合わせください。
				</p>

				<div className="space-y-4">
					<Link
						href="/"
						className="block w-full transform rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-3 font-semibold text-white transition-all duration-200 hover:scale-105 hover:from-pink-600 hover:to-rose-600"
					>
						ホームに戻る
					</Link>
				</div>

				<div className="mt-8 border-gray-100 border-t pt-6">
					<p className="mb-2 text-gray-500 text-sm">
						お問い合わせは以下までお問い合わせください
					</p>
					<a
						href={`mailto:${env.NEXT_PUBLIC_CONTACT_EMAIL}`}
						className="font-medium text-pink-600 text-sm underline hover:text-pink-700"
					>
						{env.NEXT_PUBLIC_CONTACT_EMAIL}
					</a>
				</div>
			</div>
		</div>
	);
}
