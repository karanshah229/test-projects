import { useContext } from "react";
import { TestContext } from "./Contexts/TestContext";

export default function CompB(props) {
	const test = useContext(TestContext);
	const { contextState, setContextState } = useContext(TestContext);
	return (
		<div style={{ border: "2px solid grey" }}>
			<p>CompB</p>
			<table border="1">
				<tbody>
					<tr>
						<td>props.contextVal</td>
						<td>{props.contextVal}</td>
					</tr>
					<tr>
						<td>contextState</td>
						<td>{contextState.val}</td>
					</tr>
				</tbody>
			</table>
			<div>
				<button
					onClick={() =>
						setContextState({ val: "context set from comp B" })
					}
				>
					Update context value
				</button>
			</div>
		</div>
	);
}
