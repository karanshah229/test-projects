import { createContext, useState } from "react";

export const TestContext = createContext({});

export default function TestContextProvider({ children }) {
	const [contextState, setContextState] = useState({
		val: "TestContext.Provider in seperate file does not rerender child components that don't use `useContext`",
	});
	return (
		<TestContext.Provider value={{ contextState, setContextState }}>
			{children}
		</TestContext.Provider>
	);
}
