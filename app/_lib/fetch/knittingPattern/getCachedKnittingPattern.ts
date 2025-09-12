import { unstable_cache } from "next/cache";

import { getKnittingPattern } from "@/db/repository/knittingPattern/getKnittingPattern";

export const getCachedKnittingPattern = unstable_cache(
	async (slug) => await getKnittingPattern(slug),
	["knitting-pattern"],
	{
		tags: ["knittingPattern"],
		revalidate: false,
	},
);
