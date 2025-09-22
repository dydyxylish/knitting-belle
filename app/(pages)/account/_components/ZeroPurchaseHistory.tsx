import { kiwiMaru } from "@/app/_lib/fonts/kiwiMaru";
import { cn } from "@/app/_lib/tailwindUtils";

export const ZeroPurchaseHistory = () => (
	<p className={cn("text-slate-600", kiwiMaru.className)}>
		ご購入済みの編み図はありません
	</p>
);
