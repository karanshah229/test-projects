import { useEffect, useState } from "react";
import {
	Bar,
	BarChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

import barChartData from "../pages/api/data.json";

const CustomTooltip = ({ active, payload, label }: any) => {
	if (active && payload && payload.length) {
		return (
			<div
				style={{
					background: "#82ca9d",
					padding: "10px",
					fontSize: "small",
				}}
			>
				<p className="label">{`${label} : ${payload[0].value}`}</p>
				<p className="desc">Anything you want can be displayed here.</p>
			</div>
		);
	}

	return null;
};

export const BarChart10 = () => {
	const [animationActive, setAnimationActive] = useState(false);

	useEffect(() => {
		setAnimationActive(true);
	}, []);

	return (
		<div style={{ width: "600px", height: "400px" }}>
			<h3 id="chart10">10. Hover effects</h3>
			<ResponsiveContainer height={350}>
				<BarChart data={barChartData.data}>
					<XAxis
						dataKey="name"
						onMouseOver={() => alert("Hovered over X-Axis")}
					/>
					<YAxis
						dataKey="amt"
						onMouseOver={() => alert("Hovered over Y-Axis")}
					/>
					<Tooltip
						labelStyle={{
							background: "red",
						}}
						cursor={false}
						content={CustomTooltip}
					/>
					<Bar dataKey="uv" isAnimationActive={animationActive} />
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
};
