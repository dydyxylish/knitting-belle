import { getLastSegment } from "@/lib/urlSegment";

export const getRedirectPath = (pathname: string) => {
	if (getLastSegment(pathname) !== "confirm") {
		// TODO TOPからログインするとバグる(confirmって商品ないよ)
		return `${pathname}/confirm`;
	} else if (pathname === "/account") {
		return "/account";
	}
	return "/";
};
