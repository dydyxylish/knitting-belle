import { getCachedYarnCraftImage } from "@/app/_lib/fetch/yarnCraftImage/getCachedYarnCraftImage";
import { YarnCraftImagePresentation } from "./presentation";

interface YarnCraftImageContainerProps {
	knittingPatternSlug: string;
}

export const YarnCraftImageContainer = async ({
	knittingPatternSlug,
}: YarnCraftImageContainerProps) => {
	const yarnCraftImages = await getCachedYarnCraftImage(knittingPatternSlug);
	return <YarnCraftImagePresentation yarnCraftImages={yarnCraftImages} />;
};
