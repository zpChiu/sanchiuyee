chrome.tabs.onCreated.addListener(function (tab) {
    console.log(tab.pendingUrl);
});
chrome.browserAction.onClicked.addListener(function(tab) {
    console.log(tab)
    chrome.tabs.create({
		url: "index.html"
	})
});
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log(request);
    console.log(sender);
    console.log(sendResponse);
})