import type { Schema } from "@/amplify/data/resource";
import { getAllTopYarnCraftImage } from "@/app/_lib/fetch/yarnCraftImage/getAllTopYarnCraftImage";
import { getLogger } from "@/lib/logger";
import { OrderDetailImagePresentation } from "./presentation";

export interface OrderDetailImageContainerProps {
	knittingPattern: Schema["KnittingPattern"]["type"];
}

const log = getLogger(import.meta.url);

export const OrderDetailImageContainer = async ({
	knittingPattern,
}: OrderDetailImageContainerProps) => {
	const topImage = (await getAllTopYarnCraftImage())
		.filter((img) => img.knittingPatternSlug === knittingPattern.slug)
		.pop();
	if (!topImage) {
		log.warn(
			{ knittingPattern, topImage },
			"該当の編み図の画像が見つかりません",
		);
		// TODO: fallback画像を返す
		return null;
	}
	return <OrderDetailImagePresentation topImage={topImage} />;
};
