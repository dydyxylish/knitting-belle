import { queryKnittingPatternList } from "@/db/query/knittingPattern/queryKnittingPatterns";

export const getKnittingPatternList = async () =>
	await queryKnittingPatternList();
