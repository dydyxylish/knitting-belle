import { Download, JapaneseYen } from "lucide-react";

import type { Schema } from "@/amplify/data/resource";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/app/_components/ui/card";

interface DetailKnittingPatternPresentationProps {
	children: React.ReactNode;
	knittingPattern: Schema["KnittingPattern"]["type"];
}
// TODO: descriptionの中にリンクがあった場合、Linkタグにしたい
export const DetailKnittingPatternPresentation = ({
	children,
	knittingPattern,
}: DetailKnittingPatternPresentationProps) => {
	return (
		<div className="mt-16">
			{children}
			<Card className="mt-4 border-none bg-transparent px-8 font-kiwi shadow-none">
				<CardTitle className="leading-7">{knittingPattern.title}</CardTitle>
				<CardHeader className="flex justify-end gap-8 px-8 font-mono">
					<div className="flex gap-2">
						<Download size={18} />
						<span className="text-sm">{knittingPattern.downloadCount}</span>
					</div>
					<div className="flex">
						<JapaneseYen size={18} />
						<span className="text-sm">{knittingPattern.price}</span>
					</div>
				</CardHeader>
				<CardDescription className="whitespace-pre-line pt-4">
					{knittingPattern.description}
				</CardDescription>
				<CardDescription className="whitespace-pre-line pt-12 text-xs">
					{knittingPattern.attention}
				</CardDescription>
			</Card>
		</div>
	);
};
