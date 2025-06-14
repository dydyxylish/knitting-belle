import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
	name: "knittingBelle",
	access: (allow) => ({
		"knittingPattern/*": [allow.guest.to(["read"])],
	}),
});
