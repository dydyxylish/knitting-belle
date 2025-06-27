import Link from "next/link";

import type { Schema } from "@/amplify/data/resource";

interface DetailKnittingPatternPresentationProps {
	children: React.ReactNode;
	knittingPattern: Schema["KnittingPattern"]["type"];
}
export const DetailKnittingPatternPresentation = ({
	children,
	knittingPattern,
}: DetailKnittingPatternPresentationProps) => {
	return (
		<div>
			<p>{knittingPattern.id}</p>
			<p>{knittingPattern.title}</p>
			<p>{knittingPattern.description}</p>
			{children}
			<Link href={`${knittingPattern.id}/confirm`}>
				<button className="border" type="button">
					購入確認画面に遷移
				</button>
			</Link>
		</div>
	);
};
