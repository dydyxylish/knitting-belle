import { getCachedYarnCraftImage } from "@/app/_lib/fetch/yarnCraftImage/getCachedYarnCraftImage";
import { getImagePaths } from "@/app/_lib/fetch/yarnCraftImage/getImagePaths";
import { DetailYarnCraftImagePresentation } from "./presentation";

interface DetailYarnCraftImageContainerProps {
	knittingPatternSlug: string;
}

export const DetailYarnCraftImageContainer = async ({
	knittingPatternSlug,
}: DetailYarnCraftImageContainerProps) => {
	const yarnCraftImages = await getCachedYarnCraftImage(knittingPatternSlug);
	const slides = getImagePaths({ yarnCraftImages });
	return <DetailYarnCraftImagePresentation slides={slides} />;
};
