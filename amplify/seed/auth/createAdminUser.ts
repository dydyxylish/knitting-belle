import { addToUserGroup, createAndSignUpUser } from "@aws-amplify/seed";
import { signIn } from "aws-amplify/auth";

import { getLogger } from "@/lib/logger";

const log = getLogger(import.meta.url);

interface createUserArgs {
	username: string;
	password: string;
	group?: string;
	signInAfterCreation?: boolean;
}

export const createUser = async ({
	username,
	password,
	group,
	signInAfterCreation = true,
}: createUserArgs) => {
	try {
		const adminUser = await createAndSignUpUser({
			username: username,
			password: password,
			signInAfterCreation,
			signInFlow: "Password",
			userAttributes: {
				locale: "ja",
			},
		});
		if (group) {
			await addToUserGroup(adminUser, group);
		}
	} catch (error) {
		const err = error as Error;
		if (
			err.name === "UsernameExistsError" ||
			err.name === "UsernameExistsException"
		) {
			log.warn({ error, username }, "すでにユーザ作成済です");
			if (signInAfterCreation) {
				await signIn({
					username,
					password,
				});
			}
		} else {
			throw err;
		}
	}
};
