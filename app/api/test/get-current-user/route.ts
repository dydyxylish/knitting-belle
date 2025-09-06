import { getCurrentUser, signIn, signOut } from "aws-amplify/auth";
import { NextResponse } from "next/server";
import { z } from "zod";

import { amplifyConfigure } from "@/e2e/playwright/utils/amplify/amplifyConfigure";
import { env } from "@/lib/env";
import { getLogger } from "@/lib/logger";

amplifyConfigure();

const log = getLogger(import.meta.url);

const getCurrentUserSchema = z.object({
	username: z.string().min(1, "username is required"),
	password: z.string().min(1, "password is required"),
});

export async function POST(req: Request) {
	try {
		log.info("Get current user API called");

		if (!env.ENABLE_TEST_API) {
			log.warn("Test API is disabled, rejecting request");
			return NextResponse.json(
				{ error: "Test API is disabled" },
				{ status: 400 },
			);
		}

		const body = await req.json();
		log.info({ username: body.username }, "Request body received");

		// zodでバリデーション
		const validation = getCurrentUserSchema.safeParse(body);
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

		const { username, password } = validation.data;
		log.info({ username }, "Validated request data");

		await signOut();

		log.info({ username }, "Signing in user");
		const { isSignedIn } = await signIn({
			username,
			password,
		});
		log.info({ isSignedIn }, "Signed in user");
		if (!isSignedIn) {
			log.warn("Failed to sign in user");
			return NextResponse.json(
				{ error: "Failed to sign in user" },
				{ status: 401 },
			);
		}

		log.info("Getting current user info");
		const user = await getCurrentUser();
		if (!user || !user.userId) {
			log.warn("No user found after sign in");
			return new NextResponse("Unauthorized", { status: 401 });
		}

		log.info(
			{ userId: user.userId, username: user.username },
			"Successfully retrieved user info",
		);
		return NextResponse.json(user);
	} catch (error) {
		log.error({ error }, "Error getting current user");
		return NextResponse.json(
			{ error: "Failed to get current user" },
			{ status: 500 },
		);
	}
}
