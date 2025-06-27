import { getFirstSegment, getLastSegment } from "@/lib/urlSegment";
import { uuidValidate } from "@/lib/uuidValidate";

export const getRedirectPath = (pathname: string) => {
	if (
		uuidValidate(getFirstSegment(pathname)) &&
		getLastSegment(pathname) !== "confirm"
	) {
		return `${pathname}/confirm`;
	} else if (pathname === "/account") {
		return "/account";
	}
	return "/";
};
