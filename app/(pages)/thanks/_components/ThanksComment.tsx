"use client";
import { type LottieOptions, useLottie } from "lottie-react";
import type { CSSProperties } from "react";

import confetti from "@/public/confetti.json";
import giftBox from "@/public/giftBox.json";

const confettiOptions: LottieOptions = {
	animationData: confetti,
	loop: true,
	autoplay: true,
};

const confettiStyles: CSSProperties = {
	pointerEvents: "none",
};

const giftBoxOptions: LottieOptions = {
	animationData: giftBox,
	loop: true,
	autoplay: true,
};

const giftBoxStyles: CSSProperties = {
	position: "absolute",
	width: "60%",
	top: "35%",
	left: "20%",
	zIndex: -1,
};

export const ThanksComment = () => {
	const { View: Confetti } = useLottie(confettiOptions, confettiStyles);
	const { View: GiftBox } = useLottie(giftBoxOptions, giftBoxStyles);
	return (
		<div className="relative sm:w-full sm:max-w-xl">
			<p className="-translate-x-1/2 -translate-y-1/4 absolute top-1/4 left-1/2 transform whitespace-nowrap font-league text-6xl">
				Thank you
			</p>
			{Confetti}
			{GiftBox}
		</div>
	);
};
