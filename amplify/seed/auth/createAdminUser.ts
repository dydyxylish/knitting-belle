import {
	addToUserGroup,
	createAndSignUpUser,
	getSecret,
} from "@aws-amplify/seed";

export const createAdminUser = async () => {
	// webhook用ユーザ作成
	const adminUsername = await getSecret("adminUsername");
	const adminPassword = await getSecret("adminPassword");
	const adminUser = await createAndSignUpUser({
		username: adminUsername,
		password: adminPassword,
		signInAfterCreation: false,
		signInFlow: "Password",
		userAttributes: {
			locale: "ja",
		},
	});
	await addToUserGroup(adminUser, "admin");
	// TODO: .envに書き込み　adminUser
};
