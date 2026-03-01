import { ReactNode } from "react";
import { Carousel } from "../src/components/Carousel";

function DemoSlide({ children }: { children: ReactNode }) {
	return <div style={{ padding: "1rem", width: "100px" }}>{children}</div>;
}

function TriggerButtons() {
	return (
		<div style={{ display: "flex", gap: "5px" }}>
			<Carousel.TriggerPrev as="button">
				<div>Prev</div>
			</Carousel.TriggerPrev>
			<Carousel.TriggerNext as="button">
				<div>Next</div>
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

export function Carousel1() {
	return (
		<Carousel.Root
			carouselWidthInPixels={100}
			autoSlide
			rollOverEnabled
			pauseOnHover
		>
			<Carousel.SlidesContainer>
				{[
					"Test me",
					"Test me 2",
					"Test me 3",
					"Test me 4",
					"Test me 5",
				].map((val) => {
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
