import "@/styles/globals.css";
import type { AppProps } from "next/app";
import App from "next/app";
import Link from "next/link";

export default function SkillUpApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<div>
				<nav className="flex gap-2">
					<Link href="/">Home Page</Link>
					<Link href="/test">Test Page</Link>
				</nav>
			</div>
			<Component {...pageProps} />
		</>
	);
}

export const isClient = typeof window !== "undefined";

export const isServer = !isClient;

SkillUpApp.getInitialProps = async (appContext: any) => {
	const context = await App.getInitialProps(appContext);

	console.log(isClient ? "Client" : "Server");
	console.log("Inside getInitialProps");
	return {
		...context,
	};
};
