import { notFound } from "next/navigation";

import { getCachedKnittingPattern } from "@/app/_lib/fetch/knittingPattern/getCachedKnittingPattern";
import { DetailYarnCraftImage } from "../DetailYarnCraftImage";
import { DetailKnittingPatternPresentation } from "./presentation";

interface DetailKnittingPatternContainerProps {
	slug: string;
}
export const DetailKnittingPatternContainer = async ({
	slug,
}: DetailKnittingPatternContainerProps) => {
	const knittingPattern = await getCachedKnittingPattern(slug);
	if (!knittingPattern) {
		notFound();
	}
	return (
		<DetailKnittingPatternPresentation knittingPattern={knittingPattern}>
			<DetailYarnCraftImage knittingPatternSlug={knittingPattern.slug} />
		</DetailKnittingPatternPresentation>
	);
};
