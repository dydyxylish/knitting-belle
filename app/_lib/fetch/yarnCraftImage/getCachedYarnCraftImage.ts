import { unstable_cache } from "next/cache";

import { runWithAmplifyServerContext } from "@/app/_lib/amplifyServerUtils";
import { getYarnCraftImage } from "@/db/repository/yarnCraftImage/getYarnCraftImage";

export const getCachedYarnCraftImage = unstable_cache(
	async (knittingPatternId) =>
		await runWithAmplifyServerContext({
			nextServerContext: null,
			operation: () => getYarnCraftImage(knittingPatternId),
		}),
	["yarn-craft-image"],
	{
		tags: ["yarnCraftImage"],
		revalidate: false,
	},
);
