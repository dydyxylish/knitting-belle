import { getImageOrigin } from "@/lib/getImageOrigin";

interface generateUrlArgs {
	path: string;
}
export const generateImageUrl = ({ path }: generateUrlArgs) => {
	return `https://${getImageOrigin()}/${path}`;
};
