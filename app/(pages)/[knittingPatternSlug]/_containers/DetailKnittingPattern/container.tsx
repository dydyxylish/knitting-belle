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
	return (
		<DetailKnittingPatternPresentation knittingPattern={knittingPattern}>
			<DetailYarnCraftImage knittingPatternSlug={knittingPattern.slug} />
		</DetailKnittingPatternPresentation>
	);
};
