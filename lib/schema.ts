import { z } from "zod";

export const uuidSchema = z.string().uuid();

export const paymentSchema = z.object({
	knittingPatternId: uuidSchema,
});
