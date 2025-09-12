import { unstable_cache } from "next/cache";

import { getYarnCraftImage } from "@/db/repository/yarnCraftImage/getYarnCraftImage";

export const getCachedYarnCraftImage = unstable_cache(
	async (knittingPatternSlug: string) =>
		await getYarnCraftImage(knittingPatternSlug),
	["yarn-craft-image"],
	{
		tags: ["yarnCraftImage"],
		revalidate: false,
	},
);
