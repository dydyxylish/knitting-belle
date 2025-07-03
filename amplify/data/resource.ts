import { a, type ClientSchema, defineData } from "@aws-amplify/backend";

const schema = a.schema({
	// 毛糸の作品画像
	YarnCraftImage: a
		.model({
			title: a.string().required(),
			alt: a.string().required(),
			imagePath: a.string().required(),
			sortOrder: a.integer().required(),
			knittingPatternSlug: a.string().required(),
			knittingPattern: a.belongsTo("KnittingPattern", "knittingPatternSlug"),
		})
		.identifier(["imagePath"])
		.authorization((allow) => [
			allow.groups(["admin"]).to(["read", "create", "update"]),
			allow.authenticated().to(["read"]),
			allow.guest().to(["read"]),
		]),
	// 編み図
	KnittingPattern: a
		.model({
			slug: a.string().required(),
			title: a.string().required(),
			description: a.string().required(),
			attention: a.string(),
			price: a.integer().required(),
			downloadCount: a.integer().default(0),
			yarnCraftImages: a.hasMany("YarnCraftImage", "knittingPatternSlug"),
			purchaseHistories: a.hasMany("PurchaseHistory", "knittingPatternSlug"),
			isPublished: a.boolean().default(false),
		})
		.identifier(["slug"])
		.authorization((allow) => [
			allow.groups(["admin"]).to(["read", "create", "update"]),
			allow.authenticated().to(["read"]),
			allow.guest().to(["read"]),
		]),
	// 購入履歴
	PurchaseHistory: a
		.model({
			user: a.string().required(), // JWT sub
			knittingPatternSlug: a.string().required(),
			knittingPattern: a.belongsTo("KnittingPattern", "knittingPatternSlug"),
			purchasedAt: a.datetime(),
			sessionId: a.string(),
		})
		.identifier(["user", "knittingPatternSlug"])
		.authorization((allow) => [
			allow.ownerDefinedIn("user"),
			allow.groups(["admin"]).to(["read", "create", "update"]),
			allow.owner().to(["read"]),
		])
		.secondaryIndexes((index) => [
			index("sessionId")
				.queryField("listByPayment")
				.name("paymentIntentIdIndex"),
		]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
	schema,
	authorizationModes: {
		defaultAuthorizationMode: "userPool",
		apiKeyAuthorizationMode: {
			expiresInDays: 7,
		},
	},
});
