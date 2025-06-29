import { getCachedYarnCraftImage } from "@/app/_lib/fetch/yarnCraftImage/getCachedYarnCraftImage";
import { ConfirmYarnCraftImagePresentation } from "./presentation";

interface ConfirmYarnCraftImageContainerProps {
	knittingPatternSlug: string;
}

export const ConfirmYarnCraftImageContainer = async ({
	knittingPatternSlug,
}: ConfirmYarnCraftImageContainerProps) => {
	const yarnCraftImages = await getCachedYarnCraftImage(knittingPatternSlug);
	return (
		<ConfirmYarnCraftImagePresentation yarnCraftImages={yarnCraftImages} />
	);
};
