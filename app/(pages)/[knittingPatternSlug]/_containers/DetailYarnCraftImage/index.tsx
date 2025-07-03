import { DetailYarnCraftImageContainer } from "./container";

interface DetailYarnCraftImageProps {
	knittingPatternSlug: string;
}

export const DetailYarnCraftImage = async ({
	knittingPatternSlug,
}: DetailYarnCraftImageProps) => {
	return (
		<DetailYarnCraftImageContainer knittingPatternSlug={knittingPatternSlug} />
	);
};
