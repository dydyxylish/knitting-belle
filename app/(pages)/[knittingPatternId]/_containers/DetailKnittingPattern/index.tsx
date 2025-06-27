import { DetailKnittingPatternContainer } from "./container";

interface DetailKnittingPatternProps {
	id: string;
}

export const DetailKnittingPattern = ({ id }: DetailKnittingPatternProps) => (
	<DetailKnittingPatternContainer id={id} />
);
