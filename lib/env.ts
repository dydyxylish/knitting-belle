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
	COOKIE_DOMAIN: z.string(),
	SEED_BUCKET_ARN: z.string(),
	SEED_BUCKET_REGION: z.string(),
	ADMIN_USERNAME: z.string(),
	ADMIN_PASSWORD: z.string(),
	STRIPE_API_KEY: z.string(),
	STRIPE_WEBHOOK_SECRET: z.string(),
	INSTAGRAM_URL: z.string(),
	SIGNED_URL_EXPIRE_HOUR: z
		.string()
		.transform((val) => Number(val))
		.refine((val) => Number.isInteger(val) && val > 0, {
			message: "SIGNED_URL_EXPIRE_HOUR は正の整数である必要があります",
		}),
});

export const env = EnvSchema.parse(process.env);
