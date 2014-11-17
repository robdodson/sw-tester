sw-tester
=========

## Chrome Bug
https://code.google.com/p/chromium/issues/detail?id=433708

## Steps to repro

- Fire up the app on a local server
- Navigate to localhost:[port]/#/contacts
- See the images load in. Refresh the page and verify they're loaded from service worker
- Click on the image
- Notice the url changes to /#/foo
- Notice the image has loaded again in the network panel (it should have been served from service worker)
- Open the console and run
```
navigator.serviceWorker.getRegistration().then(function(reg) {
  console.log(reg);
});
```
- Crash :[
