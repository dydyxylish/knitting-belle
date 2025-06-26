import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import { getLogger } from "@/lib/logger";
import { getFirstSegment } from "@/lib/urlSegment";
import { uuidValidateV4 } from "@/lib/uuidValidateV4";

export const dynamic = "force-dynamic";

const log = getLogger(import.meta.url);

export default async function AuthCallbackPage() {
	// const requestHeaders = await headers();
	const requestCookies = await cookies();
	log.error({ requestCookies }, "cookies");
	// const headerObj = Object.fromEntries(requestHeaders.entries());
	// log.error({ headerObj }, "ヘッダー");
	// const referer = requestHeaders.get("referer");
	// // log.error({ referer }, "referer");
	// if (referer) {
	// 	const url = new URL(referer);
	// 	const firstSegment = getFirstSegment(url.pathname);
	// 	// 詳細画面から遷移した場合
	// 	if (uuidValidateV4(firstSegment)) redirect(`${url.pathname}/confirm`);

	// 	// アカウント画面から遷移した場合
	// 	if (firstSegment === "account") redirect("account");
	// }

	const redirectTo = requestCookies.get("redirectTo");
	if (redirectTo) {
		log.debug({ redirectTo }, "redirectTo");
		redirect(redirectTo.value);
	}
	redirect("/");
}
