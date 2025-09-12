"use client";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { v4 as uuidV4 } from "uuid";

import type { CarouselOptions } from "@/app/_components/ui/carousel";
import { ScrollArea, ScrollBar } from "@/app/_components/ui/scroll-area";
import { Thumb } from "./Thumb";

type PropType = {
	slides: string[]; // 画像URLの配列
	options?: CarouselOptions;
};

export const ThumbnailCarousel: React.FC<PropType> = ({ slides, options }) => {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [emblaMainRef, emblaMainApi] = useEmblaCarousel(options);
	const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
		containScroll: "keepSnaps",
		dragFree: true,
	});

	const onThumbClick = useCallback(
		(index: number) => {
			if (!emblaMainApi) return;
			emblaMainApi.scrollTo(index);
		},
		[emblaMainApi],
	);

	const onSelect = useCallback(() => {
		if (!emblaMainApi || !emblaThumbsApi) return;
		const snap = emblaMainApi.selectedScrollSnap();
		setSelectedIndex(snap);
		emblaThumbsApi.scrollTo(snap);
	}, [emblaMainApi, emblaThumbsApi]);

	useEffect(() => {
		if (!emblaMainApi) return;
		onSelect();
		emblaMainApi.on("select", onSelect).on("reInit", onSelect);
	}, [emblaMainApi, onSelect]);

	return (
		<div className="w-full">
			{/* メインカルーセル */}
			<div className="overflow-hidden" ref={emblaMainRef}>
				<div className="flex">
					{slides.map((url, index) => (
						<div className="flex-[0_0_100%]" key={uuidV4()}>
							<Image
								src={url}
								alt={`slide-${index}`}
								className="h-auto w-full object-cover"
								width={500}
								height={500}
								{...{ priority: index === 0 ? true : undefined }}
							/>
						</div>
					))}
				</div>
			</div>

			{/* サムネイル */}
			<ScrollArea ref={emblaThumbsRef}>
				<div className="flex gap-2 p-2">
					{slides.map((url, index) => (
						<Thumb
							key={uuidV4()}
							onClick={() => onThumbClick(index)}
							selected={index === selectedIndex}
							imgSrc={url}
						/>
					))}
				</div>
				<ScrollBar orientation="horizontal" className="h-[0.375rem]" />
			</ScrollArea>
		</div>
	);
};
