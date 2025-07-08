"use client";

import { type LottieOptions, useLottie } from "lottie-react";
import { useEffect, useState } from "react";

import instagram from "@/public/instagram.json";

export const InstagramLottie = () => {
	const [hasPlayed, setHasPlayed] = useState(false);

	const options: LottieOptions = {
		animationData: instagram,
		loop: false,
		autoplay: false,
	};

	const { View, play, animationContainerRef } = useLottie(options);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && !hasPlayed) {
					play(); // 表示されたら一度だけ再生
					setHasPlayed(true);
				}
			},
			{ threshold: 0.7 },
		);

		if (animationContainerRef.current)
			observer.observe(animationContainerRef.current);
		return () => {
			if (animationContainerRef.current)
				observer.unobserve(animationContainerRef.current);
		};
	}, [hasPlayed, play, animationContainerRef]);

	return View;
};
