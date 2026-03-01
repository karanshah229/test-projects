import { useEffect, useState } from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	XAxis,
	YAxis,
} from "recharts";

import barChartData from "../pages/api/data.json";

function verticalCoordinatesGenerator(props: any) {
	const {
		width,
		xAxis: { domain },
	} = props;
	const gapBetweenVertLines = width / domain.length;
	const verticalCoordinates = [];
	for (let i = 2; i <= domain.length; i++) {
		verticalCoordinates.push(gapBetweenVertLines * 2 * i);
	}
	return verticalCoordinates;
}

function horizontalCoordinatesGenerator(props: any) {
	const { height } = props;
	const gapBetweenVertLines = height / barChartData.data.length;
	const horizontalCoordinates = [];
	for (let i = 0; i <= barChartData.data.length; i++) {
		horizontalCoordinates.push(gapBetweenVertLines * 3 * i);
	}
	return horizontalCoordinates;
}

export const BarChart4_5 = () => {
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
			<div style={{ width: "400px", height: "250px" }}>
				<h3 id="chart4">4. Grid - Only vertical</h3>
				<ResponsiveContainer height={200}>
					<BarChart data={barChartData.data}>
						<CartesianGrid vertical={false} />
						<XAxis dataKey="name" />
						<YAxis dataKey="amt" />
						<Bar dataKey="uv" isAnimationActive={animationActive} />
					</BarChart>
				</ResponsiveContainer>
			</div>
			<div style={{ padding: "1rem" }} />
			<div style={{ width: "400px", height: "250px" }}>
				<h3 id="chart5">5. Grid - Large Grid Gaps</h3>
				<ResponsiveContainer height={200}>
					<BarChart data={barChartData.data}>
						<CartesianGrid
							strokeDasharray="7 1 4"
							verticalCoordinatesGenerator={
								verticalCoordinatesGenerator
							}
							horizontalCoordinatesGenerator={
								horizontalCoordinatesGenerator
							}
						/>
						<XAxis dataKey="name" />
						<YAxis dataKey="amt" />
						<Bar dataKey="uv" isAnimationActive={animationActive} />
					</BarChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};
