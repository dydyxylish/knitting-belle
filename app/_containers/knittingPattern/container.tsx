import { getCachedKnittingPattern } from "@/app/_lib/fetch/knittingPattern/getCachedKnittingPattern";
import { YarnCraftImage } from "../yarnCraftImage";
import { KnittingPatternPresentation } from "./presentation";

interface KnittingPatternContainerProps {
	id: string;
}

export const KnittingPatternContainer = async ({
	id,
}: KnittingPatternContainerProps) => {
	const knittingPattern = await getCachedKnittingPattern(id);
	return (
		<KnittingPatternPresentation knittingPattern={knittingPattern}>
			<YarnCraftImage knittingPatternId={knittingPattern.id} />
		</KnittingPatternPresentation>
	);
};
