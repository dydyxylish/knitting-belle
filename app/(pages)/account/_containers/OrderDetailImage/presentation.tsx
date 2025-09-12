import Image from "next/image";

import type { Schema } from "@/amplify/data/resource";
import { generateImageUrl } from "@/app/_lib/fetch/yarnCraftImage/generateImageUrl";

interface OrderDetailImagePresentationProps {
	topImage: Schema["YarnCraftImage"]["type"];
}

export const OrderDetailImagePresentation = ({
	topImage,
}: OrderDetailImagePresentationProps) => (
	<Image
		src={generateImageUrl({ path: topImage.imagePath })}
		alt={topImage.alt}
		width={80}
		height={80}
	/>
);
