import { unstable_cache } from "next/cache";

import { getYarnCraftImage } from "@/db/repository/yarnCraftImage/getYarnCraftImage";
import { runWithAmplifyServerContext } from "@/lib/amplifyServerUtils";
import { YarnCraftImagePresentation } from "./presentation";

interface YarnCraftImageContainerProps {
	knittingPatternId: string;
}
const getCachedYarnCraftImage = unstable_cache(
	async (knittingPatternId) =>
		await runWithAmplifyServerContext({
			nextServerContext: null,
			operation: () => getYarnCraftImage(knittingPatternId),
		}),
	["yarn-craft-image"],
	{
		tags: ["yarnCraftImage"],
		revalidate: false,
	},
);

export const YarnCraftImageContainer = async ({
	knittingPatternId,
}: YarnCraftImageContainerProps) => {
	const yarnCraftImages = await getCachedYarnCraftImage(knittingPatternId);
	return <YarnCraftImagePresentation yarnCraftImages={yarnCraftImages} />;
};
