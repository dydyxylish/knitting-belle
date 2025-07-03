"use client";

import { CookiesProvider, useCookies } from "react-cookie";

export const LoginWrapper = ({ children }: { children?: React.ReactNode }) => {
	return (
		<CookiesProvider>
			<LoginAnchorLink>{children}</LoginAnchorLink>
		</CookiesProvider>
	);
};

const LoginAnchorLink = ({ children }: { children?: React.ReactNode }) => {
	const [, setCookie, removeCookie] = useCookies(["redirectTo"]);

	const onClickLogin = (event: React.MouseEvent<HTMLAnchorElement>) => {
		event.preventDefault();
		removeCookie("redirectTo");
		setCookie("redirectTo", window.location.href);
		window.location.href = event.currentTarget.href;
	};

	return (
		<a href="/api/auth/sign-in?provider=Google" onClick={onClickLogin}>
			{children}
		</a>
	);
};
