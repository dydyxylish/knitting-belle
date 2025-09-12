import { CheckOutButtonPresentation } from "./presentation";

interface CheckOutButtonContainerProps {
	knittingPatternSlug: string;
}
export const CheckOutButtonContainer = async ({
	knittingPatternSlug,
}: CheckOutButtonContainerProps) => {
	return (
		<CheckOutButtonPresentation knittingPatternSlug={knittingPatternSlug} />
	);
};
