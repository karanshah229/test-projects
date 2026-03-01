import Select from "react-select";

const Dashboard = () => {
	return (
		<div>
			<div>
				<Select
					theme={(theme) => ({
						...theme,
						borderRadius: 0,
						colors: {
							...theme.colors,
							primary25: "hotpink",
							primary: "black",
						},
					})}
				/>
			</div>
			Dashboard!!!
		</div>
	);
};

export default Dashboard;
