import { YarnCraftImageContainer } from "./container";

interface YarnCraftImageProps {
	knittingPatternSlug: string;
}

export const YarnCraftImage = ({
	knittingPatternSlug,
}: YarnCraftImageProps) => (
	<YarnCraftImageContainer knittingPatternSlug={knittingPatternSlug} />
);
