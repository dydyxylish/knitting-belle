import { getKnittingPatternWithAuth } from "@/db/repository/knittingPattern/getKnittingPatternWithAuth";

export const checkKnittingPatternExists = async (slug: string) => {
	const knittingPattern = await getKnittingPatternWithAuth(slug);
	return !(knittingPattern instanceof Error) && knittingPattern?.isPublished;
};
