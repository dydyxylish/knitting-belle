import type { mutateKnittingPatternArgs } from "@/db/query/knittingPattern/mutateKnittingPattern";
import { updateKnittingPattern } from "@/db/repository/knittingPattern/updateKnittingPattern";

export const updateDownloadCount = async (args: mutateKnittingPatternArgs) =>
	await updateKnittingPattern(args);
