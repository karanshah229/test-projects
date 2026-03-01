import { useEffect, useState } from "react";
import {
	Bar,
	BarChart,
	Brush,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

import barChartData from "../pages/api/data.json";

export const BarChart11_12 = () => {
	const [animationActive, setAnimationActive] = useState(false);

	useEffect(() => {
		setAnimationActive(true);
	}, []);

	return (
		<>
			<div style={{ width: "600px", height: "800px" }}>
				<h3 id="chart11">11. Synced Bar Charts</h3>
				<div>
					<ResponsiveContainer height={350}>
						<BarChart data={barChartData.data} syncId="sync">
							<XAxis dataKey="name" />
							<YAxis dataKey="amt" />
							<Bar
								dataKey="uv"
								isAnimationActive={animationActive}
							/>
							<Tooltip />
						</BarChart>
					</ResponsiveContainer>
					<ResponsiveContainer height={350}>
						<BarChart data={barChartData.data} syncId="sync">
							<XAxis dataKey="name" />
							<YAxis dataKey="amt" />
							<Bar
								dataKey="uv"
								isAnimationActive={animationActive}
							/>
							<Tooltip />
						</BarChart>
					</ResponsiveContainer>
				</div>
			</div>
			<div style={{ width: "600px", height: "400px" }}>
				<h3 id="chart12">12. Brush</h3>
				<ResponsiveContainer height={350}>
					<BarChart data={barChartData.data}>
						<XAxis dataKey="name" />
						<YAxis dataKey="amt" />
						<Bar dataKey="uv" isAnimationActive={animationActive} />
						<Brush />
					</BarChart>
				</ResponsiveContainer>
			</div>
			<div>
				<h3 id="chart13">13. Zoom and Pan</h3>
				<a href="https://github.com/recharts/recharts/issues/710">
					Zoom and Pan Github Issue Page
				</a>
				<br />
				<a href="https://codesandbox.io/s/highlight-zomm-line-chart-forked-j560ov?file=/src/App.tsx">
					Zoom and Pan implementation
				</a>
			</div>
		</>
	);
};
