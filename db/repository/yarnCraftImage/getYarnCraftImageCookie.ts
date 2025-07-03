import { queryYarnCraftImageCookie } from "@/db/query/yarnCraftImage/queryYarnCraftImageCookie";

export const getYarnCraftImageCookie = async (knittingPatternSlug: string) =>
	await queryYarnCraftImageCookie(knittingPatternSlug);
