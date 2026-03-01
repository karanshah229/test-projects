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

const getPath = (
	x: number,
	y: number,
	width: number,
	height: number
) => `M${x},${y + height}
          C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3} ${
	x + width / 2
}, ${y}
          C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${
	y + height
} ${x + width}, ${y + height}
          Z`;

function CustomizedBarShape(props: any) {
	const { fill, x, y, width, height } = props;

	return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
}
export const BarChart3 = () => {
	const [animationActive, setAnimationActive] = useState(false);

	useEffect(() => {
		setAnimationActive(true);
	}, []);

	return (
		<div style={{ width: "600px", height: "400px" }}>
			<h3 id="chart3">3. Customise individual bars</h3>
			<ResponsiveContainer height={350}>
				<BarChart data={barChartData.data}>
					<XAxis dataKey="name" />
					<YAxis dataKey="amt" />

					<Bar
						dataKey="uv"
						isAnimationActive={animationActive}
						label={{ fill: "orange", fontSize: 20 }}
						maxBarSize={20}
						background={true}
					/>
					<Bar
						dataKey="pv"
						fill="#82ca9d"
						animationDuration={3000}
						animationEasing="ease-out"
						onClick={() => alert("Bar clicked")}
					>
						{barChartData.data.map((entry, index) => (
							<Cell
								key={`cell-${index}`}
								stroke="#8dd1e1"
								strokeWidth={4}
							/>
						))}
					</Bar>
					<Bar
						dataKey="pv"
						// stackId="uv"
						fill="#8884d8"
						shape={<CustomizedBarShape />}
						animationDuration={3000}
						animationEasing="ease-out"
						onClick={() => alert("Bar clicked")}
					/>
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
};
