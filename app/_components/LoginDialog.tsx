import { LogIn, Mail } from "lucide-react";
import Image from "next/image";

import { LoginWrapper } from "@/app/_components/LoginWrapper";
import { Button } from "@/app/_components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/app/_components/ui/dialog";
import { cn } from "../_lib/tailwindUtils";

interface LoginDialogProps {
	buttonText?: string;
	className?: string;
}

export function LoginDialog({
	buttonText = "ログインして購入する",
	className = "",
}: LoginDialogProps) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant="default"
					className={cn(
						"h-11 bg-primary/50 font-semibold text-foreground/70",
						className,
					)}
				>
					<LogIn />
					{buttonText}
				</Button>
			</DialogTrigger>
			<DialogContent className="flex flex-col items-center sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="font-kiwi text-base">
						ご購入手続きにはログインが必要です
					</DialogTitle>
				</DialogHeader>
				<DialogClose asChild>
					<LoginWrapper provider="Google">
						<Button
							type="button"
							variant="outline"
							className="flex w-64 gap-3 bg-white font-semibold text-slate-700"
						>
							<Image src="google.svg" alt="google" width={24} height={24} />
							<span className="tracking-wider">Googleでログイン</span>
						</Button>
					</LoginWrapper>
				</DialogClose>
				<DialogClose asChild>
					<LoginWrapper provider="Email">
						<Button
							type="button"
							variant="outline"
							className="flex w-64 gap-3 bg-white font-semibold text-slate-700"
						>
							<Mail className="size-5" />
							<span className="tracking-wider">Emailでログイン</span>
						</Button>
					</LoginWrapper>
				</DialogClose>
			</DialogContent>
		</Dialog>
	);
}
