import { a, type ClientSchema, defineData } from "@aws-amplify/backend";

const schema = a.schema({
	// 毛糸の作品画像
	YarnCraftImage: a
		.model({
			title: a.string().required(),
			alt: a.string().required(),
			imagePath: a.string().required(),
			sortOrder: a.integer().required(),
			knittingPatternId: a.id().required(),
			knittingPattern: a.belongsTo("KnittingPattern", "knittingPatternId"),
		})
		.authorization((allow) => [
			allow.groups(["admin"]).to(["read", "create", "update"]),
			allow.guest().to(["read"]),
		]),
	// 編み図
	KnittingPattern: a
		.model({
			title: a.string().required(),
			description: a.string().required(),
			attention: a.string(),
			pdfPath: a.string().required(),
			price: a.integer().required(),
			downloadCount: a.integer().default(0),
			yarnCraftImages: a.hasMany("YarnCraftImage", "knittingPatternId"),
			purchaseHistories: a.hasMany("PurchaseHistory", "knittingPatternId"),
			isPublished: a.boolean().default(false),
		})
		.authorization((allow) => [
			allow.groups(["admin"]).to(["read", "create", "update"]),
			// allow.publicApiKey().to(["read"]),
			allow
				.guest()
				.to(["read"]),
		]),
	// 購入履歴
	PurchaseHistory: a
		.model({
			userId: a.string().required(),
			knittingPatternId: a.id(),
			knittingPattern: a.belongsTo("KnittingPattern", "knittingPatternId"),
			purchasedAt: a.datetime().required(),
		})
		.authorization((allow) => [
			allow.groups(["admin"]).to(["read", "create", "update"]),
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
