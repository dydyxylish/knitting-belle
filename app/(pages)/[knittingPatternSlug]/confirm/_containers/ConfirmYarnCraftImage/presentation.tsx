import { v4 as uuidV4 } from "uuid";

import type { Schema } from "@/amplify/data/resource";

interface ConfirmYarnCraftImagePresentationProps {
	yarnCraftImages: Schema["YarnCraftImage"]["type"][];
}
export const ConfirmYarnCraftImagePresentation = ({
	yarnCraftImages,
}: ConfirmYarnCraftImagePresentationProps) => {
	return yarnCraftImages.map((yarnCraftImage) => (
		<div key={uuidV4()}>
			<p>{yarnCraftImage.imagePath}</p>
			<p>{yarnCraftImage.alt}</p>
		</div>
	));
};
