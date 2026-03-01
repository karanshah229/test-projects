import { useEffect } from "react";
import { fetchCounterDataThunk } from "../slices/counterSlice";
import store from "../store";

export function AnotherComponent() {
	useEffect(() => {
		if (typeof window !== undefined) {
			console.log("Dispatched");
			store.dispatch(fetchCounterDataThunk());
		}
	}, []);

	return "Child Component calls Async Thunk to fetch data and put in store";
}
