import { CircleUserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import { Button } from "@/app/_components/ui/button";
import { Avatar } from "./Avatar";

export const Header = () => (
	<header className="fixed top-0 left-0 z-50 flex h-16 w-full items-center justify-between bg-transparent px-4">
		<Link href="/">
			<Button variant="ghost" size="icon">
				<Image src="home.svg" alt="home" width={24} height={24} />
			</Button>
		</Link>
		<Image
			src="knitting_belle.svg"
			alt="Knitting Belle"
			width={100}
			height={50}
			className="mx-auto"
		/>
		<Link href="/account">
			<Button variant="ghost" size="icon" className="">
				<Suspense
					fallback={
						<CircleUserRound className="size-6" style={{ opacity: 0.4 }} />
					}
				>
					<Avatar />
				</Suspense>
			</Button>
		</Link>
	</header>
);
