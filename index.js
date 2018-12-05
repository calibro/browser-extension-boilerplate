// Listen for messages
browser.runtime.onMessage.addListener(receiver);

// original body id
const body = document.querySelector("body");

// A message is received
function receiver(request, sender, sendResponse) {
  if (request.active) {
    //do something
    body.classList.toggle("my-beautiful-extension");
    move("#toc", "#mw-panel");
  } else {
    //do else
    body.classList.toggle("my-beautiful-extension");
    moveBack("#toc");
  }
}

function move(selector, newContainerSelector) {
  const element = document.querySelector(selector);
  const elementClone = element.cloneNode(true);
  elementClone.classList.add("my-beautiful-extension-moved");

  const newContainer = document.querySelector(newContainerSelector);
  newContainer.appendChild(elementClone);
  element.style.display = "none";
}

function moveBack(selector) {
  const elementClone = document.querySelector(
    selector + ".my-beautiful-extension-moved"
  );
  elementClone.parentNode.removeChild(elementClone);
  const element = document.querySelector(selector);
  element.style.display = "";
}
