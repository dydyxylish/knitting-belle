"use client";

import { Player } from "@lottiefiles/react-lottie-player";
import { useEffect, useRef, useState } from "react";

import particle from "@/public/particle.json";

export const ParticleBackground = () => {
	const playerRef = useRef<Player>(null);
	const totalFrames = 120;

	// スクロール最大値を一度だけ測定
	const [fixedScrollHeight, setFixedScrollHeight] = useState<number | null>(
		null,
	);

	useEffect(() => {
		// 初回の innerHeight + scrollHeight を固定（モバイルバーの影響を受けない）
		const initialScrollHeight = document.body.scrollHeight - window.innerHeight;
		setFixedScrollHeight(initialScrollHeight);
	}, []);

	useEffect(() => {
		if (fixedScrollHeight === null) return;

		const handleScroll = () => {
			const scrollTop = Math.max(0, window.scrollY);
			const scrollRatio =
				fixedScrollHeight > 0 ? scrollTop / fixedScrollHeight : 0;

			const loopedRatio = (scrollRatio * 3) % 1;
			const rawFrame = loopedRatio * totalFrames;
			const frame = Math.max(0, Math.min(rawFrame, totalFrames));

			playerRef.current?.setSeeker(frame, false);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [fixedScrollHeight]);

	return (
		<Player
			ref={playerRef}
			src={particle}
			autoplay={false}
			loop={false}
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				width: "100vw",
				height: "100vh",
				pointerEvents: "none",
				zIndex: -1,
			}}
		/>
	);
};
