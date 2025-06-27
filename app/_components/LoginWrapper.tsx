"use client";

import { usePathname, useRouter } from "next/navigation";
import { CookiesProvider, useCookies } from "react-cookie";

import { getRedirectPath } from "@/app/_lib/getRedirectPath";

export const LoginWrapper = ({ children }: { children?: React.ReactNode }) => {
	return (
		<CookiesProvider>
			<LoginAnchorLink>{children}</LoginAnchorLink>
		</CookiesProvider>
	);
};

const LoginAnchorLink = ({ children }: { children?: React.ReactNode }) => {
	const router = useRouter();
	const pathname = usePathname();
	const [, setCookie, removeCookie] = useCookies(["redirectTo"]);

	const onClickLogin = (event: React.MouseEvent<HTMLAnchorElement>) => {
		event.preventDefault();
		removeCookie("redirectTo");
		setCookie("redirectTo", getRedirectPath(pathname));
		router.push(event.currentTarget.href);
	};

	return (
		<a href="/api/auth/sign-in?provider=Google" onClick={onClickLogin}>
			{children}
		</a>
	);
};
