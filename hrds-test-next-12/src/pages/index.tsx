import type { NextPage } from "next";
import Head from "next/head";

import Counter from "../features/counter/Counter";
import styles from "../styles/Home.module.css";
import { ActivityIcon } from "ui-icons";
import { Avatar, Button } from "@hackerrank/hrds-components";
import "@hackerrank/hrds-styles/dist/main.css";

const IndexPage: NextPage = () => {
	return (
		<div className={styles.container}>
			<Head>
				<title>Redux Toolkit</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<ActivityIcon />
			<Button>Test me</Button>
			<Avatar></Avatar>
		</div>
	);
};

export default IndexPage;
