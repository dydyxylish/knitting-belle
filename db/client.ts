import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

// WARN: seedなどで使うと、Amplify.configure()より前に実行してしまいエラーになる
export const generateDBClient = (options = {}) =>
	generateClient<Schema>(options);
