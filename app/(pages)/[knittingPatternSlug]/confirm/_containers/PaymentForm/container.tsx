import { getCachedKnittingPattern } from "@/app/_lib/fetch/knittingPattern/getCachedKnittingPattern";
import { PaymentFormPresentation } from "./presentation";

interface PaymentFormContainerProps {
	knittingPatternSlug: string;
}
export const PaymentFormContainer = async ({
	knittingPatternSlug,
}: PaymentFormContainerProps) => {
	const knittingPattern = await getCachedKnittingPattern(knittingPatternSlug);
	return <PaymentFormPresentation knittingPatternSlug={knittingPattern.slug} />;
};
