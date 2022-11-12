let globalCurrentTabId = null;

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  globalCurrentTabId = tabId;

  if (changeInfo.url) {
    chrome.tabs.sendMessage(tabId, {
      type: "URL_CHANGED",
      url: changeInfo.url,
    });
  }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.debugger.attach(
    { tabId: activeInfo.tabId },
    "1.0",
    onAttach.bind(null, activeInfo.tabId)
  );
});



function onAttach(tabId) {
  // console.log("onAttach", tabId);
  chrome.debugger.sendCommand(
    {
      tabId: tabId,
    },
    "Network.enable",
    {},
    (result) => {
      // console.log("onAttach result", result);
    }
  );

  chrome.debugger.onEvent.addListener(
    // (source: Debuggee, method: string, params?: object) => void
    (source, method, params) => {
      if (globalCurrentTabId !== source.tabId) {
        // console.log("Not the same tab. Skipping.");
        return;
      }

      if (method === "Network.responseReceived") {
        // console.log("Method is network response received");

        chrome.debugger.sendCommand(
          {
            tabId: source.tabId,
          },
          "Network.getResponseBody",
          {
            requestId: params?.requestId,
          },
          // (result?: object) => void
          (result) => {
            // console.log('???? params', params)
            const isRightUrl = params?.response?.url?.includes('HomeTimeline')
            if (isRightUrl && result && result?.body?.includes('"is_blue_verified":')) {
              handleTimelineResponse(result?.body, source.tabId, params);
            }
          }
        );
      }
    }
  );
}

function handleTimelineResponse(responseBody, tabId, params) {
  console.log('Handling response', params.response.url)

  const data = JSON.parse(responseBody).data
  const instructions = data.home.home_timeline_urt.instructions;

  const verifiedReport = {
  }

  instructions.forEach(({ entries }) => {
    entries?.forEach((entry, idx) => {
      console.log('Processing index', idx)

      if (entry.content.__typename !== 'TimelineTimelineItem') {
        return
      }

      const itemContent = entry.content.itemContent;

      if (itemContent) {
        // console.log('tweet??', itemContent.tweet_results.result)
        const username = itemContent.tweet_results.result.core?.user_results.result.legacy.screen_name;
        const isBlueVerified = itemContent.tweet_results.result.core?.user_results.result.is_blue_verified;
  
        verifiedReport[username] = isBlueVerified
      }
    })
  })

  // console.log('tabId???', tabId)
  // console.log('params???', params)

  console.log('Sending report', verifiedReport)

  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      chrome.tabs.sendMessage(tab.id, {
        type: "VERIFIED_REPORT",
        data: verifiedReport,
      });
    })
  })
}
