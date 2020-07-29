function startHighlighter() {
  chrome.tabs.executeScript({
    file: "startHighlighter.js",
  });
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.browserAction.onClicked.addListener(startHighlighter);
});
