import { isAuthenticated } from "@/lib/isAuthenticated";
import { CheckOutButton } from "../CheckOutButton";
import { LoginDialog } from "./presentation";

export interface AuthOrCheckOutContainerProps {
	knittingPatternSlug: string;
}

export const AuthOrCheckOutContainer = async ({
	knittingPatternSlug,
}: AuthOrCheckOutContainerProps) => {
	return (await isAuthenticated()) ? (
		<CheckOutButton knittingPatternSlug={knittingPatternSlug} />
	) : (
		<LoginDialog />
	);
};
