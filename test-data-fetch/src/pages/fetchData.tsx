import { useEffect, useState } from "react";

export function useFetchData() {
	const [data, setData] = useState(null);

	useEffect(() => {
		let isMounted = true;

		async function get() {
			try {
				const response = await fetch(
					"https://dog.ceo/api/breeds/image/random"
				);
				const result = await response.json();
				if (isMounted) {
					setData(result);
				}
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		}

		get();

		return () => {
			isMounted = false; // Prevent setting state if the component unmounts
		};
	}, []);

	return data;
}
