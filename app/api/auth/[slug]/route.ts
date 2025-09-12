import { createAuthRouteHandlers } from "@/app/_lib/createAmplifyServerRunner";

export const GET = createAuthRouteHandlers({
	redirectOnSignInComplete: "/callback",
	redirectOnSignOutComplete: "/",
});
