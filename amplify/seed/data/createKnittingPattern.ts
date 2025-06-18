import { readFileSync } from "node:fs";
import type { Client } from "aws-amplify/data";
import { parse } from "yaml";

import type { Schema } from "@/amplify/data/resource";
import { getLogger } from "@/lib/logger";

const log = getLogger(import.meta.url);

export const createKnittingPattern = async (dbClient: Client<Schema>) => {
	const yamlFile = readFileSync(
		`${process.cwd()}/amplify/seed/data/asset/knittingPattern.yml`,
		"utf8",
	);
	const knittingPatterns = parse(
		yamlFile,
	) as Schema["KnittingPattern"]["type"][];

	const promises = knittingPatterns.map(async (knittingPattern) => {
		try {
			const { data } = await dbClient.models.KnittingPattern.create({
				...knittingPattern,
			});
			log.info({ data }, "successfully created KnittingPattern:");
		} catch (e) {
			log.error({ e }, "failed to create KnittingPattern");
		}
	});
	return await Promise.all(promises);
};
