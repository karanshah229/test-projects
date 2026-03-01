/* eslint-disable no-param-reassign */
import React, { AllHTMLAttributes, useContext } from "react";

import { composeEventHandlers } from "../../utils/common";

import { CarouselContext } from "./CarouselContextProvider";
import { nextSlide } from "./utils";

interface Props {
	as: any;
	showOnLastSlide?: boolean;
	disabledProp?: string;
	children: React.ReactNode;
}

export function TriggerNext({
	as,
	showOnLastSlide = true,
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
		nextSlide({
			currentSlideIndex,
			setCurrentSlideIndex,
			totalSlides,
			rollOverEnabled,
		})
	);

	const isTriggerDisabled =
		rest.disabled ??
		(totalSlides <= 0 ||
			(currentSlideIndex === totalSlides - 1 && !rollOverEnabled));
	rest.disabled = isTriggerDisabled;

	// For HRDS components like HRButton, HRIconButton that accept a isDisabled prop
	if (disabledProp) {
		(rest as any)[disabledProp] = isTriggerDisabled;
	}

	if (currentSlideIndex === totalSlides - 1 && !showOnLastSlide) return null;
	return React.createElement(as, rest, children);
}
