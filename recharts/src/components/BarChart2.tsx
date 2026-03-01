import { useEffect, useState } from "react";
import {
	Bar,
	BarChart,
	Cell,
	ResponsiveContainer,
	XAxis,
	YAxis,
} from "recharts";

import barChartData from "../pages/api/data.json";

function CustomXAxisLabel(props: any) {
	const {
		viewBox: { x, y, height, width },
		offset,
	} = props;

	return (
		<text x={width / 2 - offset * 10} y={height / 2 - offset * 2}>
			Custom X-Axis Label
		</text>
	);
}

function CustomYAxisLabel(props: any) {
	const {
		viewBox: { x, y, height, width },
		offset,
	} = props;

	return (
		<text x={width * 1.25} y={height}>
			Custom Y-Axis Label
		</text>
	);
}

function tickFormatterFn(value: any, index: number) {
	console.log(value);
	console.log(index);
	return `val-${value}-idx-${index}`;
}

export const BarChart2 = () => {
	const [animationActive, setAnimationActive] = useState(false);
	const XAxisDataKey = () => ["✅", "📖", "✨", "🎉", "💡", "🪝", "🦷", "🚶🏽"];

	useEffect(() => {
		setAnimationActive(true);
	}, []);

	return (
		<div style={{ width: "600px", height: "400px" }}>
			<h3 id="chart2">2. Custom YAxis, XAxis & Bars</h3>
			<ResponsiveContainer height={350}>
				<BarChart data={barChartData.data}>
					<XAxis
						dataKey={XAxisDataKey}
						orientation="top"
						angle={45}
						height={100}
						tickLine={false}
						tickSize={20}
						tickMargin={10}
						label={<CustomXAxisLabel />}
					/>
					<YAxis
						dataKey="amt"
						width={200}
						orientation="right"
						tickCount={20}
						tickSize={30}
						tickFormatter={tickFormatterFn}
						stroke="blue"
						strokeDasharray="5 5"
						tick={{
							stroke: "rebeccapurple",
							strokeWidth: 1.3,
							strokeDasharray: "4 1 1",
						}}
						mirror={true}
						reversed={true}
						label={<CustomYAxisLabel />}
						tickMargin={10}
						onClick={() => alert("YAxisClicked")}
					/>
					<Bar dataKey="uv" isAnimationActive={animationActive} />
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
};
