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
			<p>{knittingPattern.slug}</p>
			<p>{knittingPattern.title}</p>
			<p>{knittingPattern.description}</p>
			{children}
		</div>
	);
};
