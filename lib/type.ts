import type outputs from "@/amplify_outputs.json";

// amplify_outputs.jsonにcustomプロパティを追加した型定義
export type AmplifyOutputsWithCustom = typeof outputs & {
	custom?: {
		managedLoginDomain?: string;
		cdnDomain?: string;
	};
};
