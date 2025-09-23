import { LoginDialog } from "@/app/_components/LoginDialog";
import { kiwiMaru } from "@/app/_lib/fonts/kiwiMaru";
import { cn } from "@/app/_lib/tailwindUtils";

export const LoginText = () => (
	<div className="flex flex-col items-center gap-8">
		<p className={cn("text-slate-600 text-sm", kiwiMaru.className)}>
			購入履歴を見るにはログインが必要です
		</p>
		<LoginDialog buttonText="ログイン" />
	</div>
);
