import { unstable_cache } from "next/cache";

import { runWithAmplifyServerContext } from "@/app/_lib/createAmplifyServerRunner";
import { getKnittingPatternList } from "@/db/repository/knittingPattern/getKnittingPatternList";

export const getCachedKnittingPatternList = unstable_cache(
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
