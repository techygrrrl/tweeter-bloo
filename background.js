chrome.tabs.onUpdated.addListener(
  function(tabId, changeInfo, tab) {
    if (changeInfo.url) {
      console.log('tab changed!!!', { changeInfo })

      chrome.tabs.sendMessage(tabId, {
        type: 'URL_CHANGED',
        url: changeInfo.url
      })
    }
  }
);