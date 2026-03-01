import ReactDOMServer from "react-dom/server";
import html2pdf from "html2pdf.js";
import { jsPDF } from "jspdf";
import { Canvg } from "canvg";

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
				textAnchor="middle"
				dominantBaseline="middle"
				fill="black"
			>
				Dynamic SVG
			</text>
		</svg>
	);
}

export function DownloadPDFButton() {
	// const downloadPDF = () => {
	// 	const svgContent = ReactDOMServer.renderToStaticMarkup(
	// 		GenerateSVGContent()
	// 	);
	// 	// const blob = new Blob([svgContent], {
	// 	// 	type: "image/svg+xml;charset=utf-8",
	// 	// });
	// 	// const url = URL.createObjectURL(blob);
	// 	// // const imgHTML = `<img src="${url}" style="all: unset; display: block; max-width: 100%;">`;

	// 	html2pdf(svgContent, {
	// 		filename: "dynamic_svg.pdf",
	// 		jsPDF: {
	// 			unit: "px",
	// 			format: "a4",
	// 			orientation: "landscape",
	// 			putOnlyUsedFonts: true,
	// 			hotfixes: ["px_scaling"],
	// 		},
	// 	}).then(() => {
	// 		console.log("PDF downloaded");
	// 	});
	// };

	const downloadPDF = async () => {
		const svgContent = ReactDOMServer.renderToStaticMarkup(
			GenerateSVGContent()
		);

		const scale = 4; // Increase this value for higher resolution.
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");

		// Set the canvas dimensions to match the SVG dimensions, scaled by the resolution factor
		canvas.width = scale * 297; // Width of the SVG viewBox
		canvas.height = scale * 210; // Height of the SVG viewBox

		ctx.scale(scale, scale);

		const v = Canvg.fromString(ctx, svgContent);
		await v.start();

		const pdf = new jsPDF({
			unit: "mm",
			format: "a4",
			orientation: "landscape",
		});
		pdf.addImage(
			canvas.toDataURL("image/png"),
			"PNG",
			0,
			0,
			pdf.internal.pageSize.getWidth(),
			pdf.internal.pageSize.getHeight()
		);

		pdf.save("dynamic_svg.pdf");
	};

	return <button onClick={downloadPDF}>Download PDF</button>;
}
