import { ConfirmKnittingPatternContainer } from "./container";

interface ConfirmKnittingPatternProps {
	id: string;
}

export const ConfirmKnittingPattern = ({ id }: ConfirmKnittingPatternProps) => (
	<ConfirmKnittingPatternContainer id={id} />
);
