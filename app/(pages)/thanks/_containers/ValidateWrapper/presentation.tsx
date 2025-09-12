interface ValidateWrapperPresentationProps {
	children: React.ReactNode;
}

export const ValidateWrapperPresentation = async ({
	children,
}: ValidateWrapperPresentationProps) => (
	<div className="flex flex-col items-center gap-12 px-8">{children}</div>
);
