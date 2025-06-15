import { copy, type CopyWithPathInput } from "aws-amplify/storage";
import { getLogger } from "../../../../lib/logger";

const log = getLogger(import.meta.url);

export const copyFile = async ({ source, destination }: CopyWithPathInput) => {
	log.info(`Start to copy ${source.path}`);
	try {
		const response = await copy({
			source: source,
			destination: destination,
		});
		log.info(response);
	} catch (e) {
		log.error(e);
	}
};
