import { Suspense } from "react";

import { getCachedKnittingPatternList } from "@/app/_lib/fetch/knittingPattern/getCachedKnittingPatternList";
import { AuthOrCheckOut } from "./_containers/AuthOrCheckOut";
import { DetailKnittingPattern } from "./_containers/DetailKnittingPattern";

export async function generateStaticParams() {
	const knittingPatternList = await getCachedKnittingPatternList();
	return knittingPatternList.map(({ slug }) => ({ knittingPatternSlug: slug }));
}

export default async function Page({
	params,
}: {
	params: Promise<{ knittingPatternSlug: string }>;
}) {
	const { knittingPatternSlug: slug } = await params;
	return (
		<>
			<DetailKnittingPattern slug={slug} />
			<Suspense fallback="loooooooooading">
				<AuthOrCheckOut knittingPatternSlug={slug} />
			</Suspense>
		</>
	);
}
