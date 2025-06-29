import "server-only";

import { getCachedKnittingPatternList } from "@/app/_lib/fetch/knittingPattern/getCachedKnittingPatternList";
import { KnittingPattern } from "../knittingPattern";
import { KnittingPatternListPresentation } from "./presentation";

export const KnittingPatternListContainer = async () => {
	const knittingPatterns = await getCachedKnittingPatternList();

	return (
		<KnittingPatternListPresentation>
			{knittingPatterns.map(({ slug }) => (
				<KnittingPattern slug={slug} key={slug}></KnittingPattern>
			))}
		</KnittingPatternListPresentation>
	);
};
