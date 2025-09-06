import { signIn, signOut } from "aws-amplify/auth";
import { NextResponse } from "next/server";
import { z } from "zod";

import { amplifyConfigure } from "@/e2e/playwright/utils/amplify/amplifyConfigure";
import { deletePurchaseHistory } from "@/e2e/playwright/utils/db/deletePurchaseHistory";
import { env } from "@/lib/env";
import { getLogger } from "@/lib/logger";

amplifyConfigure();

const log = getLogger(import.meta.url);

const deletePurchaseHistorySchema = z.object({
	knittingPatternSlug: z.string().min(1, "knittingPatternSlug is required"),
	userId: z.string().min(1, "userId is required"),
});

export async function POST(req: Request) {
	try {
		log.info("Delete purchase history API called");

		if (!env.ENABLE_TEST_API) {
			log.warn("Test API is disabled, rejecting request");
			return NextResponse.json(
				{ error: "Test API is disabled" },
				{ status: 400 },
			);
		}

		const body = await req.json();
		log.info({ body }, "Request body received");

		// zodでバリデーション
		const validation = deletePurchaseHistorySchema.safeParse(body);
		if (!validation.success) {
			log.warn(
				{ validationErrors: validation.error.errors },
				"Validation failed",
			);
			return NextResponse.json(
				{ error: "Validation error", details: validation.error.errors },
				{ status: 400 },
			);
		}

		const { knittingPatternSlug, userId } = validation.data;
		log.info({ knittingPatternSlug, userId }, "Validated request data");

		await signOut();
		log.info("Signing in as test admin");
		await signIn({
			username: env.TEST_ADMIN_USERNAME,
			password: env.TEST_ADMIN_PASSWORD,
		});

		log.info(
			{ user: userId, knittingPatternSlug },
			"Deleting purchase history",
		);
		await deletePurchaseHistory({
			user: userId,
			knittingPatternSlug,
		});

		log.info(
			{ user: userId, knittingPatternSlug },
			"Purchase history deleted successfully",
		);
		return NextResponse.json({ success: true });
	} catch (error) {
		log.error({ error }, "Error deleting purchase history");
		return NextResponse.json(
			{ error: "Failed to delete purchase history" },
			{ status: 500 },
		);
	}
}
