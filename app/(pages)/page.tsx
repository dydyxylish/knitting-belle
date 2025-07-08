import Image from "next/image";

import { ParticleBackground } from "../_components/ParticleBackground";
import { FAQ } from "./_containers/_components/FAQ";
import SocialFollowCard from "./_containers/_components/SocialFollowCard";
import { KnittingPatternList } from "./_containers/knittingPatternList";
import { TopImageSlide } from "./_containers/TopImageSlide";

export default function App() {
	return (
		<>
			<ParticleBackground />
			<TopImageSlide />
			<div className="h-14 bg-gradient-to-b from-slate-200/50 to-{background}" />
			<main className="mt-12 flex flex-col gap-32">
				<Image
					src="knitting_belle.svg"
					alt="Knitting Belle"
					width={300}
					height={100}
					className="mx-auto"
				/>
				<KnittingPatternList />
			</main>
			<SocialFollowCard />
			<FAQ />
		</>
	);
}
