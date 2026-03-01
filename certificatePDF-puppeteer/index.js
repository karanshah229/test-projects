import puppeteer from "puppeteer";

(async () => {
	// Launch the browser and open a new blank page
	const browser = await puppeteer.launch({
		headless: false,
	});
	const page = await browser.newPage();

	// Navigate the page to a URL
	await page.goto("http://localhost:8095/skillup/test", {
		waitUntil: "networkidle0",
	});

	const result = await page.pdf({
		format: "a4",
		path: "/Users/karan/Test_Projects/certificatePDF-puppeteer/test.pdf",
	});
	await browser.close();
})();

// import puppeteer from "puppeteer";

// export async function saveAsPdf(_url) {
// 	const url = `localhost:8095/skillup/${_url}`;
// 	console.log("url", url);
// 	const browser = await puppeteer.launch();
// 	const page = await browser.newPage();

// 	await page.goto(url, {
// 		waitUntil: "networkidle0",
// 	});

// 	const result = await page.pdf({
// 		format: "a4",
// 	});
// 	await browser.close();

// 	return result;
// }

// export default async (req, res) => {
// 	const { url } = req.query; // pass the page to create PDF from as param

// 	res.setHeader("Content-Disposition", `attachment; filename="file.pdf"`);
// 	res.setHeader("Content-Type", "application/pdf");

// 	const pdf = await saveAsPdf(url);

// 	return res.send(pdf);
// };
