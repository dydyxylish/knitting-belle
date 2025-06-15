import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
	name: "knittingBelle",
	access: (allow) => ({
		"knittingPattern/*": [allow.groups(["admin"]).to(["read", "write"])],
		"yarnCraftImage/*": [allow.groups(["admin"]).to(["read", "write"])],
	}),
});
