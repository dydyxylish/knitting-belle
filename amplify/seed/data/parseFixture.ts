import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { parse } from "yaml";

import type { Schema } from "@/amplify/data/resource";

const parseYamlFile = async <T>(filePath: string): Promise<T> => {
	const yamlFile = await readFile(join(import.meta.dirname, filePath), "utf8");
	return parse(yamlFile) as T;
};

export const parseKnittingPatternYaml = async (): Promise<
	Schema["KnittingPattern"]["type"][]
> => {
	return await parseYamlFile<Schema["KnittingPattern"]["type"][]>(
		"asset/knittingPattern.yml",
	);
};

export const parseYarnCraftImageYaml = async (): Promise<
	Schema["YarnCraftImage"]["type"][]
> => {
	return await parseYamlFile<Schema["YarnCraftImage"]["type"][]>(
		"asset/yarnCraftImage.yml",
	);
};
