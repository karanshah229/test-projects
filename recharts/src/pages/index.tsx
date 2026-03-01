import { BarChart10 } from "@/components/BarChart10";
import { BarChart11_12 } from "@/components/BarChart11_12";
import { BarChart2 } from "@/components/BarChart2";
import { BarChart3 } from "@/components/BarChart3";
import { BarChart4_5 } from "@/components/BarChart4_5";
import { BarChart6 } from "@/components/BarChart6";
import { BarChart7 } from "@/components/BarChart7";
import { BarChart8_9 } from "@/components/BarChart8_9";
import { Index } from "@/components/Index";
import Head from "next/head";
import { BarChart1 } from "../components/BarChart1";

export default function Home() {
	return (
		<>
			<Head>
				<title>RechartLineChart</title>
			</Head>
			<BarChart1 />
			<BarChart2 />
			<BarChart3 />
			<BarChart4_5 />
			<BarChart6 />
			<BarChart7 />
			<BarChart8_9 />
			<BarChart10 />
			<BarChart11_12 />
			<Index />
		</>
	);
}
