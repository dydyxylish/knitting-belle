import { DetailKnittingPatternContainer } from "./container";

interface DetailKnittingPatternProps {
	slug: string;
}

export const DetailKnittingPattern = ({ slug }: DetailKnittingPatternProps) => (
	<DetailKnittingPatternContainer slug={slug} />
);
