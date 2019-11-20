const TITLE_APPLY = "apply css";
const TITLE_REMOVE = "remove css";
const APPLICABLE_PROTOCOLS = ["http:", "https:"];

/*
Toggle CSS: based on the current title, insert or remove the CSS.
Update the page action's title and icon to reflect its state.
*/
async function toggleCSS(tab) {
  const title = await browser.pageAction.getTitle({ tabId: tab.id });
  const storage = await browser.storage.local.get();
  if (title === TITLE_APPLY) {
    browser.pageAction.setIcon({
      tabId: tab.id,
      path: {
        "19": "icons/icon-19.png",
        "38": "icons/icon-38.png"
      }
    });
    browser.pageAction.setTitle({ tabId: tab.id, title: TITLE_REMOVE });
    storage.tabs[tab.id] = true;
    await browser.storage.local.set({ tabs: storage.tabs });
    sendMessage(true, tab.id);
  } else {
    browser.pageAction.setIcon({
      tabId: tab.id,
      path: {
        "19": "icons/icon-19-off.png",
        "38": "icons/icon-38-off.png"
      }
    });
    browser.pageAction.setTitle({ tabId: tab.id, title: TITLE_APPLY });
    storage.tabs[tab.id] = false;
    await browser.storage.local.set({ tabs: storage.tabs });
    sendMessage(false, tab.id);
  }
}

/*
Returns true only if the URL's protocol is in APPLICABLE_PROTOCOLS.
*/
function protocolIsApplicable(url) {
  var anchor = document.createElement("a");
  anchor.href = url;
  return APPLICABLE_PROTOCOLS.includes(anchor.protocol);
}

/*
Initialize the page action: set icon and title, then show.
Only operates on tabs whose URL's protocol is applicable.
*/
async function initializePageAction(tab) {
  if (protocolIsApplicable(tab.url)) {
    await browser.storage.local.clear();
    await sendMessage(false, tab.id);
    browser.pageAction.setIcon({
      tabId: tab.id,
      path: {
        "19": "icons/icon-19-off.png",
        "38": "icons/icon-38-off.png"
      }
    });
    browser.pageAction.setTitle({ tabId: tab.id, title: TITLE_APPLY });
    browser.pageAction.show(tab.id);
  }
}

async function updatePageAction(tab) {
  if (protocolIsApplicable(tab.url)) {
    if (tab.status === "complete") {
      const storage = await browser.storage.local.get();
      browser.pageAction.show(tab.id);
      if (storage.tabs[tab.id]) {
        browser.pageAction.setIcon({
          tabId: tab.id,
          path: {
            "19": "icons/icon-19.png",
            "38": "icons/icon-38.png"
          }
        });
        browser.pageAction.setTitle({ tabId: tab.id, title: TITLE_REMOVE });
        sendMessage(true, tab.id);
      }
    }
  }
}

/*
When first loaded, initialize the page action for all tabs.
*/

var gettingAllTabs = browser.tabs.query({});
gettingAllTabs.then(tabs => {
  for (let tab of tabs) {
    initializePageAction(tab);
  }
});

/*
Each time a tab is updated, reset the page action for that tab.
*/
browser.tabs.onUpdated.addListener((id, changeInfo, tab) => {
  browser.storage.local.get().then(storage => {
    if (!storage.tabs) {
      browser.storage.local.set({ tabs: {} });
    }
    updatePageAction(tab);
  });
});

/*
Toggle CSS when the page action is clicked.
*/
browser.pageAction.onClicked.addListener(toggleCSS);

async function sendMessage(value, tabId) {
  // Messages are just objects
  var msg = {
    active: value
  };
  browser.tabs.sendMessage(tabId, msg);
}
