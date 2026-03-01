import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { HYDRATE } from "next-redux-wrapper";
import { type TodoType } from "./types/todo";

export const todoAPI = createApi({
	reducerPath: "todosAPI",
	baseQuery: fetchBaseQuery({
		baseUrl: "https://jsonplaceholder.typicode.com/",
	}),
	/* istanbul ignore next */
	extractRehydrationInfo(action, { reducerPath }) {
		if (action.type === HYDRATE) {
			return action.payload[reducerPath];
		}
		return undefined;
	},
	endpoints: (builder) => ({
		getAllTodos: builder.query<TodoType[], any>({ query: () => `todos` }),
	}),
});

export const { useLazyGetAllTodosQuery } = todoAPI;
