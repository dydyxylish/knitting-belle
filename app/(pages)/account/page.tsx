import { Loader2 } from "lucide-react";
import { Suspense } from "react";

import { kiwiMaru } from "@/app/_lib/fonts/kiwiMaru";
import { leagueScript } from "@/app/_lib/fonts/leagueScript";
import { cn } from "@/app/_lib/tailwindUtils";
import { OwnPurchaseHistory } from "./_containers/OwnPurchaseHistory";

export default function Page() {
	return (
		<div className="mt-16 flex flex-col items-center">
			<h1 className={cn("mt-8 text-5xl", leagueScript.className)}>My Page</h1>
			<p className={cn("mt-8 text-xl", kiwiMaru.className)}>ご購入履歴</p>
			<Suspense
				fallback={
					<div className="flex h-72 w-full items-center justify-center">
						<Loader2 className="animate-spin" size={40} />
					</div>
				}
			>
				<OwnPurchaseHistory />
			</Suspense>
		</div>
	);
}
