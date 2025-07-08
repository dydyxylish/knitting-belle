import { getYarnCraftImageCookie } from "@/db/repository/yarnCraftImage/getYarnCraftImageCookie";
import { getImagePaths } from "./getImagePaths";

export const getImagePathsBySlugWithCookie = async (
	knittingPatternSlug: string,
) => {
	const yarnCraftImages = await getYarnCraftImageCookie(knittingPatternSlug);
	return getImagePaths({ yarnCraftImages });
};
