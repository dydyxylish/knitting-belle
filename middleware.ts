import { dropRight } from "es-toolkit";
import { type NextRequest, NextResponse } from "next/server";

import { isAuthenticated } from "@/lib/isAuthenticated";
import { getLogger } from "@/lib/logger";
import { getFirstSegment, getLastSegment } from "@/lib/urlSegment";
import { uuidValidate } from "@/lib/uuidValidate";

const log = getLogger(import.meta.url);

export default async function middleware(request: NextRequest) {
	const pathname = request.nextUrl.pathname;

	// matcher: ["/:knittingPatternId/confirm"],
	if (
		uuidValidate(getFirstSegment(pathname)) &&
		getLastSegment(pathname) === "confirm"
	) {
		if (await isAuthenticated()) {
			const res = NextResponse.next();
			log.error({ res }, "response");
			return res;
		}
		log.error("確認画面にすすむにはログインが必要です");
		const redirectUrl = dropRight(pathname.split("/"), 1).join("/");
		log.error(redirectUrl);
		return NextResponse.redirect(request.nextUrl.origin + redirectUrl);
	}
}

export const config = {
	matcher: ["/:knittingPatternId/confirm"],
};
