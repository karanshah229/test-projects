import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import TestContextProvider, { TestContext } from "./Contexts/TestContext";
import "./index.css";

function Main() {
	return (
		<React.StrictMode>
			<TestContextProvider>
				<App />
			</TestContextProvider>
		</React.StrictMode>
	);
}

ReactDOM.createRoot(document.getElementById("root")).render(<Main />);
