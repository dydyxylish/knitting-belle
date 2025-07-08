"use server";
import { omit } from "es-toolkit";

import { generateImageUrl } from "@/app/_lib/fetch/yarnCraftImage/generateImageUrl";
import { getTopYarnCraftImage } from "@/app/_lib/fetch/yarnCraftImage/getTopYarnCraftImage";
import { SlideContent } from "./_components/SlideContent";
import { TopImageSlidePresentation } from "./presentation";

export const TopImageSlideContainer = async () => {
	const topImages = await getTopYarnCraftImage();
	return (
		<TopImageSlidePresentation>
			<SlideContent
				topImages={topImages
					.map((img) => omit(img, ["knittingPattern"]))
					.map((img) => ({
						...img,
						imagePath: generateImageUrl({ path: img.imagePath }),
					}))}
			/>
		</TopImageSlidePresentation>
	);
};
