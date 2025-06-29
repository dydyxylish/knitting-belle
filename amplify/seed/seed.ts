import { readFile } from "node:fs/promises";
import {
	addToUserGroup,
	createAndSignUpUser,
	getSecret,
} from "@aws-amplify/seed";
import { Amplify } from "aws-amplify";
import { deleteUser, signIn } from "aws-amplify/auth";
import { generateClient } from "aws-amplify/data";

import type { Schema } from "@/amplify/data/resource";
import { putCraftImage } from "@/amplify/seed/storage/putCraftImage";
import { putKnittingPattern } from "@/amplify/seed/storage/putKnittingPattern";
import { getLogger } from "@/lib/logger";
import { createAdminUser } from "./auth/createAdminUser";
import { createCraftImage } from "./data/createCraftImage";
import { createKnittingPattern } from "./data/createKnittingPattern";

// this is used to get the amplify_outputs.json file as the file will not exist until sandbox is created
const url = new URL("../../amplify_outputs.json", import.meta.url);
const outputs = JSON.parse(await readFile(url, { encoding: "utf8" }));
Amplify.configure(outputs);

const dbClient = generateClient<Schema>();
const log = getLogger(import.meta.url);

const seedUsername = await getSecret("seedUsername");
const seedPassword = await getSecret("seedPassword");

try {
	const user = await createAndSignUpUser({
		username: seedUsername,
		password: seedPassword,
		signInAfterCreation: false,
		signInFlow: "Password",
		userAttributes: {
			locale: "ja",
		},
	});
	await addToUserGroup(user, "admin");
	await signIn({
		username: seedUsername,
		password: seedPassword,
	});

	await Promise.all([putKnittingPattern(), putCraftImage()]);
	await createKnittingPattern(dbClient);
	await createCraftImage(dbClient);
	await createAdminUser();
} finally {
	try {
		await deleteUser();
	} catch (e) {
		log.error(e, "failed to do something");
	}
}
