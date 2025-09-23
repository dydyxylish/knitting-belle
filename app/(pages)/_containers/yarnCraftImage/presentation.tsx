import Image from "next/image";
import Link from "next/link";

import type { Schema } from "@/amplify/data/resource";
import { PLACEHOLDER_SVG } from "@/app/_components/BlurDataUrl";
import { CardContent } from "@/app/_components/ui/card";
import { generateImageUrl } from "@/app/_lib/fetch/yarnCraftImage/generateImageUrl";

interface YarnCraftImagePresentationProps {
	yarnCraftImages: Schema["YarnCraftImage"]["type"][];
}
export const YarnCraftImagePresentation = ({
	yarnCraftImages,
}: YarnCraftImagePresentationProps) => {
	if (yarnCraftImages.length === 0) return null; // TODO フォールバック画像を表示
	const topImage = yarnCraftImages.reduce((min, img) =>
		img.sortOrder < min.sortOrder ? img : min,
	);
	return (
		<CardContent className="">
			<Link href={`/${topImage.knittingPatternSlug}`}>
				<Image
					src={generateImageUrl({ path: topImage.imagePath })}
					alt={topImage.alt}
					width={500}
					height={500}
					sizes="640px"
					placeholder="blur"
					blurDataURL={PLACEHOLDER_SVG}
					className="rounded-xl border border-slate-300"
				/>
			</Link>
		</CardContent>
	);
};
