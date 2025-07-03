import { signOut } from "aws-amplify/auth";
import { getUrl } from "aws-amplify/storage";

import { runWithAmplifyServerContext } from "../../amplifyServerUtils";
import { loginAdmin } from "../../loginAdmin";

export const generateSignedUrl = async (path: string) =>
	await runWithAmplifyServerContext({
		nextServerContext: null,
		async operation() {
			await loginAdmin();
			const knittingPatternPdf = await getUrl({
				path,
				options: {
					expiresIn: 300,
					bucket: "knittingPatternBucket",
				},
			});
			await signOut();
			return knittingPatternPdf.url;
		},
	});
