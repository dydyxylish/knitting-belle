import { unstable_cache } from "next/cache";

import { runWithAmplifyServerContext } from "@/app/_lib/createAmplifyServerRunner";
import { getYarnCraftImage } from "@/db/repository/yarnCraftImage/getYarnCraftImage";

export const getCachedYarnCraftImage = unstable_cache(
	async (knittingPatternSlug: string) =>
		await runWithAmplifyServerContext({
			nextServerContext: null,
			operation: () => getYarnCraftImage(knittingPatternSlug),
		}),
	["yarn-craft-image"],
	{
		tags: ["yarnCraftImage"],
		revalidate: false,
	},
);
