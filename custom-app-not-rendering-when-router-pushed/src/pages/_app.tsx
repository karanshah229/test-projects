import { AppHeader } from "@/features/AppHeader/AppHeader";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
	console.log("Custom App triggered");

	return (
		<>
			<AppHeader />
			<Component {...pageProps} />
		</>
	);
}
