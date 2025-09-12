import type { Backend } from "@aws-amplify/backend";

import type { auth } from "../auth/resource.js";
import type { data } from "../data/resource.js";
import type {
	knittingPatternStorage,
	yarnCraftImageStorage,
} from "../storage/resource.js";

export type BackendResources = {
	auth: typeof auth;
	data: typeof data;
	knittingPatternStorage: typeof knittingPatternStorage;
	yarnCraftImageStorage: typeof yarnCraftImageStorage;
};

export type BackendInstance = Backend<BackendResources>;
