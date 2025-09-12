import type { Client } from "aws-amplify/data";

import type { Schema } from "@/amplify/data/resource";
import { getLogger } from "@/lib/logger";
import { parseKnittingPatternYaml } from "./parseFixture";

const log = getLogger(import.meta.url);

export const createKnittingPattern = async (dbClient: Client<Schema>) => {
	const knittingPatterns = await parseKnittingPatternYaml();

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
