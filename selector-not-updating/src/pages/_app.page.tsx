import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { wrapper } from "../store";

export default function MyApp({ Component, ...rest }: AppProps) {
	const {
		store,
		props: { pageProps },
	} = wrapper.useWrappedStore(rest);

	return (
		<Provider store={store}>
			<Component {...pageProps} />
		</Provider>
	);
}
