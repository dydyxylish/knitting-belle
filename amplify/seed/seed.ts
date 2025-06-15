import { readFile } from "node:fs/promises";
import { Amplify } from "aws-amplify";
import { deleteUser, signIn } from "aws-amplify/auth";
import {
	addToUserGroup,
	createAndSignUpUser,
	getSecret,
} from "@aws-amplify/seed";

import { getLogger } from "../../lib/logger";
import { putKnittingPattern } from "./storage/putKnittingPattern";
import { putCraftImage } from "./storage/putCraftImage";

// this is used to get the amplify_outputs.json file as the file will not exist until sandbox is created
const url = new URL("../../amplify_outputs.json", import.meta.url);
const outputs = JSON.parse(await readFile(url, { encoding: "utf8" }));
Amplify.configure(outputs);

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
} finally {
	try {
		await deleteUser();
	} catch (e) {
		log.error(e);
	}
}
