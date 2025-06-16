import { parse } from "yaml";
import { downloadData } from "aws-amplify/storage";
import type { Client } from "aws-amplify/data";

import type { Schema } from "@/amplify/data/resource";
import { getLogger } from "@/lib/logger";

const log = getLogger(import.meta.url);

export const createKnittingPattern = async (dbClient: Client<Schema>) => {
	const { body } = await downloadData({
		path: "seed-assets/yml/knittingPattern.yml",
		options: {
			bucket: "seedBucket",
		},
	}).result;
	if (!body) throw new Error("Failed to download YAML: no body");
	const text = await body.text();
	const knittingPatterns = parse(text) as Schema["KnittingPattern"]["type"][];

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
