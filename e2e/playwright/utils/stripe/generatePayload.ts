import dayjs from "dayjs";

export interface GeneratePayloadProps {
	knittingPatternSlug: string;
	sub: string;
	sessionId: string;
}

export const generatePayload = ({
	knittingPatternSlug,
	sub,
	sessionId,
}: GeneratePayloadProps) => {
	return {
		id: "evt_1XYZ123...",
		object: "event",
		api_version: "2025-08-15",
		created: dayjs().unix(),
		data: {
			object: {
				id: sessionId,
				object: "checkout.session",
				amount_total: 5000,
				currency: "jpy",
				payment_status: "paid",
				customer_email: "test@example.com",
				created: dayjs().unix(),
				metadata: {
					knittingPatternSlug,
					sub,
				},
			},
		},
		livemode: false,
		type: "checkout.session.completed",
	};
};
