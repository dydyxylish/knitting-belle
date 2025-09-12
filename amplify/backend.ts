import { defineBackend } from "@aws-amplify/backend";

import { auth } from "./auth/resource.js";
import { configureCognitoPolicies } from "./config/cognitoPolicies.js";
import { configureManagedLoginBranding } from "./config/managedLoginBranding.js";
import { configureSeedBucket } from "./config/seedBucket.js";
import { configureYarnCraftImageBucket } from "./config/yarnCraftImageBucket.js";
import { data } from "./data/resource.js";
import {
	knittingPatternStorage,
	yarnCraftImageStorage,
} from "./storage/resource.js";

const backend = defineBackend({
	auth,
	data,
	knittingPatternStorage,
	yarnCraftImageStorage,
});

configureSeedBucket(backend);
configureCognitoPolicies(backend);
configureYarnCraftImageBucket(backend);
configureManagedLoginBranding(backend);
