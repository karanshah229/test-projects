/* eslint-disable no-param-reassign */
import React, { AllHTMLAttributes, useContext } from "react";

import { composeEventHandlers } from "../../utils/common";

import { CarouselContext } from "./CarouselContextProvider";
import { prevSlide } from "./utils";

interface Props {
	as: any;
	showOnFirstSlide?: boolean;
	disabledProp?: string;
	children: React.ReactNode;
}

export function TriggerPrev({
	as,
	showOnFirstSlide = true,
	disabledProp = "",
	children,
	...rest
}: Props & Omit<AllHTMLAttributes<HTMLElement>, "as">) {
	const {
		currentSlideIndex,
		setCurrentSlideIndex,
		totalSlides,
		rollOverEnabled,
	} = useContext(CarouselContext);

	rest.onClick = composeEventHandlers(rest.onClick, () =>
		prevSlide({
			currentSlideIndex,
			setCurrentSlideIndex,
			totalSlides,
			rollOverEnabled,
		})
	);

	const isTriggerDisabled =
		rest.disabled ??
		(totalSlides <= 0 || (currentSlideIndex === 0 && !rollOverEnabled));
	rest.disabled = isTriggerDisabled;

	// For HRDS components like HRButton, HRIconButton that accept a isDisabled prop
	if (disabledProp) {
		(rest as any).isDisabled = isTriggerDisabled;
	}

	if (currentSlideIndex === 0 && !showOnFirstSlide) return null;
	return React.createElement(as, rest, children);
}
