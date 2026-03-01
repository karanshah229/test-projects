import { AllHTMLAttributes, ReactNode, useRef, useState } from "react";

import { useResizeObserver } from "../../hooks/useResizeObserver";
import { debounce } from "../../utils/common";

import { CarouselContextProvider } from "./CarouselContextProvider";

type Props1 =
	| { autoSlide: true; autoSlideInterval?: number; pauseOnHover?: boolean }
	| { autoSlide?: false; autoSlideInterval?: never; pauseOnHover?: never };

type Props2 =
	| { fullWidth: boolean; carouselWidthInPixels?: never }
	| { carouselWidthInPixels: number; fullWidth?: never };

type RootProps = Props1 &
	Props2 & {
		children: ReactNode;
		className?: string;
		rollOverEnabled?: boolean;
		startingIndex?: number;
		autoSlide?: boolean;
		style?: object;
	} & AllHTMLAttributes<HTMLDivElement>;

export function Root({
	children,
	fullWidth = false,
	carouselWidthInPixels,
	className,
	rollOverEnabled = false,
	startingIndex = 0,
	style = {},
	autoSlide,
	autoSlideInterval,
	pauseOnHover,
	...rest
}: RootProps) {
	const [
		carouselWidthInPixelsContextVal,
		setCarouselWidthInPixelsContextVal,
	] = useState(carouselWidthInPixels ?? 0);
	const rootWidth =
		carouselWidthInPixelsContextVal > 0 ? carouselWidthInPixels : "100%";

	const rootRef = useRef<HTMLDivElement>(null);
	useResizeObserver<HTMLDivElement>(
		rootRef,
		debounce((target: HTMLDivElement) => {
			setCarouselWidthInPixelsContextVal(
				target.getBoundingClientRect().width
			);
		}, 500)
	);

	return (
		<CarouselContextProvider
			rollOverEnabled={rollOverEnabled}
			startingIndex={startingIndex}
			autoSlide={autoSlide}
			autoSlideInterval={autoSlideInterval}
			pauseOnHover={pauseOnHover}
			fullWidth={fullWidth}
		>
			<div
				style={{
					...style,
					position: "relative",
					width: rootWidth,
					overflow: "hidden",
				}}
				className={className}
				ref={rootRef}
				{...rest}
			>
				{children}
			</div>
		</CarouselContextProvider>
	);
}
