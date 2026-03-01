import { useSelector } from "react-redux";
import { AnotherComponent } from "../components/AnotherComponent";
import { getCounter, getCounterAPIValues } from "../slices/counterSlice";

export default function IndexPage() {
	const data = useSelector(getCounter);
	const { counter } = useSelector(getCounterAPIValues);

	return (
		<>
			<AnotherComponent />
			<h3>Counter Value</h3>
			<p>{data === undefined ? "undefined" : data}</p>
			<p>{JSON.stringify(counter)}</p>
		</>
	);
}
