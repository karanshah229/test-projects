import Link from "next/link";
import { useRouter } from "next/router";

export function AppHeader() {
	// const router = useRouter();

	console.log("Appheader triggered");

	return (
		<nav>
			<Link href={"/"}>Index Page</Link>
			<Link href={"/second"}>Second Page</Link>
		</nav>
	);
}
