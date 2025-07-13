"use client";

import { CookiesProvider, useCookies } from "react-cookie";

interface LoginWrapperProps {
	children: React.ReactNode;
	provider: "Google" | "Email";
}

export const LoginWrapper = ({ children, provider }: LoginWrapperProps) => {
	return (
		<CookiesProvider>
			<LoginAnchorLink provider={provider}>{children}</LoginAnchorLink>
		</CookiesProvider>
	);
};

const LoginAnchorLink = ({ children, provider }: LoginWrapperProps) => {
	const [, setCookie, removeCookie] = useCookies(["redirectTo"]);

	const onClickLogin = (event: React.MouseEvent<HTMLAnchorElement>) => {
		event.preventDefault();
		removeCookie("redirectTo");
		setCookie("redirectTo", window.location.href);
		window.location.href = event.currentTarget.href;
	};
	const href =
		provider === "Email"
			? `/api/auth/sign-in?lang=ja`
			: `/api/auth/sign-in?lang=ja&provider=${provider}`;

	return (
		<a href={href} onClick={onClickLogin}>
			{children}
		</a>
	);
};
