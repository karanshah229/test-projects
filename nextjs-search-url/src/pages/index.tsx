import { Inter } from "next/font/google";
import { useState } from "react";
import { useRouter } from "next/router";
import { debounce } from "lodash";

export const isClient = typeof window !== "undefined";
export const isServer = !isClient;

const inter = Inter({ subsets: ["latin"] });

export default function Home(props) {
	console.log("props");
	console.log(props);
	const router = useRouter();
	const [searchTerm, setSearchTerm] = useState(
		(isClient
			? new URLSearchParams(window.location.search).get("search")
			: router.query.search?.toString()) || ""
	);

	// Function to update URL with debouncing
	const updateURL = debounce((value) => {
		router.push(`/?search=${value}`, undefined, {
			scroll: false,
			shallow: true,
		});
	}, 300);

	// Event handler for search input change
	const handleSearchChange = (event) => {
		const { value } = event.target;
		setSearchTerm(value);
		updateURL(value);
	};

	return (
		<div className={`${inter.className}`}>
			<h1>Search Page</h1>
			<input
				type="text"
				placeholder="Search..."
				value={searchTerm}
				onChange={handleSearchChange}
			/>
		</div>
	);
}

export const getServerSideProps = async () => {
	// Fetch data from external API
	const res = await fetch("https://api.github.com/repos/vercel/next.js");
	const repo = await res.json();
	// Pass data to the page via prop
	return { props: { repo } };
};
