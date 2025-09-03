interface KnittingPatternPresentationalProps {
	children: React.ReactNode;
}

export const KnittingPatternListPresentation = async ({
	children,
}: KnittingPatternPresentationalProps) => {
	return (
		<>
			<p className="px-14 font-kiwi text-sm/9 sm:text-center">
				「編む時間」も「できあがる喜び」も大切に。
				<br />
				ダウンロードして、すぐに編み始められる編み図が揃っています。
				<br />
				あなたのお気に入りを、ぜひ見つけてください。
			</p>
			<div className="flex flex-col gap-8">{children}</div>
		</>
	);
};
