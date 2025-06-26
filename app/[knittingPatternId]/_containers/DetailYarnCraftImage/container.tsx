import { getCachedYarnCraftImage } from "@/app/_lib/fetch/yarnCraftImage/getCachedYarnCraftImage";
import { DetailYarnCraftImagePresentation } from "./presentation";

interface DetailYarnCraftImageContainerProps {
	knittingPatternId: string;
}

export const DetailYarnCraftImageContainer = async ({
	knittingPatternId,
}: DetailYarnCraftImageContainerProps) => {
	const yarnCraftImages = await getCachedYarnCraftImage(knittingPatternId);
	return <DetailYarnCraftImagePresentation yarnCraftImages={yarnCraftImages} />;
};
