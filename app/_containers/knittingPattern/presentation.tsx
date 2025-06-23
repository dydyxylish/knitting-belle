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
		<div className="border">
			{children}
			<p>{knittingPattern.id}</p>
			<p>{knittingPattern.title}</p>
			<p>{knittingPattern.description}</p>
			<p>{knittingPattern.price}</p>
		</div>
	);
};
