import { PaymentFormContainer } from "./container";

interface PaymentFormProps {
	knittingPatternId: string;
}

export const PaymentForm = ({ knittingPatternId }: PaymentFormProps) => (
	<PaymentFormContainer knittingPatternId={knittingPatternId} />
);
