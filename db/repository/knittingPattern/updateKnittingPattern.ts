import {
	mutateKnittingPattern,
	type mutateKnittingPatternArgs,
} from "@/db/query/knittingPattern/mutateKnittingPattern";

export const updateKnittingPattern = (args: mutateKnittingPatternArgs) =>
	mutateKnittingPattern(args);
