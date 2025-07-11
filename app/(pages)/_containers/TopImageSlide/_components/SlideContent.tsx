import Image from "next/image";
import { v4 as uuidV4 } from "uuid";

import type { Schema } from "@/amplify/data/resource";
import { CarouselContent, CarouselItem } from "@/app/_components/ui/carousel";
import { cn } from "@/app/_lib/tailwindUtils";

interface SlideContentProps {
	topImages: Omit<Schema["YarnCraftImage"]["type"], "knittingPattern">[];
}

const rotateDegList = [
	"rotate-[6deg]",
	"rotate-[10deg]",
	"-rotate-[6deg]",
	"-rotate-[10deg]",
] as const;

const getRotateDeg = (random: number) => {
	return rotateDegList[Math.abs(random % rotateDegList.length)];
};

export const SlideContent = ({ topImages }: SlideContentProps) => (
	<CarouselContent className=" bg-slate-200/50 p-8 pt-20 pb-12">
		{topImages.map((img, index) => (
			<CarouselItem key={uuidV4()} className="">
				<Image
					src={img.imagePath}
					alt={img.alt}
					width={500}
					height={500}
					{...{ priority: index === 0 ? true : undefined }}
					className={cn(
						"mx-auto origin-center rounded-sm border-[14px] border-white border-b-[50px] shadow-xl",
						getRotateDeg(index),
					)}
				/>
			</CarouselItem>
		))}
	</CarouselContent>
);
