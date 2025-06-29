import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getLogger } from "@/lib/logger";
export const dynamic = "force-dynamic";

const log = getLogger(import.meta.url);

export default async function AuthCallbackPage() {
	const requestCookies = await cookies();
	const redirectTo = requestCookies.get("redirectTo");
	if (redirectTo) {
		log.debug({ redirectTo }, "redirectTo");
		redirect(redirectTo.value);
	}
	redirect("/");
}
