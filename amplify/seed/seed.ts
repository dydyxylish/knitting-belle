import { readFile } from "node:fs/promises";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";

import type { Schema } from "@/amplify/data/resource";
import { putCraftImage } from "@/amplify/seed/storage/putCraftImage";
import { putKnittingPattern } from "@/amplify/seed/storage/putKnittingPattern";
import { env } from "@/lib/env";
import { getLogger } from "@/lib/logger";
import { createUser } from "./auth/createAdminUser";
import { createCraftImage } from "./data/createCraftImage";
import { createKnittingPattern } from "./data/createKnittingPattern";

// this is used to get the amplify_outputs.json file as the file will not exist until sandbox is created
const url = new URL("../../amplify_outputs.json", import.meta.url);
const outputs = JSON.parse(await readFile(url, { encoding: "utf8" }));
Amplify.configure(outputs);

const dbClient = generateClient<Schema>();
const log = getLogger(import.meta.url);

const ADMIN_USERNAME = env.ADMIN_USERNAME;
const ADMIN_PASSWORD = env.ADMIN_PASSWORD;

const TEST_ADMIN_USERNAME = env.TEST_ADMIN_USERNAME;
const TEST_ADMIN_PASSWORD = env.TEST_ADMIN_PASSWORD;

try {
	await createUser({
		username: TEST_ADMIN_USERNAME,
		password: TEST_ADMIN_PASSWORD,
		group: "testAdmin",
		signInAfterCreation: false,
	});

	await createUser({
		username: ADMIN_USERNAME,
		password: ADMIN_PASSWORD,
		group: "admin",
		signInAfterCreation: true,
	});

	await Promise.all([putKnittingPattern(), putCraftImage()]);
	await createKnittingPattern(dbClient);
	await createCraftImage(dbClient);
} catch (e) {
	log.error(e, "failed to do something");
}
