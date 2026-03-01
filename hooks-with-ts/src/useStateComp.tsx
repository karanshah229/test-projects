import { useState } from "react";

export function UsestateComponent() {
	const [arr, setArr] = useState<number[]>([]);
	const [name, setName] = useState<string | null>(null);

	return (
		<>
			<div>
				<button onClick={() => setArr([...arr, arr.length + 1])}>
					Add number to array
				</button>
				{JSON.stringify(arr)}
			</div>
			<div>
				<button onClick={() => setName("Karan Shah")}>Set name</button>
				{JSON.stringify(name)}
			</div>
		</>
	);
}
