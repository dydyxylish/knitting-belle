import { readFile } from "node:fs/promises";
import { Amplify } from "aws-amplify";
import { putKnittingPattern } from "./storage/putKnittingPattern";

// this is used to get the amplify_outputs.json file as the file will not exist until sandbox is created
const url = new URL("../../amplify_outputs.json", import.meta.url);
const outputs = JSON.parse(await readFile(url, { encoding: "utf8" }));
Amplify.configure(outputs);

putKnittingPattern();
