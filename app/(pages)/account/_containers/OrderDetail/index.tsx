import {
	OrderDetailContainer,
	type OrderDetailContainerProps,
} from "./container";

export const OrderDetail = ({ purchaseHistory }: OrderDetailContainerProps) => (
	<OrderDetailContainer purchaseHistory={purchaseHistory} />
);
