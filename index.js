// Listen for messages
browser.runtime.onMessage.addListener(receiver);

// A message is received
function receiver(request, sender, sendResponse) {
  if (request.active) {
    //do something
  } else {
    //do else
  }
}
