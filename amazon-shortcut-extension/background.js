chrome.commands.onCommand.addListener((command) => {
	if (command === "focus-search-bar") {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			if (tabs[0] && tabs[0].url.includes("amazon.in")) {
				chrome.scripting.executeScript({
					target: { tabId: tabs[0].id },
					func: () => {
						const searchBar = document.getElementById(
							"twotabsearchtextbox"
						);

						if (searchBar && document.activeElement !== searchBar) {
							searchBar.focus();
						}
					},
				});
			}
		});
	}
});
