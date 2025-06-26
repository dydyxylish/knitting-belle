import { getCachedKnittingPatternList } from "@/app/_lib/fetch/knittingPattern/getCachedKnittingPatternList";
import { ConfirmKnittingPattern } from "./_containers/ConfirmKnittingPattern";

export async function generateStaticParams() {
	const knittingPatternList = await getCachedKnittingPatternList();
	return knittingPatternList.map(({ id }) => ({ knittingPatternId: id }));
}

export default async function Page({
	params,
}: {
	params: Promise<{ knittingPatternId: string }>;
}) {
	const { knittingPatternId: id } = await params;
	return <ConfirmKnittingPattern id={id} />;
}
