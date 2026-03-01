import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

import barChartData from "../pages/api/data.json";

export const BarChart1 = () => {
	const [animationActive, setAnimationActive] = useState(false);

	useEffect(() => {
		setAnimationActive(true);
	}, []);

	return (
		<div style={{ width: "600px", height: "400px" }}>
			<h3 id="chart1">1. Simple YAxis, XAxis, Bars</h3>
			<ResponsiveContainer height={350}>
				<BarChart data={barChartData.data}>
					<XAxis dataKey="name" />
					<YAxis dataKey="amt" />
					<Bar dataKey="uv" isAnimationActive={animationActive} />
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
};
