import { Suspense } from "react";

import { ValidateWrapper } from "./_containers/ValidateWrapper";

export const dynamic = "force-dynamic";

export default async function Page({
	searchParams,
}: {
	searchParams: Promise<{ session_id?: string }>;
}) {
	const { session_id: sessionId } = await searchParams;
	return (
		<div>
			<p>thanks Page</p>
			<p>購入完了しました</p>
			<Suspense fallback="URLを生成中です">
				<ValidateWrapper sessionId={sessionId} />
			</Suspense>
		</div>
	);
}
