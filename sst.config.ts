/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
	app(input) {
		return {
			name: "knitting-belle",
			removal: input?.stage === "production" ? "retain" : "remove",
			protect: ["production"].includes(input?.stage),
			home: "aws",
		};
	},
	async run() {
		new sst.aws.Nextjs("knitting-belle", {
			domain: {
				name: process.env.APP_DOMAIN || "",
				dns: sst.aws.dns({
					zone: process.env.HOSTZONE_ID || "",
					override: true,
				}),
				cert: process.env.CERTIFICATE_ARN,
			},
		});
	},
});
