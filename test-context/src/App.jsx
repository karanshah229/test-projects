import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import CompA from "./CompA";
import CompB from "./CompB";
import CompC from "./CompC";

function App() {
	const [count, setCount] = useState(0);

	return (
		<div className="App">
			<CompA contextVal={1} />
			<br />
			<CompB contextVal={1} />
			<br />
			{/* <CompC contextVal={1} />
			<br /> */}
		</div>
	);
}

export default App;
