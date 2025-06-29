import { queryKnittingPatternWithAuth } from "@/db/query/knittingPattern/queryKnittingPatternWithAuth";

export const getKnittingPatternWithAuth = async (slug: string) =>
	await queryKnittingPatternWithAuth(slug);
