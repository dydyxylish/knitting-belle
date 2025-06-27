import { KnittingPatternContainer } from "./container";

interface KnittingPatternProps {
	id: string;
}

export const KnittingPattern = ({ id }: KnittingPatternProps) => (
	<KnittingPatternContainer id={id} />
);
