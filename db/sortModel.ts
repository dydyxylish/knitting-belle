import type { Schema } from "@/amplify/data/resource";

export const sortModel = <
	T extends Schema[keyof Schema]["type"],
	K extends keyof T,
	U extends readonly T[K][],
>(
	items: T[],
	keyField: K,
	keys: U,
) => {
	const map = items.reduce(
		(acc, item) => {
			const key = item[keyField];
			acc[String(key)] = item;
			return acc;
		},
		{} as Record<string, T>,
	);
	return keys.map((key) => map[String(key)] || new Error());
};
