import { getCachedKnittingPattern } from "@/app/_lib/fetch/knittingPattern/getCachedKnittingPattern";
import { DetailYarnCraftImage } from "../DetailYarnCraftImage";
import { DetailKnittingPatternPresentation } from "./presentation";

interface DetailKnittingPatternContainerProps {
	id: string;
}
export const DetailKnittingPatternContainer = async ({
	id,
}: DetailKnittingPatternContainerProps) => {
	const knittingPattern = await getCachedKnittingPattern(id);
	return (
		<DetailKnittingPatternPresentation knittingPattern={knittingPattern}>
			<DetailYarnCraftImage knittingPatternId={knittingPattern.id} />
		</DetailKnittingPatternPresentation>
	);
};
