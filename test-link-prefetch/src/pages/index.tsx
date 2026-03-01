import Link from "next/link";

export default function Home() {
	return (
		<div>
			<nav>
				<Link href="/test">Test Page</Link>
				<span style={{ marginLeft: "10px" }} />
				<Link href="/test2">Test2 Page</Link>
			</nav>
			<div>
				<h3>Tests</h3>
				<ol>
					<li>
						With <code>Native HTML Anchor</code> element
					</li>
					<li>
						With <code>Next Link</code> element
					</li>
				</ol>
			</div>
			<div>
				<h4>HTML Anchor Element</h4>
				<ol>
					<li>No prefetch on hover</li>
					<li>
						Next does prefetch the page but onclick of Anchor it
						executes GSSP on server again
					</li>
				</ol>
			</div>
			<div>
				<h4>Next Link element</h4>
				<ol>
					<li>
						No need for prefetch on hover since it prefetches page /
						tsx components
					</li>
					<li>
						Next does prefetch the page but onclick of Anchor it
						executes GSSP on server again - Check note below for
						solution
					</li>
				</ol>

				<div
					style={{
						border: "solid",
						borderRadius: "4px",
						padding: "0 10px",
					}}
				>
					<h3>
						<i>Note: </i>
					</h3>
					<ol>
						<li>
							<p>Nextjs breaks a page into 2 parts:</p>
							<p>a) UI Part i.e. Components</p>
							<p>b) Data required to render those components</p>
							<p>
								Next.js automatically prefetches the UI Part
								when <code>Link</code> component is used.
							</p>
							<p>
								The data required to render the components is
								fetched when the page link is clicked / page is
								requested. This is done by{" "}
								<code>getServerSideProps</code> or{" "}
								<code>getStaticProps</code> functions.
							</p>
						</li>
						<hr />
						<li>
							To cache the response from{" "}
							<code>getServerSideProps</code> you can set the{" "}
							<code>Cache Control</code> header.
							<p>Example</p>
							<code>
								context.res.setHeader(
								&quot;Cache-Control&quot;, &quot;private,
								max-age=10, stale-while-revalidate=300&quot; );
							</code>
						</li>
					</ol>
				</div>
			</div>
		</div>
	);
}
