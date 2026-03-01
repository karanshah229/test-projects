import { GetServerSidePropsContext, PreviewData } from "next";
import { ParsedUrlQuery } from "querystring";
import { AppStoreType } from "../../store";
import { todoAPI } from "@/services/todos";

export function testHOF(
	store: AppStoreType,
	gssp: (
		context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
	) => any
) {
	return async function innerFn(
		context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
	) {
		await store.dispatch(todoAPI.endpoints.getAllTodos.initiate(undefined));

		return gssp(context);
	};
}
