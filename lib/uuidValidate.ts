import { uuidSchema } from "@/lib/schema";

export const uuidValidate = (uuid: string) =>
	uuidSchema.safeParse(uuid).success;
