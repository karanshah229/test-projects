export const isClient = typeof window !== "undefined";

export const isServer = !isClient;

export const isDev = process.env.NODE_ENV === "development";

/**
 *
 * composes (runs one after another) 2 event handlers for the same event
 * @param originalEventHandler - The event handler of another component (eg: Parent, Child component)
 * @param ourEventHandler - Our component's event handler for the same event
 * @param {object} params - Optional params
 * checkForDefaultPrevented - Checks if event.defaultPrevented
 * @returns {Function} An event handler that calls both - the original and ourEventHandler
 *
 */
export function composeEventHandlers<E>(
	originalEventHandler?: (event: E) => void,
	ourEventHandler?: (event: E) => void,
	{ checkForDefaultPrevented = true } = {}
) {
	return function handleEvent(event: E) {
		originalEventHandler?.(event);

		if (
			checkForDefaultPrevented === false ||
			!(event as unknown as Event)?.defaultPrevented
		) {
			return ourEventHandler?.(event);
		}

		return undefined;
	};
}

/**
 *
 * composes multiple event handlers together using `composeEventHandlers` util
 * @param eventHandlerMap - An object with key as eventName and value as an array of 2 event handlers
 * @returns {Function} An object with key as eventName and value as composedEventHandler
 *
 */
export function composeMultipleEventHandlers(eventHandlerMap: {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any[];
}) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const composedEventHandlerMap: any = {};
	Object.entries(eventHandlerMap).forEach(
		([eventHandlerName, eventHandlers]) => {
			composedEventHandlerMap[eventHandlerName] = composeEventHandlers(
				...eventHandlers
			);
		}
	);

	return composedEventHandlerMap;
}

/**
 *
 * Debounces the given function, ensuring it is only called after the specified wait time has passed since the last invocation.
 * @param {Function} func - The function to be debounced.
 * @param {number} wait - The wait time in milliseconds.
 * @returns {Function} - The debounced function.
 *
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function debounce(func: Function, wait: number) {
	let timeoutId: string | number | NodeJS.Timeout | null | undefined;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return function debounced(...args: any[]) {
		const later = () => {
			timeoutId = null;

			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			func.apply(this, args);
		};

		clearTimeout(timeoutId as number | undefined);
		timeoutId = setTimeout(later, wait);
	};
}
