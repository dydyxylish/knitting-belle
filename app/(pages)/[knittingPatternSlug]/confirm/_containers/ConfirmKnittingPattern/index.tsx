import { ConfirmKnittingPatternContainer } from "./container";

interface ConfirmKnittingPatternProps {
	slug: string;
}

export const ConfirmKnittingPattern = ({
	slug,
}: ConfirmKnittingPatternProps) => (
	<ConfirmKnittingPatternContainer slug={slug} />
);
