import { v4 as uuidV4 } from "uuid";

import type { Schema } from "@/amplify/data/resource";

interface DetailYarnCraftImagePresentationProps {
	yarnCraftImages: Schema["YarnCraftImage"]["type"][];
}
export const DetailYarnCraftImagePresentation = ({
	yarnCraftImages,
}: DetailYarnCraftImagePresentationProps) => {
	return yarnCraftImages.map((yarnCraftImage) => (
		<div key={uuidV4()}>
			<p>{yarnCraftImage.imagePath}</p>
			<p>{yarnCraftImage.alt}</p>
		</div>
	));
};
