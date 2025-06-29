import { z } from "zod";

export const paymentSchema = z.object({
	knittingPatternSlug: z.string(),
});
