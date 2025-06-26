import { DetailYarnCraftImageContainer } from "./container";

interface DetailYarnCraftImageProps {
	knittingPatternId: string;
}

export const DetailYarnCraftImage = async ({
	knittingPatternId,
}: DetailYarnCraftImageProps) => {
	return (
		<DetailYarnCraftImageContainer knittingPatternId={knittingPatternId} />
	);
};
