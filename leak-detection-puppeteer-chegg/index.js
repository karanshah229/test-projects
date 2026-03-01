import puppeteer from "puppeteer";

(async () => {
	// Launch the browser and open a new blank page
	const browser = await puppeteer.launch({
		headless: false,
		ignoreDefaultArgs: ["--enable-automation"],
	});
	const page = await browser.newPage();

	// Navigate the page to a URL
	await page.goto(
		"https://www.chegg.com/homework-help/questions-and-answers/trouble-windows-powershell-project-fizzbuzz-problem-code-function-fizzbuzz-int-x-n-0-n-lt--q74205203?trackid=87648ef5d1b6&strackid=1a134bc3f9e1&searchid=b863b238-2d8b-405d-b554-07b358715d47"
	);

	// await browser.close();
})();
