import { LoginDialog } from "@/app/_components/LoginDialog";

export const LoginText = () => (
	<div className="flex flex-col items-center gap-8">
		<p className="font-kiwi text-slate-600 text-sm">
			購入履歴を見るにはログインが必要です
		</p>
		<LoginDialog buttonText="ログイン" />
	</div>
);
