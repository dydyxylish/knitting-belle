import { z } from "zod";

const EnvSchema = z.object({
	AMPLIFY_APP_ORIGIN: z.string(),
	GOOGLE_CALLBACK_URLS: z
		.string()
		.nonempty()
		.transform((s) =>
			s
				.split(",")
				.map((str) => str.trim())
				.filter(Boolean),
		),
	GOOGLE_LOGOUT_URLS: z
		.string()
		.nonempty()
		.transform((s) =>
			s
				.split(",")
				.map((str) => str.trim())
				.filter(Boolean),
		),
	STRIPE_SUCCESS_URL: z.string(),
	STRIPE_CANCEL_URL: z.string(),
	AWS_REGION: z.string(),
	COOKIE_DOMAIN: z.string(),
	SEED_BUCKET_ARN: z.string(),
	SEED_BUCKET_REGION: z.string(),
	ADMIN_USERNAME: z.string(),
	ADMIN_PASSWORD: z.string(),
	STRIPE_API_KEY: z.string(),
	STRIPE_WEBHOOK_SECRET: z.string(),
	INSTAGRAM_URL: z.string(),
	NEXT_PUBLIC_CONTACT_EMAIL: z.string(),
	SIGNED_URL_EXPIRE_MINUTES: z
		.string()
		.transform((val) => Number(val))
		.refine((val) => Number.isInteger(val) && val > 0 && val <= 60, {
			message: "SIGNED_URL_EXPIRE_MINUTES は1以上60以下である必要があります",
		}),
	SIGNED_URL_EXPIRE_WARNING_MINUTES: z
		.string()
		.transform((val) => Number(val))
		.refine((val) => Number.isInteger(val) && val > 0 && val <= 60, {
			message:
				"SIGNED_URL_EXPIRE_WARNING_MINUTES は1以上60以下である必要があります",
		}),
	TEST_ADMIN_USERNAME: z.string(),
	TEST_ADMIN_PASSWORD: z.string(),
	ENABLE_TEST_API: z.coerce.boolean().default(false),
});

export const env = EnvSchema.parse(process.env);
