import { orderBy } from "es-toolkit";
import { unstable_cache } from "next/cache";

import { runWithAmplifyServerContext } from "@/app/_lib/createAmplifyServerRunner";
import { getYarnCraftImagesBySortOrder } from "@/db/repository/yarnCraftImage/getYarnCraftImagesBySortOrder";

export const getAllTopYarnCraftImage = unstable_cache(
	async () =>
		await runWithAmplifyServerContext({
			nextServerContext: null,
			operation: async () =>
				orderBy(await getYarnCraftImagesBySortOrder(1), ["createdAt"], ["asc"]),
		}),
	["yarn-craft-image"],
	{
		tags: ["yarnCraftImage"],
		revalidate: false,
	},
);
