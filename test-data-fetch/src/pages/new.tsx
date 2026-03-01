import { useFetchData } from "./fetchData";

export default function NewPage() {
	const data = useFetchData();
	console.log("data");
	console.log(data);

	return (
		<div>
			<img src={data?.message} alt="Dog" />
		</div>
	);
}
