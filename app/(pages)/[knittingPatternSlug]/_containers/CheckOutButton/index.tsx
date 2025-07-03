import { CheckOutButtonContainer } from "./container";

interface CheckOutButtonProps {
	knittingPatternSlug: string;
}

export const CheckOutButton = ({
	knittingPatternSlug,
}: CheckOutButtonProps) => (
	<CheckOutButtonContainer knittingPatternSlug={knittingPatternSlug} />
);
