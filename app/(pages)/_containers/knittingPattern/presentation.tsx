import Link from "next/link";

import type { Schema } from "@/amplify/data/resource";

interface KnittingPatternPresentationProps {
	children: React.ReactNode;
	knittingPattern: Schema["KnittingPattern"]["type"];
}
export const KnittingPatternPresentation = ({
	children,
	knittingPattern,
}: KnittingPatternPresentationProps) => {
	return (
		<Link href={`/${knittingPattern.slug}`}>
			<div className="border">
				{children}
				<p>{knittingPattern.slug}</p>
				<p>{knittingPattern.title}</p>
			</div>
		</Link>
	);
};
