import { runWithAmplifyServerContext } from "@/app/_lib/createAmplifyServerRunner";
import { getKnittingPatternWithAuthClient } from "@/db/repository/knittingPattern/getKnittingPatternWithAuth";
import { loginAdmin } from "../../loginAdmin";

export const getKnittingPatternWithAuth = async (slug: string) =>
	await runWithAmplifyServerContext({
		nextServerContext: null,
		operation: async () => {
			await loginAdmin();
			return await getKnittingPatternWithAuthClient(slug);
		},
	});
