import type { Schema } from "@/amplify/data/resource";

interface ValidateWrapperPresentationProps {
	children: React.ReactNode;
	purchaseHistory: Schema["PurchaseHistory"]["type"];
}

export const ValidateWrapperPresentation = async ({
	children,
	purchaseHistory,
}: ValidateWrapperPresentationProps) => {
	return <div>{children}</div>;
};
