import "server-only";

import { unstable_cache } from "next/cache";

import { getKnittingPatternList } from "@/db/repository/knittingPattern/getKnittingPatternList";
import { runWithAmplifyServerContext } from "@/lib/amplifyServerUtils";
import { KnittingPattern } from "../knittingPattern";
import { KnittingPatternListPresentation } from "./presentation";

const getCachedKnittingPatternList = unstable_cache(
	async () =>
		await runWithAmplifyServerContext({
			nextServerContext: null,
			operation: () => getKnittingPatternList(),
		}),
	["top-knitting-pattern-list"],
	{
		tags: ["knittingPattern"],
		revalidate: false,
	},
);

export const KnittingPatternListContainer = async () => {
	const knittingPatterns = await getCachedKnittingPatternList();

	return (
		<KnittingPatternListPresentation>
			{knittingPatterns.map(({ id }) => (
				<KnittingPattern id={id} key={id}></KnittingPattern>
			))}
		</KnittingPatternListPresentation>
	);
};
