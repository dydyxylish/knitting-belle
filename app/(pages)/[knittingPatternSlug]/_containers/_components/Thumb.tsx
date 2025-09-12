"use client";
import Image from "next/image";
import type React from "react";

import { ImageSkelton } from "./ImageSkelton";

type PropType = {
	selected: boolean;
	imgSrc: string;
	onClick: () => void;
};

export const Thumb: React.FC<PropType> = ({ selected, imgSrc, onClick }) => {
	return (
		<button
			type="button"
			onClick={onClick}
			className={`h-16 w-20 overflow-hidden rounded-sm border-4 transition-all duration-200 ${selected ? " border-secondary" : "border-transparent"}`}
		>
			<Image
				src={imgSrc}
				alt="thumbnail"
				className="h-full w-full object-cover"
				width={72}
				height={56}
				placeholder={`data:image/svg+xml;base64,${window.btoa(ImageSkelton(72, 56))}`}
			/>
		</button>
	);
};
