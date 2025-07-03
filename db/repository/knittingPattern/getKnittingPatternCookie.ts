import { queryKnittingPatternsCookie } from "@/db/query/knittingPattern/queryKnittingPatternCookie";

export const getKnittingPatternCookie = async (slug: string) =>
	await queryKnittingPatternsCookie(slug);
