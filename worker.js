importScripts('/bower_components/cache-polyfill/dist/serviceworker-cache-polyfill.js');

// The SW will be shutdown when not in use to save memory,
// be aware that any global state is likely to disappear
console.log('SW startup');

var DEFAULT_CACHE = 'sw-tester-static3';
var S3_CACHE = 's3-tester-static3';

self.addEventListener('install', function(event) {
  // pre cache a load of stuff:
  event.waitUntil(
    caches.open(DEFAULT_CACHE).then(function(cache) {
      return cache.addAll([
        '/index.html',
        '/foo.html',
        '/app.js'
      ]);
    })
  )
});

self.addEventListener('activate', function(event) {
  var cacheWhitelist = [DEFAULT_CACHE, S3_CACHE];

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  console.log('fetching', event.request.url);
  var requestURL = new URL(event.request.url);

  if (requestURL.hostname == 's3.amazonaws.com') {
    console.log('fetching from amazon');
    event.respondWith(s3Response(event.request));
  } else {
    console.log('derp');
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  }
});

function s3Response(request) {
  return caches.match(request).then(function(response) {
    if (response) {
      return response;
    }

    return fetch(request).then(function(response) {
      caches.open(S3_CACHE).then(function(cache) {
        cache.put(request, response).then(function() {
          console.log('yey img cache');
        }, function() {
          console.log('nay img cache');
        });
      });

      return response.clone();
    });
  });
}
