import { KnittingPatternContainer } from "./container";

interface KnittingPatternProps {
	slug: string;
}

export const KnittingPattern = ({ slug }: KnittingPatternProps) => (
	<KnittingPatternContainer slug={slug} />
);
