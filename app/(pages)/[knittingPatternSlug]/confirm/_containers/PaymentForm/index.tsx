import { PaymentFormContainer } from "./container";

interface PaymentFormProps {
	knittingPatternSlug: string;
}

export const PaymentForm = ({ knittingPatternSlug }: PaymentFormProps) => (
	<PaymentFormContainer knittingPatternSlug={knittingPatternSlug} />
);
