import type { Schema } from "@/amplify/data/resource";

export interface User {
	sub?: string;
	email?: string;
}

export interface FormSubmission {
	reply: (options: { fieldErrors: Record<string, string[]> }) => unknown;
}

export type PaymentValidationResult =
	| {
			success: false;
			error: {
				type: "FORM_ERROR" | "AUTH_ERROR" | "PRODUCT_ERROR" | "DUPLICATE_ERROR";
				submission?: FormSubmission;
				message?: string;
			};
	  }
	| {
			success: true;
			data: {
				knittingPatternSlug: string;
				knittingPattern: Schema["KnittingPattern"]["type"];
				user: User;
			};
	  };

export type PaymentResult = {
	error: {
		duplicateError?: string;
		sessionError?: string;
	};
};
