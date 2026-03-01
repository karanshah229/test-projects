import { GetServerSideProps } from "next";

export default function Test2() {
	return <div>Test</div>;
}

export const getServerSideProps: GetServerSideProps = async () => {
	const data = await fetch(
		"https://random-data-api.com/api/users/random_user"
	);

	console.log("Test2 Page");
	console.log(data.json().then((data) => console.log(data)));

	return {
		props: {},
	};
};
