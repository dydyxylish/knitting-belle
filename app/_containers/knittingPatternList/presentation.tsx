interface KnittingPatternPresentationalProps {
	children: React.ReactNode;
}

export const KnittingPatternListPresentation = async ({
	children,
}: KnittingPatternPresentationalProps) => {
	return <div className="flex flex-col gap-8">{children}</div>;
};
