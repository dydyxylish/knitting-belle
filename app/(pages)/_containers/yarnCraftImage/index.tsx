import { YarnCraftImageContainer } from "./container";

interface YarnCraftImageProps {
	knittingPatternId: string;
}

export const YarnCraftImage = ({ knittingPatternId }: YarnCraftImageProps) => (
	<YarnCraftImageContainer knittingPatternId={knittingPatternId} />
);
