import { PDFDownloadLink, Page, Document, Text } from "@react-pdf/renderer";

export function GenerateSVGContent() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="1160"
			height="840"
			viewBox="0 0 297 210"
		>
			<rect x="0" y="0" width="100%" height="100%" fill="dodgerblue" />
			<text
				x="148.5"
				y="105"
				text-anchor="middle"
				dominant-baseline="middle"
				fill="black"
			>
				Dynamic SVG
			</text>
		</svg>
	);
}

function Test2() {
	return (
		<div>
			Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nostrum,
			quam.
		</div>
	);
}

function Test() {
	return (
		<Document>
			<Page size="A4">
				{/* <GenerateSVGContent /> */}
				<Test2 />
			</Page>
		</Document>
	);
}

export function DownloadReactPDF() {
	return (
		<PDFDownloadLink document={<Test2 />} fileName="somename.pdf">
			{({ blob, url, loading, error }) => {
				console.log(blob, url, loading, error);
				return loading ? "Loading document..." : "Download now!";
			}}
		</PDFDownloadLink>
	);
}
