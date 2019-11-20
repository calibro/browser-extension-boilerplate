browser.runtime.onMessage.addListener(receiver);

// original body id
const body = document.querySelector("body");

var observer = new MutationObserver(process);
observer.observe(document.querySelector("body"), {
  childList: true,
  subtree: true
});

function process() {
  //logo
  // const logo = document.querySelector(".rep-main-logo");
  // if (!logo.classList.contains("logoRotated")) {
  //   logo.classList.add("logoRotated");
  // }
}

// A message is received
function receiver(request, sender, sendResponse) {
  if (request.active) {
    body.classList.add("my-beautiful-extension");
  } else {
    body.classList.remove("my-beautiful-extension");
  }
}
