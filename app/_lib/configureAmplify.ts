import "server-only";
import { Amplify } from "aws-amplify";

import outputs from "@/amplify_outputs.json";

export const amplifyConfigure = () => {
	Amplify.configure(outputs);
};
