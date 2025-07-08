import { queryYarnCraftImagesBySortOrder } from "@/db/query/yarnCraftImage/queryYarnCraftImagesBySortOrder";

export const getYarnCraftImagesBySortOrder = async (sortOrder: number) =>
	await queryYarnCraftImagesBySortOrder(sortOrder);
