import "server-only";
import { signIn, signOut } from "aws-amplify/auth";

import { env } from "@/lib/env";

export const loginAdmin = async () => {
	await signOut();
	const { isSignedIn } = await signIn({
		username: env.ADMIN_USERNAME,
		password: env.ADMIN_PASSWORD,
	});
	if (!isSignedIn) throw new Error("ログインできませんでした");
};
