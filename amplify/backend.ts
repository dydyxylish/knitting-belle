import { defineBackend } from "@aws-amplify/backend";

import { env } from "@/lib/env";
import { auth } from "./auth/resource";
import { configureCloudFront } from "./config/cloudfront";
import { configureCognitoPolicies } from "./config/cognitoPolicies";
import { configureSeedBucket } from "./config/seedBucket";
import { configureYarnCraftImageBucket } from "./config/yarnCraftImageBucket";
import { data } from "./data/resource";
import {
	knittingPatternStorage,
	yarnCraftImageStorage,
} from "./storage/resource";

const backend = defineBackend({
	auth,
	data,
	knittingPatternStorage,
	yarnCraftImageStorage,
});

configureSeedBucket(backend);
configureCognitoPolicies(backend);
configureYarnCraftImageBucket(backend);

if (env.AMPLIFY_PRODUCTION) {
	configureCloudFront(backend);
}
