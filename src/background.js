function startHighlighter() {
  chrome.tabs.executeScript({
    file: "startHighlighter.js",
  });
}

chrome.browserAction.onClicked.addListener(startHighlighter);