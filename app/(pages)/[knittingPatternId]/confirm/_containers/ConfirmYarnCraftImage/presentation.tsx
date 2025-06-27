import type { Schema } from "@/amplify/data/resource";

interface ConfirmYarnCraftImagePresentationProps {
	yarnCraftImages: Schema["YarnCraftImage"]["type"][];
}
export const ConfirmYarnCraftImagePresentation = ({
	yarnCraftImages,
}: ConfirmYarnCraftImagePresentationProps) => {
	return yarnCraftImages.map((yarnCraftImage) => (
		<div key={yarnCraftImage.id}>
			<p>{yarnCraftImage.id}</p>
			<p>{yarnCraftImage.imagePath}</p>
			<p>{yarnCraftImage.alt}</p>
		</div>
	));
};
