import { getCachedYarnCraftImage } from "@/app/_lib/fetch/yarnCraftImage/getCachedYarnCraftImage";
import { ConfirmYarnCraftImagePresentation } from "./presentation";

interface ConfirmYarnCraftImageContainerProps {
	knittingPatternId: string;
}

export const ConfirmYarnCraftImageContainer = async ({
	knittingPatternId,
}: ConfirmYarnCraftImageContainerProps) => {
	const yarnCraftImages = await getCachedYarnCraftImage(knittingPatternId);
	return (
		<ConfirmYarnCraftImagePresentation yarnCraftImages={yarnCraftImages} />
	);
};
