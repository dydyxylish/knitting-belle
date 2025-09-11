import { fetchUserAttributes } from "aws-amplify/auth/server";
import { NextResponse } from "next/server";

import { amplifyConfigure } from "@/e2e/playwright/utils/amplify/amplifyConfigure";
import { runWithServer } from "@/e2e/playwright/utils/amplify/runWithServer";
import { env } from "@/lib/env";
import { getLogger } from "@/lib/logger";

amplifyConfigure();

const log = getLogger(import.meta.url);

export async function POST(req: Request) {
	if (!env.ENABLE_TEST_API) {
		log.warn("Test API is disabled, rejecting request");
		return NextResponse.json(
			{ error: "Test API is disabled" },
			{ status: 400 },
		);
	}
	try {
		log.info("Fetch user attribute API called");
		const userAttribute = await runWithServer(fetchUserAttributes);
		return NextResponse.json({ userAttribute });
	} catch (error) {
		log.error({ error }, "Error fetching user attribute");
		return NextResponse.json(
			{ error: "Failed to fetch user attribute" },
			{ status: 500 },
		);
	}
}
