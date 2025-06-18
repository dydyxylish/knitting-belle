import { generateClient } from "aws-amplify/data";

import type { Schema } from "@/amplify/data/resource";

export const dbClient = generateClient<Schema>({ authMode: "apiKey" });
