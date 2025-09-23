import {
	Card,
	CardContent,
	CardDescription,
	CardTitle,
} from "@/app/_components/ui/card";
import { kiwiMaru } from "@/app/_lib/fonts/kiwiMaru";
import { cn } from "@/app/_lib/tailwindUtils";
import { env } from "@/lib/env";
import { InstagramLottie } from "./InstagramLottie";

export default function SocialFollowCard() {
	return (
		<a href={env.INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
			<Card className="mx-14 mt-28 flex max-w-[500px] flex-col items-center gap-0 bg-white">
				<CardContent className="px-16">
					<InstagramLottie />
				</CardContent>
				<CardTitle>@knitting_belle</CardTitle>
				<CardDescription
					className={cn("mt-6 px-4 text-center", kiwiMaru.className)}
				>
					新作情報や制作の舞台裏をお届けしています。
				</CardDescription>
			</Card>
		</a>
	);
}
