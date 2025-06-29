import { getCachedYarnCraftImage } from "@/app/_lib/fetch/yarnCraftImage/getCachedYarnCraftImage";
import { DetailYarnCraftImagePresentation } from "./presentation";

interface DetailYarnCraftImageContainerProps {
	knittingPatternSlug: string;
}

export const DetailYarnCraftImageContainer = async ({
	knittingPatternSlug,
}: DetailYarnCraftImageContainerProps) => {
	const yarnCraftImages = await getCachedYarnCraftImage(knittingPatternSlug);
	return <DetailYarnCraftImagePresentation yarnCraftImages={yarnCraftImages} />;
};
