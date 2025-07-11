import type { Schema } from "@/amplify/data/resource";
import { OrderSummaryContainer } from "./container";

interface OrderSummaryProps {
	purchaseHistory: Schema["PurchaseHistory"]["type"];
}

export const OrderSummary = ({ purchaseHistory }: OrderSummaryProps) => (
	<OrderSummaryContainer purchaseHistory={purchaseHistory} />
);
