import { getCachedKnittingPattern } from "@/app/_lib/fetch/knittingPattern/getCachedKnittingPattern";
import { CheckOutButtonPresentation } from "./presentation";

interface CheckOutButtonContainerProps {
	knittingPatternSlug: string;
}
export const CheckOutButtonContainer = async ({
	knittingPatternSlug,
}: CheckOutButtonContainerProps) => {
	const knittingPattern = await getCachedKnittingPattern(knittingPatternSlug);
	return (
		<CheckOutButtonPresentation knittingPatternSlug={knittingPattern.slug} />
	);
};
