import { ConfirmYarnCraftImageContainer } from "./container";

interface ConfirmYarnCraftImageProps {
	knittingPatternId: string;
}

export const ConfirmYarnCraftImage = async ({
	knittingPatternId,
}: ConfirmYarnCraftImageProps) => {
	return (
		<ConfirmYarnCraftImageContainer knittingPatternId={knittingPatternId} />
	);
};
