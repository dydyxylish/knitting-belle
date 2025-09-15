import { z } from "zod";

const EnvSchema = z
	.object({
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
		ENABLE_TEST_API: z
			.enum(["true", "false"])
			.transform((value) => value === "true"),
		AMPLIFY_PRODUCTION: z
			.enum(["true", "false"])
			.transform((value) => value === "true"),
		CERTIFICATE_ARN: z.string().optional(),
		CDN_DOMAIN: z.string().optional(),
		CDN_SUBDOMAIN: z.string().optional(),
		HOSTZONE_ID: z.string().optional(),
		HOSTZONE_NAME: z.string().optional(),
		MANAGED_LOGIN_DOMAIN: z.string().optional(),
		MANAGED_LOGIN_SUBDOMAIN: z.string().optional(),
	})
	.superRefine((data, ctx) => {
		// ENABLE_TEST_APIとAMPLIFY_PRODUCTIONの相互排他制約
		if (data.ENABLE_TEST_API && data.AMPLIFY_PRODUCTION) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ["ENABLE_TEST_API", "AMPLIFY_PRODUCTION"],
				message: "ENABLE_TEST_APIとAMPLIFY_PRODUCTIONは同時にtrueにできません",
			});
		}

		if (!data.AMPLIFY_PRODUCTION) return;

		// 本番環境で必須な環境変数のリスト
		const requiredInProduction = [
			"CERTIFICATE_ARN",
			"CDN_DOMAIN",
			"CDN_SUBDOMAIN",
			"HOSTZONE_ID",
			"HOSTZONE_NAME",
			"MANAGED_LOGIN_DOMAIN",
			"MANAGED_LOGIN_SUBDOMAIN",
		] as const;

		for (const field of requiredInProduction) {
			if (!data[field]) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					path: [field],
					message: `AMPLIFY_PRODUCTIONがtrueの場合、${field}は必須です`,
				});
			}
		}
	});

export const env = EnvSchema.parse(process.env);
