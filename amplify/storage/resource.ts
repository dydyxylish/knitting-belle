import { defineStorage } from "@aws-amplify/backend";

export const knittingPatternStorage = defineStorage({
	name: "knittingPatternBucket",
	access: (allow) => ({
		"knittingPattern/*": [allow.groups(["admin"]).to(["read", "write"])],
	}),
	isDefault: true,
});

export const yarnCraftImageStorage = defineStorage({
	name: "yarnCraftImageBucket",
});
