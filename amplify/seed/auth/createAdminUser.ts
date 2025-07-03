import { addToUserGroup, createAndSignUpUser } from "@aws-amplify/seed";

import { getLogger } from "@/lib/logger";

const log = getLogger(import.meta.url);

interface createAdminUserArgs {
	username: string;
	password: string;
}

export const createAdminUser = async ({
	username,
	password,
}: createAdminUserArgs) => {
	try {
		const adminUser = await createAndSignUpUser({
			username: username,
			password: password,
			signInAfterCreation: false,
			signInFlow: "Password",
			userAttributes: {
				locale: "ja",
			},
		});
		await addToUserGroup(adminUser, "admin");
	} catch (error) {
		const err = error as Error;
		if (
			err.name === "UsernameExistsError" ||
			err.name === "UsernameExistsException"
		) {
			log.warn({ error, username }, "すでにユーザ作成済です");
		} else {
			throw err;
		}
	}
};
