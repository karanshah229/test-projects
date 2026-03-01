import { GetServerSideProps } from "next";

export default function SecondPage() {
	return "Second Page";
}

export const getServerSideProps = (async () => {
	console.log("Second Page GSSP Triggered");
	return { props: { test: 1 } };
}) satisfies GetServerSideProps<{
	test: number;
}>;
