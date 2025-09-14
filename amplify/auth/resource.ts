import { defineAuth, secret } from "@aws-amplify/backend";

import { env } from "@/lib/env";

export const auth = defineAuth({
	loginWith: {
		email: {
			verificationEmailStyle: "CODE",
			verificationEmailSubject: "Knitting_belle - メールアドレスの確認",
			verificationEmailBody: (createCode) => `
			<p>「Knitting_belle」へのご登録ありがとうございます。</p>
			<p>以下のコードを使用してアカウントを確認してください:</p>
			<p>${createCode()}</p>
			<p>このリンクは24時間有効です。</p>
			<p>ご不明な点がございましたら、お気軽にお問い合わせください。</p>
			<p>https://knitting-belle.com</p>
			`,
		},
		externalProviders: {
			google: {
				clientId: secret("GOOGLE_CLIENT_ID"),
				clientSecret: secret("GOOGLE_CLIENT_SECRET"),
				scopes: ["email", "profile"],
				attributeMapping: {
					email: "email",
					profilePicture: "picture",
				},
			},
			callbackUrls: env.GOOGLE_CALLBACK_URLS,
			logoutUrls: env.GOOGLE_LOGOUT_URLS,
		},
	},
	groups: ["admin", "testAdmin"],
});
