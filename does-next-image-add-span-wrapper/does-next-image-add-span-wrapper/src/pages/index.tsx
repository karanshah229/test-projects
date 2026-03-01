import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
	return (
		<main
			className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
		>
			<Image
				src="https://www.wikipedia.org/portal/wikipedia.org/assets/img/Wikipedia-logo-v2@2x.png"
				width={100}
				height={100}
				alt="Wikipedia Logo"
			/>

			<p>
				Next.js does not add any wrapping <code>span</code> tag to the
				image rendered.
			</p>
			<p>Check your code for errors</p>
		</main>
	);
}
