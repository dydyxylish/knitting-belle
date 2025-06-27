import { getCachedKnittingPattern } from "@/app/_lib/fetch/knittingPattern/getCachedKnittingPattern";
import { PaymentFormPresentation } from "./presentation";

interface PaymentFormContainerProps {
	knittingPatternId: string;
}
export const PaymentFormContainer = async ({
	knittingPatternId,
}: PaymentFormContainerProps) => {
	const knittingPattern = await getCachedKnittingPattern(knittingPatternId);
	return <PaymentFormPresentation knittingPatternId={knittingPattern.id} />;
};
