import Image from "next/image";
import { Inter } from "next/font/google";
import { GetServerSideProps } from "next";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
	return (
		<main>
			<div>Index Page</div>
		</main>
	);
}

export const getServerSideProps = (async () => {
	console.log("Index Page GSSP Triggered");
	return { props: { test: 2 } };
}) satisfies GetServerSideProps<{
	test: number;
}>;
