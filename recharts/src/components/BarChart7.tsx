import { useEffect, useState } from "react";
import {
	Bar,
	BarChart,
	ReferenceDot,
	ReferenceLine,
	ResponsiveContainer,
	XAxis,
	YAxis,
} from "recharts";

import barChartData from "../pages/api/data.json";

function RenderCustomShape(props: any) {
	return (
		<g>
			<svg>
				<defs>
					<linearGradient
						id="grad1"
						x1="0%"
						y1="0%"
						x2="100%"
						y2="0%"
					>
						<stop
							offset="0%"
							style={{
								stopColor: "rgb(255,255,0)",
								stopOpacity: "1",
							}}
						/>
						<stop
							offset="100%"
							style={{
								stopColor: "rgb(255,0,0)",
								stopOpacity: "1",
							}}
						/>
					</linearGradient>
				</defs>
				<ellipse cx="250" cy="200" rx="25" ry="25" fill="url(#grad1)" />
				Sorry, your browser does not support inline SVG.
			</svg>
		</g>
	);
}

export const BarChart7 = () => {
	const [animationActive, setAnimationActive] = useState(false);

	useEffect(() => {
		setAnimationActive(true);
	}, []);

	return (
		<div style={{ width: "600px", height: "400px" }}>
			<h3 id="chart7">7. Reference Lines and Points</h3>
			<ResponsiveContainer height={350}>
				<BarChart data={barChartData.data}>
					<XAxis dataKey="name" />
					<YAxis dataKey="amt" />
					<ReferenceLine x="Page C" stroke="green" label="Min PAGE" />
					<ReferenceLine
						y={1600}
						label="Max"
						stroke="red"
						strokeDasharray="3 3"
					/>
					<ReferenceLine
						label="Segment"
						stroke="green"
						strokeDasharray="3 3"
						segment={[
							{ x: "Page A", y: 0 },
							{ x: "Page B", y: 1200 },
						]}
					/>
					<ReferenceDot
						r={20}
						fill="#82ca9d"
						stroke="none"
						label="Reference Dot"
						x="Page E"
						y={600}
						shape={RenderCustomShape}
					/>
					<Bar dataKey="uv" isAnimationActive={animationActive} />
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
};
