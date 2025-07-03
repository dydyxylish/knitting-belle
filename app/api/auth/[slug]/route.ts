import { createAuthRouteHandlers } from "@/app/_lib/amplifyServerUtils";

export const GET = createAuthRouteHandlers({
	redirectOnSignInComplete: "/callback",
	redirectOnSignOutComplete: "/",
});
