import { LoginDialog } from "@/app/_components/LoginDialog";
import { isAuthenticated } from "@/lib/isAuthenticated";
import { CheckOutButton } from "../CheckOutButton";
import { AuthOrCheckOutPresentation } from "./presentation";

export interface AuthOrCheckOutContainerProps {
	knittingPatternSlug: string;
}

export const AuthOrCheckOutContainer = async ({
	knittingPatternSlug,
}: AuthOrCheckOutContainerProps) => {
	const children = (await isAuthenticated()) ? (
		<CheckOutButton knittingPatternSlug={knittingPatternSlug} />
	) : (
		<LoginDialog />
	);
	return <AuthOrCheckOutPresentation>{children}</AuthOrCheckOutPresentation>;
};
