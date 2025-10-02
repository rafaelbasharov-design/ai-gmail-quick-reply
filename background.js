// background.js
chrome.runtime.onInstalled.addListener(() => {
  console.log("✅ Gmail AI Quick Reply extension installed");
});

// respond to content script to open popup
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && msg.action === "openPopup") {
    // open extension popup (MV3)
    chrome.action.openPopup().then(() => {
      sendResponse({ opened: true });
    }).catch(err => {
      console.warn("openPopup failed:", err);
      sendResponse({ opened: false, error: err?.message });
    });
    return true; // will respond asynchronously
  }
});
