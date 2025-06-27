import { getCachedYarnCraftImage } from "@/app/_lib/fetch/yarnCraftImage/getCachedYarnCraftImage";
import { YarnCraftImagePresentation } from "./presentation";

interface YarnCraftImageContainerProps {
	knittingPatternId: string;
}

export const YarnCraftImageContainer = async ({
	knittingPatternId,
}: YarnCraftImageContainerProps) => {
	const yarnCraftImages = await getCachedYarnCraftImage(knittingPatternId);
	return <YarnCraftImagePresentation yarnCraftImages={yarnCraftImages} />;
};
