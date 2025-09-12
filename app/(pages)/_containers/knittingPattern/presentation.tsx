import { Download, JapaneseYen } from "lucide-react";
import Link from "next/link";

import type { Schema } from "@/amplify/data/resource";
import { Card, CardDescription, CardFooter } from "@/app/_components/ui/card";

interface KnittingPatternPresentationProps {
	children: React.ReactNode;
	knittingPattern: Schema["KnittingPattern"]["type"];
}
export const KnittingPatternPresentation = ({
	children,
	knittingPattern,
}: KnittingPatternPresentationProps) => {
	return (
		<Card className="mx-8 flex flex-col items-center gap-4 border-none bg-transparent shadow-none">
			{children}
			<CardDescription className="mx-8 whitespace-normal break-words font-kiwi">
				<Link href={`/${knittingPattern.slug}`}>{knittingPattern.title}</Link>
			</CardDescription>
			<CardFooter className="flex w-full justify-end gap-8 px-8 font-mono text-gray-500">
				<div className="flex gap-1">
					<Download size={18} />
					<span className="text-sm">{knittingPattern.downloadCount}</span>
				</div>
				<div className="flex">
					<JapaneseYen size={18} />
					<span className="text-sm">{knittingPattern.price}</span>
				</div>
			</CardFooter>
		</Card>
	);
};
