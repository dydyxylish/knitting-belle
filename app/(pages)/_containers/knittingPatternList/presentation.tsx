import { kiwiMaru } from "@/app/_lib/fonts/kiwiMaru";
import { cn } from "@/app/_lib/tailwindUtils";

interface KnittingPatternPresentationalProps {
	children: React.ReactNode;
}

export const KnittingPatternListPresentation = async ({
	children,
}: KnittingPatternPresentationalProps) => {
	return (
		<>
			<p className={cn("px-14 text-sm/9 sm:text-center", kiwiMaru.className)}>
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
