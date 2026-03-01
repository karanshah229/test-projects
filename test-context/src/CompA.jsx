export default function CompA(props) {
	console.log("CompA rendered");
	return (
		<div style={{ border: "2px solid grey" }}>
			{props.contextVal}
			<p>CompA</p>
		</div>
	);
}
