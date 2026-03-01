import Link from "next/link";

export default function Home() {
	return (
		<>
			<h2>
				Does Custom App - <code>_app.page.tsx</code>&apos;s{" "}
				<code>initialProps</code> run on SSR&apos;d pages
			</h2>
			<h4>
				<u>
					Check the console logs for messages from{" "}
					<code>_app.getInitialProps</code>
				</u>
			</h4>

			<h2>Conclusion</h2>
			<p>
				Custom App&apos;s <code>getInitialProps</code> does not run on
				SSR&apos;d pages on client, but it runs on server.
			</p>
			<p>It runs on client for non SSR&apos;d pages</p>
			<nav>
				<ul>
					<li>
						<Link href="/nossr">No SSR Page</Link>
					</li>
					<li>
						<Link href="/ssr">SSR Page</Link>
					</li>
				</ul>
			</nav>
		</>
	);
}
