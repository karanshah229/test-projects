import {
	AllHTMLAttributes,
	Children,
	ReactNode,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";

import { useInterval } from "../../hooks/useInterval";
import { useResizeObserver } from "../../hooks/useResizeObserver";
import { composeMultipleEventHandlers, debounce } from "../../utils/common";

import { CarouselContext } from "./CarouselContextProvider";
import { isIndexValidSlideIndex, nextSlide } from "./utils";

export function SlidesContainer({
	children,
	currentSlideIndex: customCurrentSlideIndex,
	style,
	...rest
}: {
	children: ReactNode;
	currentSlideIndex?: number | null;
	style?: object;
} & AllHTMLAttributes<HTMLDivElement>) {
	const isMounted = useRef(false);
	const direction = useRef("-"); // ref since we don't want to re-render the component
	const lastSlideWidth = useRef(0); // ref since we don't want to re-render the component
	const slidesContainerRef = useRef<HTMLDivElement>(null);
	const {
		totalSlides,
		setTotalSlides,
		rollOverEnabled,
		currentSlideIndex,
		setCurrentSlideIndex,
		startingIndex,
		autoSlide,
		autoSlideInterval,
		pauseOnHover,
		fullWidth,
	} = useContext(CarouselContext);

	const [slideContainerScrollWidth, setSlideContainerScrollWidth] = useState(
		slidesContainerRef.current?.scrollWidth || 0
	);
	const [slideWidth, setSlideWidth] = useState(
		// getBoundingClientRect - returns fractional values - can cause bug where one extra indicator is shown
		// Math.round will smooth out these errors
		Math.round(
			slidesContainerRef.current?.getBoundingClientRect().width || 0
		) || 0
	);

	const [transformProperty, setTransformProperty] = useState(
		`translateX(${startingIndex * slideWidth}px)`
	);
	const [hoveredOnSlideContainer, setHoveredOnSlideContainer] =
		useState(false);

	useResizeObserver<HTMLDivElement>(
		slidesContainerRef,
		debounce((target: HTMLDivElement) => {
			setSlideContainerScrollWidth(target.scrollWidth);
			setSlideWidth(Math.round(target.getBoundingClientRect().width));
		}, 500)
	);

	useEffect(() => {
		if (isMounted.current !== true) {
			isMounted.current = true;
		}
	}, []);

	useEffect(() => {
		// Set slides container width and slide width
		setSlideContainerScrollWidth(
			slidesContainerRef.current?.scrollWidth || 0
		);
		setSlideWidth(
			Math.round(
				slidesContainerRef.current?.getBoundingClientRect().width || 0
			) || 0
		);
	}, [children]);

	useEffect(() => {
		// Set Current slide if totalSlides changes
		setCurrentSlideIndex((c) => {
			if (c >= 0 && c < totalSlides) return c;
			if (c >= totalSlides && totalSlides > 0) return totalSlides - 1;
			return 0;
		});
	}, [setCurrentSlideIndex, totalSlides]);

	useEffect(() => {
		// Set total slides count
		const totalSlidesCount =
			fullWidth &&
			slidesContainerRef.current &&
			slideContainerScrollWidth &&
			slideWidth
				? Math.ceil(slideContainerScrollWidth / slideWidth)
				: Children.count(children);
		setTotalSlides(totalSlidesCount);
	}, [
		children,
		fullWidth,
		setTotalSlides,
		slideWidth,
		slideContainerScrollWidth,
	]);

	useEffect(() => {
		// Set current slide index as starting index on mount
		if (
			isMounted.current === false &&
			isIndexValidSlideIndex(startingIndex, totalSlides)
		) {
			setCurrentSlideIndex(startingIndex);
		}
	}, [setCurrentSlideIndex, startingIndex, totalSlides]);

	useEffect(() => {
		// Set current slide index as customCurrentSlideIndex if passed as prop
		if (
			customCurrentSlideIndex &&
			isIndexValidSlideIndex(customCurrentSlideIndex, totalSlides)
		) {
			setCurrentSlideIndex(customCurrentSlideIndex);
		}
	}, [customCurrentSlideIndex, setCurrentSlideIndex, totalSlides]);

	useEffect(() => {
		// Set last slide width
		lastSlideWidth.current =
			slideContainerScrollWidth - (totalSlides - 1) * slideWidth;
	}, [slideWidth, totalSlides, slideContainerScrollWidth]);

	useEffect(() => {
		// Transition to slide based on currentSlideIndex

		// If last slide width is less than othen slides, need to remove the excess translateX
		const lastSlideExcess =
			currentSlideIndex === totalSlides - 1
				? slideWidth - lastSlideWidth.current
				: 0;

		const newTransformProperty = `translateX(${rollOverEnabled ? direction.current : "-"}${
			currentSlideIndex * slideWidth - lastSlideExcess
		}px)`;

		setTransformProperty(newTransformProperty);
	}, [currentSlideIndex, rollOverEnabled, slideWidth, totalSlides]);

	useInterval(
		// Auto slide
		() => {
			nextSlide({
				currentSlideIndex,
				totalSlides,
				rollOverEnabled,
				setCurrentSlideIndex,
			});
		},
		!autoSlide || (pauseOnHover && hoveredOnSlideContainer)
			? null
			: autoSlideInterval
	);

	// Compose only the handlers we require
	const composedMultipleEventHandlers = composeMultipleEventHandlers({
		onMouseOver: [rest.onMouseOver, () => setHoveredOnSlideContainer(true)],
		onFocus: [rest.onFocus, () => setHoveredOnSlideContainer(true)],
		onMouseOut: [rest.onFocus, () => setHoveredOnSlideContainer(false)],
		onBlur: [rest.onBlur, () => setHoveredOnSlideContainer(false)],
	});

	return (
		<div
			style={{
				...style,
				display: "flex",
				width: "100%",
				transform: transformProperty,
				transition: "transform 300ms ease-out",
			}}
			{...rest}
			{...composedMultipleEventHandlers}
			ref={slidesContainerRef}
		>
			{children}
		</div>
	);
}
