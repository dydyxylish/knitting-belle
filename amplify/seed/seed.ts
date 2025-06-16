import { readFile } from "node:fs/promises";
import { Amplify } from "aws-amplify";
import { deleteUser, signIn } from "aws-amplify/auth";
import { generateClient } from "aws-amplify/data";
import {
	addToUserGroup,
	createAndSignUpUser,
	getSecret,
} from "@aws-amplify/seed";

import type { Schema } from "@/amplify/data/resource";
import { getLogger } from "@/lib/logger";

import { putKnittingPattern } from "@/amplify/seed/storage/putKnittingPattern";
import { putCraftImage } from "@/amplify/seed/storage/putCraftImage";
import { createKnittingPattern } from "./data/createKnittingPattern";
import { createCraftImage } from "./data/createCraftImage";

// this is used to get the amplify_outputs.json file as the file will not exist until sandbox is created
const url = new URL("../../amplify_outputs.json", import.meta.url);
const outputs = JSON.parse(await readFile(url, { encoding: "utf8" }));
Amplify.configure(outputs);

const dbClient = generateClient<Schema>();
const log = getLogger(import.meta.url);

const username = await getSecret("username");
const password = await getSecret("password");

try {
	const user = await createAndSignUpUser({
		username: username,
		password: password,
		signInAfterCreation: false,
		signInFlow: "Password",
		userAttributes: {
			locale: "ja",
		},
	});
	await addToUserGroup(user, "admin");
	await signIn({
		username,
		password,
	});

	await Promise.all([putKnittingPattern(), putCraftImage()]);
	await createKnittingPattern(dbClient);
	await createCraftImage(dbClient);
} finally {
	try {
		await deleteUser();
	} catch (e) {
		log.error(e, "failed to do something");
	}
}
