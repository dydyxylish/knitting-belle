import type { Schema } from "@/amplify/data/resource";
import { getImagePaths } from "@/app/_lib/fetch/yarnCraftImage/getImagePaths";
import { ThumbnailCarousel } from "../_components/ThumbnailCarousel";

interface DetailYarnCraftImagePresentationProps {
	yarnCraftImages: Schema["YarnCraftImage"]["type"][];
}
export const DetailYarnCraftImagePresentation = ({
	yarnCraftImages,
}: DetailYarnCraftImagePresentationProps) => {
	return <ThumbnailCarousel slides={getImagePaths({ yarnCraftImages })} />;
};
