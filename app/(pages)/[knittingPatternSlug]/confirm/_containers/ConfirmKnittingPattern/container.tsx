import { getCachedKnittingPattern } from "@/app/_lib/fetch/knittingPattern/getCachedKnittingPattern";
import { ConfirmYarnCraftImage } from "../ConfirmYarnCraftImage";
import { ConfirmKnittingPatternPresentation } from "./presentation";

interface ConfirmKnittingPatternContainerProps {
	slug: string;
}
export const ConfirmKnittingPatternContainer = async ({
	slug,
}: ConfirmKnittingPatternContainerProps) => {
	const knittingPattern = await getCachedKnittingPattern(slug);
	return (
		<ConfirmKnittingPatternPresentation knittingPattern={knittingPattern}>
			<ConfirmYarnCraftImage knittingPatternSlug={knittingPattern.slug} />
		</ConfirmKnittingPatternPresentation>
	);
};
