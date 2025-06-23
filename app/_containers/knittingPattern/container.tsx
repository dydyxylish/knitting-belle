import { unstable_cache } from "next/cache";

import { getKnittingPattern } from "@/db/repository/knittingPattern/getKnittingPattern";
import { runWithAmplifyServerContext } from "@/lib/amplifyServerUtils";
import { YarnCraftImage } from "../yarnCraftImage";
import { KnittingPatternPresentation } from "./presentation";

interface KnittingPatternContainerProps {
	id: string;
}

const getCachedKnittingPattern = unstable_cache(
	async (id) =>
		await runWithAmplifyServerContext({
			nextServerContext: null,
			operation: () => getKnittingPattern(id),
		}),
	["knitting-pattern"],
	{
		tags: ["knittingPattern"],
		revalidate: false,
	},
);

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
