import { list } from "aws-amplify/storage";

export const putKnittingPattern = async () => {
	const result = await list({
		path: "seed-assets/pdf/",
		options: {
			bucket: "SeedBucket",
		},
	});

	console.log(result);
};
