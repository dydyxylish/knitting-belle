import "server-only";
import { signIn, signOut } from "aws-amplify/auth";

export const loginAdmin = async () => {
	await signOut();
	const { isSignedIn } = await signIn({
		username: process.env.ADMIN_USERNAME || "",
		password: process.env.ADMIN_PASSWORD,
	});
	if (!isSignedIn) throw new Error("ログインできませんでした");
};
