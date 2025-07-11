"use client";

import { CookiesProvider, useCookies } from "react-cookie";

interface LoginWrapperProps {
	children: React.ReactNode;
	provider: "Google";
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

	return (
		<a href={`/api/auth/sign-in?provider=${provider}`} onClick={onClickLogin}>
			{children}
		</a>
	);
};
