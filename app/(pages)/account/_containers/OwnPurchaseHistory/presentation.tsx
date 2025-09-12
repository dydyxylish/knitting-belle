import type React from "react";

interface OwnPurchaseHistoryPresentationProps {
	children: React.ReactNode;
}

export const OwnPurchaseHistoryPresentation = ({
	children,
}: OwnPurchaseHistoryPresentationProps) => (
	<div className="mt-10 flex flex-col items-center gap-6">{children}</div>
);
