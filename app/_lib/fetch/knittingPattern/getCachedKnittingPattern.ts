import { unstable_cache } from "next/cache";

import { runWithAmplifyServerContext } from "@/app/_lib/createAmplifyServerRunner";
import { getKnittingPattern } from "@/db/repository/knittingPattern/getKnittingPattern";

export const getCachedKnittingPattern = unstable_cache(
	async (slug) =>
		await runWithAmplifyServerContext({
			nextServerContext: null,
			operation: () => getKnittingPattern(slug),
		}),
	["knitting-pattern"],
	{
		tags: ["knittingPattern"],
		revalidate: false,
	},
);
