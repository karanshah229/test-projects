export function Index() {
	return (
		<>
			<div
				style={{
					position: "fixed",
					top: 0,
					right: 0,
					backgroundColor: "#efefef",
					padding: "1rem",
				}}
			>
				<h3>Chart Types</h3>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						gap: "1rem",
					}}
				>
					<a href="#chart1">1. Simple YAxis, XAxis, Bars</a>
					<a href="#chart2">
						2. Customise both Axes - colors, ticks, labels, etc
					</a>
					<a href="#chart3">3. Customise individual bars</a>
					<div>
						<a href="#chart4">4. Grid Background</a>
						<br />
						<a href="#chart5">5. Grid - Large Grid Gaps</a>
					</div>
					<a href="#chart6">6. Legend</a>
					<a href="#chart7">7. Reference Lines and Points</a>
					<div>
						<a href="#chart8">8. Vertical Stacked Bar Chart</a>
						<br />
						<a href="#chart9">9. Horizontal Stacked Bar Chart</a>
					</div>

					<a href="#chart10">10. Hover Effects</a>
					<div>
						<a href="#chart11">11. Synced Bar Chart</a>
						<br />
						<a href="#chart12">12. Brush</a>
						<br />
						<a href="#chart13">13. Zoom and Pan</a>
					</div>
				</div>
			</div>
		</>
	);
}
