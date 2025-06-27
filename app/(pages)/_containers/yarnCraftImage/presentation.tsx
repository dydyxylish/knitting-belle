import type { Schema } from "@/amplify/data/resource";

interface YarnCraftImagePresentationProps {
	yarnCraftImages: Schema["YarnCraftImage"]["type"][];
}
export const YarnCraftImagePresentation = ({
	yarnCraftImages,
}: YarnCraftImagePresentationProps) => {
	return yarnCraftImages.map((yarnCraftImage) => (
		<div key={yarnCraftImage.id}>
			<p>{yarnCraftImage.id}</p>
			<p>{yarnCraftImage.imagePath}</p>
			<p>{yarnCraftImage.title}</p>
			<p>{yarnCraftImage.sortOrder}</p>
		</div>
	));
};
