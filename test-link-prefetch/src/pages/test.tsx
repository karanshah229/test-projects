import { GetServerSideProps } from "next";

export default function Test(props: any) {
	const { data = {} } = props;
	console.log(data);
	return (
		<div>
			<div>Test</div>
			{JSON.stringify(data)}
		</div>
	);
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	const resp = await fetch(
		"https://random-data-api.com/api/users/random_user"
	);

	context.res.setHeader(
		"Cache-Control",
		"private, max-age=10, stale-while-revalidate=300"
	);

	console.log("Test Page");
	const data = await resp.json();

	console.log(data);

	return {
		props: {
			data,
		},
	};
};
