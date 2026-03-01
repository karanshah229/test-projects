import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

import barChartData from "../pages/api/data.json";

export const BarChart8_9 = () => {
	const [animationActive, setAnimationActive] = useState(false);

	useEffect(() => {
		setAnimationActive(true);
	}, []);

	return (
		<div
			style={{
				display: "flex",
			}}
		>
			<div style={{ width: "600px", height: "400px" }}>
				<h3 id="chart8">8. Vertical Stacked Bar Chart</h3>
				<ResponsiveContainer height={350}>
					<BarChart data={barChartData.data}>
						<XAxis dataKey="name" />
						<YAxis dataKey="amt" />
						<Bar
							dataKey="uv"
							isAnimationActive={animationActive}
							stackId="uv"
						/>
						<Bar
							dataKey="pv"
							isAnimationActive={animationActive}
							stackId="uv"
							fill="#82ca9d"
						/>
						<Bar
							dataKey="amt"
							isAnimationActive={animationActive}
							stackId="uv"
							fill="#c4219d"
						/>
					</BarChart>
				</ResponsiveContainer>
			</div>
			<div style={{ width: "600px", height: "400px" }}>
				<h3 id="chart9">9. Horizontal Stacked Bar Chart</h3>
				<ResponsiveContainer height={350}>
					<BarChart data={barChartData.data} layout="vertical">
						<XAxis type="number" dataKey="amt" />
						<YAxis yAxisId={0} dataKey="name" type="category" />
						<Bar dataKey="uv" stackId="pv" fill="#8884d8" />
						<Bar dataKey="uv" fill="#82ca9d" stackId="pv" />
						<Bar dataKey="uv" fill="#c4219d" />
					</BarChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};
