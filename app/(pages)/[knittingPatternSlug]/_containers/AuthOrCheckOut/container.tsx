import { isAuthenticated } from "@/lib/isAuthenticated";
import { AuthOrCheckOutPresentation } from "./presentation";

export interface AuthOrCheckOutContainerProps {
	knittingPatternSlug: string;
}

export const AuthOrCheckOutContainer = async ({
	knittingPatternSlug,
}: AuthOrCheckOutContainerProps) => {
	const isAuth = await isAuthenticated();
	return (
		<AuthOrCheckOutPresentation
			knittingPatternSlug={knittingPatternSlug}
			isAuthenticated={isAuth}
		/>
	);
};
