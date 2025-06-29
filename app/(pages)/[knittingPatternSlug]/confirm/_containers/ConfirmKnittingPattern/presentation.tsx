import type { Schema } from "@/amplify/data/resource";

interface ConfirmKnittingPatternPresentationProps {
	children: React.ReactNode;
	knittingPattern: Schema["KnittingPattern"]["type"];
}
export const ConfirmKnittingPatternPresentation = ({
	children,
	knittingPattern,
}: ConfirmKnittingPatternPresentationProps) => {
	return (
		<div>
			<p>{knittingPattern.slug}</p>
			<p>{knittingPattern.title}</p>
			<p>{knittingPattern.description}</p>
			<p className="font-bold text-red-500">Confirm</p>
			{children}
		</div>
	);
};
