import { NextResponse } from "next/server";

import { amplifyConfigure } from "@/e2e/playwright/utils/amplify/amplifyConfigure";
import { runWithServer } from "@/e2e/playwright/utils/amplify/runWithServer";
import {
	createPurchaseHistory,
	createPurchaseHistorySchema,
} from "@/e2e/playwright/utils/db/createPurchaseHistory";
import { env } from "@/lib/env";
import { getLogger } from "@/lib/logger";

amplifyConfigure();

const log = getLogger(import.meta.url);

export async function POST(req: Request) {
	try {
		log.info("Create purchase history API called");

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
		const validation = createPurchaseHistorySchema.safeParse(body);
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
		log.info({ purchaseHistory: validation.data }, "Validated request data");

		const purchaseHistory = await runWithServer(async () =>
			createPurchaseHistory({
				...validation.data,
			}),
		);

		log.info({ purchaseHistory }, "Purchase history created successfully");
		return NextResponse.json({ success: true });
	} catch (error) {
		log.error({ error }, "Error creating purchase history");
		return NextResponse.json(
			{ error: "Failed to create purchase history" },
			{ status: 500 },
		);
	}
}
