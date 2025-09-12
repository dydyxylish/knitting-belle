"use client";

import { useEffect, useState } from "react";

import { LoginDialog } from "@/app/_components/LoginDialog";
import { CheckOutButton } from "../CheckOutButton";

interface AuthOrCheckOutPresentationProps {
	knittingPatternSlug: string;
	isAuthenticated: boolean;
}

export const AuthOrCheckOutPresentation = ({
	knittingPatternSlug,
	isAuthenticated: initialAuth,
}: AuthOrCheckOutPresentationProps) => {
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	if (!isClient) {
		// サーバーサイドでは常にログインダイアログを表示
		return <LoginDialog />;
	}

	return initialAuth ? (
		<CheckOutButton knittingPatternSlug={knittingPatternSlug} />
	) : (
		<LoginDialog />
	);
};
