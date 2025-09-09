import { unstable_cache } from "next/cache";

import { getKnittingPatternList } from "@/db/repository/knittingPattern/getKnittingPatternList";

export const getCachedKnittingPatternList = unstable_cache(
	getKnittingPatternList,
	["top-knitting-pattern-list"],
	{
		tags: ["knittingPattern"],
		revalidate: false,
	},
);
