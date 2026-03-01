import { UsestateComponent } from "./useStateComp";
import { UseEffectComponent } from "./UseEffectComp";
import "./App.css";

function App() {
	return (
		<div>
			<section>
				<h1>useState</h1>
				<UsestateComponent />
			</section>
			<section>
				<h1>useEffect</h1>
				<UseEffectComponent />
			</section>
		</div>
	);
}

export default App;
