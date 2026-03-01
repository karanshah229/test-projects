import { useEffect, useState } from "react";
import {
	Bar,
	BarChart,
	Legend,
	ResponsiveContainer,
	XAxis,
	YAxis,
} from "recharts";

import barChartData from "../pages/api/data.json";

function renderLegendContent(props: any) {
	console.log("props");
	console.log(props);
}

export const BarChart6 = () => {
	const [animationActive, setAnimationActive] = useState(false);

	useEffect(() => {
		setAnimationActive(true);
	}, []);

	return (
		<div style={{ width: "600px", height: "400px" }}>
			<h3 id="chart6">6. Legend</h3>
			<ResponsiveContainer height={350}>
				<BarChart data={barChartData.data}>
					<XAxis dataKey="name" />
					<YAxis dataKey="amt" />
					<Bar
						dataKey="uv"
						isAnimationActive={animationActive}
						legendType="cross"
						fill="#82ca9d"
					/>
					<Bar
						dataKey="pv"
						isAnimationActive={animationActive}
						legendType="circle"
						fill="#8884d8"
					/>
					<Bar
						dataKey="uv"
						isAnimationActive={animationActive}
						legendType="diamond"
						fill="#c4219d"
					/>
					<Legend
						verticalAlign="middle"
						height={36}
						layout="vertical"
						align="right"
						iconSize={20}
						onClick={() => alert("Legend Clicked")}
						wrapperStyle={{
							border: "1px dashed #c4219d",
							height: "fit-content",
							padding: "10px",
						}}
						formatter={(value, entry, index) => {
							console.log(value);
							console.log(entry);
							console.log(index);

							return `${value}-${entry.type}-index${index}`;
						}}
						// content={renderLegendContent}
					/>
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
};
