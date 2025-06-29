import { ConfirmYarnCraftImageContainer } from "./container";

interface ConfirmYarnCraftImageProps {
	knittingPatternSlug: string;
}

export const ConfirmYarnCraftImage = async ({
	knittingPatternSlug,
}: ConfirmYarnCraftImageProps) => {
	return (
		<ConfirmYarnCraftImageContainer knittingPatternSlug={knittingPatternSlug} />
	);
};
