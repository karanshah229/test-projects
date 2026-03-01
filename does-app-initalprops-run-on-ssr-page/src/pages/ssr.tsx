export default function ssrPage() {
	return (
		<div>
			This is a page that uses <code>getServerSideProps</code>
		</div>
	);
}

export const getServerSideProps = async () => {
	const res = await fetch("https://api.github.com/repos/vercel/next.js");
	const repo = await res.json();
	return { props: { repo } };
};
