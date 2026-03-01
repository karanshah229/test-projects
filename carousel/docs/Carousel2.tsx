import { ReactNode, useEffect, useState } from "react";
import { Carousel } from "../src/components/Carousel";

function DemoSlide({ children }: { children: ReactNode }) {
	return <div style={{ padding: "1rem", width: "200px" }}>{children}</div>;
}

function TriggerButtons() {
	return (
		<div style={{ display: "flex", gap: "5px" }}>
			<Carousel.TriggerPrev as="button">
				<svg
					width="30"
					height="30"
					viewBox="0 0 30 30"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<ellipse
						cx="15"
						cy="15"
						rx="15"
						ry="15"
						transform="rotate(-90 15 15)"
						fill="white"
						fillOpacity="0.41"
					/>
					<path
						d="M16.9996 20L11.9501 16.1158C11.6975 15.9215 11.6887 15.5436 11.932 15.3378L16.9996 11.0498"
						stroke="black"
						strokeWidth="2"
						strokeLinecap="round"
					/>
				</svg>
			</Carousel.TriggerPrev>
			<Carousel.TriggerNext as="button">
				<svg
					width="30"
					height="30"
					viewBox="0 0 30 30"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<ellipse
						cx="15"
						cy="15"
						rx="15"
						ry="15"
						transform="rotate(90 15 15)"
						fill="white"
					/>
					<path
						d="M13.0004 11L18.0499 14.8842C18.3025 15.0785 18.3113 15.4564 18.068 15.6622L13.0004 19.9502"
						stroke="black"
						strokeWidth="2"
						strokeLinecap="round"
					/>
				</svg>
			</Carousel.TriggerNext>
		</div>
	);
}

function Indicators() {
	return (
		<div
			style={{
				display: "flex",
				gap: "5px",
				justifyContent: "center",
			}}
		>
			<Carousel.Indicators>
				{(index, isActiveSlideIndicator, onClick) => {
					return (
						<div
							style={{
								height: "10px",
								width: "10px",
								borderRadius: "50%",
								background: isActiveSlideIndicator
									? "grey"
									: "lightgrey",
								cursor: "pointer",
							}}
							onClick={onClick}
							key={`carousel-indicator-${index}`}
						/>
					);
				}}
			</Carousel.Indicators>
		</div>
	);
}

export function Carousel2() {
	const [slideContents, setSlideContents] = useState([
		"Test me",
		"Test me 2",
		"Test me 3",
		"Test me 4",
		"Test me 5",
	]);
	const [currentSlideIndex, setCurrentSlideIndex] = useState<number | null>(
		null
	);

	useEffect(() => {
		const id = setTimeout(() => {
			setSlideContents([
				"Test me 4",
				"Test me 3",
				"Test me 5",
				"Test me",
				"Test me 2",
			]);
			setCurrentSlideIndex(0);
		}, 2000);

		return () => clearTimeout(id);
	}, []);

	return (
		<Carousel.Root carouselWidthInPixels={200} startingIndex={2}>
			<Carousel.SlidesContainer currentSlideIndex={currentSlideIndex}>
				{slideContents.map((val) => {
					return (
						<Carousel.Slide key={val}>
							<DemoSlide>{val}</DemoSlide>
						</Carousel.Slide>
					);
				})}
			</Carousel.SlidesContainer>

			<TriggerButtons />
			<Indicators />
		</Carousel.Root>
	);
}
