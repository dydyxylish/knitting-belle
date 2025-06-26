import { getCachedKnittingPattern } from "@/app/_lib/fetch/knittingPattern/getCachedKnittingPattern";
import { ConfirmYarnCraftImage } from "../ConfirmYarnCraftImage";
import { ConfirmKnittingPatternPresentation } from "./presentation";

interface ConfirmKnittingPatternContainerProps {
	id: string;
}
export const ConfirmKnittingPatternContainer = async ({
	id,
}: ConfirmKnittingPatternContainerProps) => {
	const knittingPattern = await getCachedKnittingPattern(id);
	return (
		<ConfirmKnittingPatternPresentation knittingPattern={knittingPattern}>
			<ConfirmYarnCraftImage knittingPatternId={knittingPattern.id} />
		</ConfirmKnittingPatternPresentation>
	);
};
