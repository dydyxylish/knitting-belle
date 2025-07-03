import { getCachedKnittingPattern } from "@/app/_lib/fetch/knittingPattern/getCachedKnittingPattern";
import { YarnCraftImage } from "../yarnCraftImage";
import { KnittingPatternPresentation } from "./presentation";

interface KnittingPatternContainerProps {
	slug: string;
}

export const KnittingPatternContainer = async ({
	slug,
}: KnittingPatternContainerProps) => {
	const knittingPattern = await getCachedKnittingPattern(slug);
	return (
		<KnittingPatternPresentation knittingPattern={knittingPattern}>
			<YarnCraftImage knittingPatternSlug={knittingPattern.slug} />
		</KnittingPatternPresentation>
	);
};
