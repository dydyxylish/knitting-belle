import { readFile } from "node:fs/promises";
import { getSecret } from "@aws-amplify/seed";
import { Amplify } from "aws-amplify";
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

const ADMIN_USERNAME = await getSecret("ADMIN_USERNAME");
const ADMIN_PASSWORD = await getSecret("ADMIN_PASSWORD");

try {
	await createAdminUser({
		username: ADMIN_USERNAME,
		password: ADMIN_PASSWORD,
	});

	await Promise.all([putKnittingPattern(), putCraftImage()]);
	await createKnittingPattern(dbClient);
	await createCraftImage(dbClient);
} catch (e) {
	log.error(e, "failed to do something");
}
