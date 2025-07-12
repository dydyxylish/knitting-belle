import { Loader2 } from "lucide-react";
import React, { Suspense } from "react";

interface OwnPurchaseHistoryPresentationProps {
	children: React.ReactNode;
}

export const OwnPurchaseHistoryPresentation = ({
	children,
}: OwnPurchaseHistoryPresentationProps) => (
	<div className="mt-8 flex flex-col items-center gap-4 px-4">
		{React.Children.count(children) > 0 ? (
			<Suspense fallback={<Loader2 className="animate-spin" />}>
				{children}
			</Suspense>
		) : (
			<p className="font-kiwi text-slate-600">ご購入済みの編み図はありません</p>
		)}
	</div>
);
