"use client";

type ErrorType = "PURCHASE_HISTORY_NOT_FOUND" | "PURCHASE_EXPIRED";

interface ErrorDisplayProps {
	error: ErrorType;
}

export const ErrorDisplay = ({ error }: ErrorDisplayProps) => {
	const errorMessages = {
		PURCHASE_HISTORY_NOT_FOUND: "購入データが作成されていません。",
		PURCHASE_EXPIRED:
			"有効期限を過ぎています。マイページから再度ダウンロードしてください。",
	} as const;

	throw new Error(errorMessages[error]);
};
