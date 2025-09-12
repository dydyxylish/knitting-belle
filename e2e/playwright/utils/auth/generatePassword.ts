import { faker } from "@faker-js/faker";

export const generatePassword = () =>
	faker.internet.password({
		length: 12, // 12文字
		memorable: false,
		pattern: /[A-Za-z0-9!@#$%^&*()_+]/,
		prefix:
			faker.string.alpha({ length: 1, casing: "upper" }) +
			faker.string.alpha({ length: 1, casing: "lower" }) +
			faker.string.numeric({ length: 1 }) +
			faker.string.symbol({ min: 1, max: 1 }),
	});
