"use client";

import { AlertTriangle, Mail } from "lucide-react";

export default function ErrorPage({
	error,
}: {
	error: Error;
	reset: () => void;
}) {
	const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-transparent">
			<div className="relative">
				<div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-red-400 to-orange-500 opacity-20 blur-xl"></div>
				<div className="relative rounded-full bg-white p-6 shadow-lg">
					<AlertTriangle className="h-8 w-8 text-red-600" />
				</div>
			</div>
			<div className="mx-4 mt-6 max-w-md text-center">
				<h2 className="mb-4 font-bold text-2xl text-gray-800">
					エラーが発生しました
				</h2>
				<div className="mb-6 rounded-lg bg-red-50 p-4 shadow-sm">
					<p className="break-words text-red-700 text-sm">{error.message}</p>
				</div>
				{contactEmail && (
					<div className="rounded-lg bg-gray-50 p-4 shadow-sm">
						<div className="flex items-center justify-center gap-2 text-gray-600">
							<span className="text-sm">
								お困りの場合は、こちらまでお問い合わせください
							</span>
						</div>
						<div className="flex items-center justify-center gap-2">
							<Mail className="mt-2 h-4 w-4" />
							<a
								href={`mailto:${contactEmail}`}
								className="mt-2 inline-block text-cyan-600 hover:text-cyan-700 hover:underline"
							>
								{contactEmail}
							</a>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
