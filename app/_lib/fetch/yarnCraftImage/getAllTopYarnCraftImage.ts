import { orderBy } from "es-toolkit";
import { unstable_cache } from "next/cache";

import { getYarnCraftImagesBySortOrder } from "@/db/repository/yarnCraftImage/getYarnCraftImagesBySortOrder";

export const getAllTopYarnCraftImage = unstable_cache(
	async () =>
		orderBy(await getYarnCraftImagesBySortOrder(1), ["createdAt"], ["asc"]),
	["yarn-craft-image"],
	{
		tags: ["yarnCraftImage"],
		revalidate: false,
	},
);
