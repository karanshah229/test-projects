import { useEffect, useState } from "react";

export function UseEffectComponent() {
	const [timerVal, setTimerVal] = useState(1);

	useEffect(() => {
		const timer = window.setInterval(() => {
			setTimerVal((t) => t + 1);
		}, 1000);
		return () => window.clearInterval(timer);
	}, []);

	return <div>Timer value: {timerVal}</div>;
}
