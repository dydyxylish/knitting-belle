"use client";

import { ThumbnailCarousel } from "../_components/ThumbnailCarousel";

interface DetailYarnCraftImagePresentationProps {
	slides: string[];
}
export const DetailYarnCraftImagePresentation = ({
	slides,
}: DetailYarnCraftImagePresentationProps) => {
	return <ThumbnailCarousel slides={slides} />;
};
