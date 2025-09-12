import {
	mutateKnittingPattern,
	type mutateKnittingPatternArgs,
} from "@/db/query/knittingPattern/mutateKnittingPattern";

export const updateKnittingPattern = async (args: mutateKnittingPatternArgs) =>
	await mutateKnittingPattern(args);
