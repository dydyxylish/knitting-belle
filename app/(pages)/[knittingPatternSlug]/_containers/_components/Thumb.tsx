"use client";
import Image from "next/image";
import type React from "react";

// 静的なプレースホルダー（サーバー/クライアント共通）
const PLACEHOLDER_SVG =
	"data:image/svg+xml;charset=utf-8,%3Csvg width='72' height='56' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23d1d5db'/%3E%3C/svg%3E";

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
				placeholder="blur"
				blurDataURL={PLACEHOLDER_SVG}
			/>
		</button>
	);
};
