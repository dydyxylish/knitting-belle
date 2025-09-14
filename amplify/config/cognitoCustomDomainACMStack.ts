import {
	aws_certificatemanager as acm,
	Stack,
	type StackProps,
} from "aws-cdk-lib";
import type { Construct } from "constructs";

export class CognitoCustomDomainAcmStack extends Stack {
	public readonly certificate: acm.ICertificate;

	constructor(scope: Construct, id: string, props: StackProps) {
		super(scope, id, props);

		this.certificate = acm.Certificate.fromCertificateArn(
			this,
			"CognitoCertificate",
			process.env.CERTIFICATE_ARN || "",
		);
	}
}
