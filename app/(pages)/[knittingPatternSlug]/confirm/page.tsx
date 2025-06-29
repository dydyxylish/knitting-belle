import { getCachedKnittingPatternList } from "@/app/_lib/fetch/knittingPattern/getCachedKnittingPatternList";
import { ConfirmKnittingPattern } from "./_containers/ConfirmKnittingPattern";
import { PaymentForm } from "./_containers/PaymentForm";

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
			<ConfirmKnittingPattern slug={slug} />
			<PaymentForm knittingPatternSlug={slug} />
		</>
	);
}
