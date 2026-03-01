import { testHOF } from "@/HOF/test";
import { GetServerSidePropsContext, PreviewData } from "next";
import { Inter } from "next/font/google";
import { ParsedUrlQuery } from "querystring";
import { wrapper } from "../../store";
import { useLazyGetAllTodosQuery } from "@/services/todos";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

const CONDITION_IS_TRUE = true;
export default function Home() {
	const [query, { isFetching, isLoading, isError, data }] =
		useLazyGetAllTodosQuery();

	if (CONDITION_IS_TRUE && !isFetching && !isLoading && !isError) {
		query(undefined);
	}

	useEffect(() => {
		console.log(data);
	}, [data]);

	return (
		<main
			className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
		>
			<div className="w-full items-center justify-between font-mono">
				Index Page
				<hr />
				<br />
				<ol>
					{data?.map((val) => {
						return (
							<li key={val.id}>
								{val.completed.toString()} | {val.id} |{" "}
								{val.title} | {val.userId}
							</li>
						);
					})}
				</ol>
			</div>
		</main>
	);
}

export const getServerSideProps = wrapper.getServerSideProps((store) =>
	testHOF(store, async () => {
		return {
			props: {},
		};
	})
);
