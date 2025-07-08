import type { Schema } from "@/amplify/data/resource";
import { generateImageUrl } from "./generateImageUrl";

interface getImagePathsArgs {
	yarnCraftImages: Schema["YarnCraftImage"]["type"][];
}
export const getImagePaths = ({ yarnCraftImages }: getImagePathsArgs) =>
	yarnCraftImages.map((img) => generateImageUrl({ path: img.imagePath }));
