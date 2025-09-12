import { Amplify } from "aws-amplify";

import { parseAmplifyOutputs } from "./parseAmplifyOutputs";

export const amplifyConfigure = () => {
	const outputs = parseAmplifyOutputs();
	Amplify.configure(outputs);
};
