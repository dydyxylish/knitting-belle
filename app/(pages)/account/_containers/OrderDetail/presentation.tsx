import dayjs from "dayjs";

import type { Schema } from "@/amplify/data/resource";
import "dayjs/locale/ja";

import { Loader2 } from "lucide-react";
import { Suspense } from "react";

import {
	ResizablePanel,
	ResizablePanelGroup,
} from "@/app/_components/ui/resizable";

interface OrderDetailPresentationProps {
	children: React.ReactNode;
	knittingPattern: Schema["KnittingPattern"]["type"];
	purchaseHistory: Schema["PurchaseHistory"]["type"];
	downloadButton: React.ReactNode;
}

dayjs.locale("ja");

export const OrderDetailPresentation = ({
	children,
	knittingPattern,
	purchaseHistory,
	downloadButton,
}: OrderDetailPresentationProps) => (
	<ResizablePanelGroup direction="horizontal">
		<ResizablePanel defaultSize={30}>
			<div className="flex h-24 items-center justify-center">{children}</div>
		</ResizablePanel>
		<ResizablePanel defaultSize={50}>
			<ResizablePanelGroup direction="vertical">
				<ResizablePanel defaultSize={70}>
					<div className="flex h-full items-center justify-center p-2">
						<span className="line-clamp-3 font-kiwi text-sm">
							{knittingPattern.title}
						</span>
					</div>
				</ResizablePanel>
				<ResizablePanel defaultSize={30}>
					<div className="flex h-full items-center justify-center p-2">
						<span className="font-kiwi text-slate-500 text-sm">
							{`${dayjs(purchaseHistory.purchasedAt).format("YYYY年M月D日")} に購入済み`}
						</span>
					</div>
				</ResizablePanel>
			</ResizablePanelGroup>
		</ResizablePanel>
		<ResizablePanel>
			<div className="flex h-full items-center justify-center">
				<Suspense fallback={<Loader2 className="animate-spin" />}>
					{downloadButton}
				</Suspense>
			</div>
		</ResizablePanel>
	</ResizablePanelGroup>
);
