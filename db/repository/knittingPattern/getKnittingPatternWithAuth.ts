import { queryKnittingPatternWithAuth } from "@/db/query/knittingPattern/queryKnittingPatternWithAuth";

export const getKnittingPatternWithAuthClient = async (slug: string) =>
	await queryKnittingPatternWithAuth(slug);
