"use client";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";

import { Carousel } from "@/app/_components/ui/carousel";

interface TopImageSlidePresentationProps {
	children: React.ReactNode;
}

export const TopImageSlidePresentation = ({
	children,
}: TopImageSlidePresentationProps) => {
	return (
		<Carousel
			opts={{ loop: true }}
			plugins={[
				Autoplay({
					delay: 5000,
					stopOnInteraction: false,
				}),
				Fade(),
			]}
		>
			{children}
		</Carousel>
	);
};
