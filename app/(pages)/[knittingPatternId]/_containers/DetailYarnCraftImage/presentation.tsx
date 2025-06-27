import type { Schema } from "@/amplify/data/resource";

interface DetailYarnCraftImagePresentationProps {
	yarnCraftImages: Schema["YarnCraftImage"]["type"][];
}
export const DetailYarnCraftImagePresentation = ({
	yarnCraftImages,
}: DetailYarnCraftImagePresentationProps) => {
	return yarnCraftImages.map((yarnCraftImage) => (
		<div key={yarnCraftImage.id}>
			<p>{yarnCraftImage.id}</p>
			<p>{yarnCraftImage.imagePath}</p>
			<p>{yarnCraftImage.alt}</p>
		</div>
	));
};
