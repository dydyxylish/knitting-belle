import { cookies } from "next/headers";

import { getKnittingPatternCookie } from "@/db/repository/knittingPattern/getKnittingPatternCookie";
import { runWithAmplifyServerContext } from "../../createAmplifyServerRunner";

export const getKnittingPattern = async (slug: string) => {
	return await runWithAmplifyServerContext({
		nextServerContext: { cookies },
		operation: async () => await getKnittingPatternCookie(slug),
	});
};
