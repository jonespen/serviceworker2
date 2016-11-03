importScripts('idb-keyval-min.js');

// Version 0.3

// #1: Cache files for offline support
const dataCacheName = 'cat-chat-v1';
const firebaseUrl = 'https://cat-chat-827fd.firebaseio.com';
const firebaseMessageUrl = `${firebaseUrl}/messages.json`;

const filesToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/subscribe.js',
  '/chat.js',
  '/idb-keyval-min.js',
  '/images/cat.jpg'
];

// self.addEventListener('install', function(e) {
//   console.log('[ServiceWorker] Install');
//   e.waitUntil(
//     caches.open(dataCacheName).then(function(cache) {
//       console.log('[ServiceWorker] Caching app shell');
//       return cache.addAll(filesToCache);
//     })
//   );
// });

// self.addEventListener('activate', function(e) {
//   console.log('[ServiceWorker] Activate');
//   e.waitUntil(
//     caches.keys().then(function(keyList) {
//       return Promise.all(keyList.map(function(key) {
//         console.log('[ServiceWorker] Removing old cache');
//         if (key !== dataCacheName) {
//           return caches.delete(key);
//         }
//       }));
//     })
//   );
// });

// self.addEventListener('fetch', function(event) {
//   console.log('[ServiceWorker] Fetch', event.request.url);
//   // If request includes firebase url and not cached, put in cache and return response
//   // Not recommended for frequently updated data, use sw-toolbox for more control
//   if (event.request.url.indexOf(firebaseUrl) === 0) {
//     event.respondWith(
//     	caches.open(dataCacheName).then(function(cache) {
// 	      return cache.match(event.request).then(function (response) {
// 	        return response || fetch(event.request).then(function(response) {
// 	          cache.put(event.request, response.clone());
//             console.log('[ServiceWorker] Fetched&Cached Data');
// 	          return response;
// 	        });
// 	      });
// 	    })
//     );
//   } else {
//     event.respondWith(
//       caches.match(event.request).then(function(response) {
//         return response || fetch(event.request);
//       })
//     );
//   }
// });

// #2: Add push support
self.addEventListener('push', function(event) {
  console.log('Push message', event);

  var title = 'MAIL';

  // You can't send any data with a push message
  event.waitUntil(
  	fetch(`${firebaseUrl}/messages.json`)
  		.then((response) => response.json())
  		.then((json) => {
  			// Get the last (newest) message
  			const sortedMessages = Object.keys(json)
  				.map((x) => json[x])
  				.sort((x, y) => x.timestamp < y.timestamp);

  			return self.registration.showNotification(title, {
					'body': sortedMessages[0].value,
					'icon': 'images/catwrap.jpg'
				});
  		})
	);
});

self.addEventListener('notificationclick', function(event) {
  console.log('Notification click: tag', event.notification.tag);
  // Android doesn't close the notification when you click it
  // See http://crbug.com/463146
  event.notification.close();
  var url = 'http://localhost:8080/';
  // Check if there's already a tab open with this URL.
  // If yes: focus on the tab.
  // If no: open a tab with the URL.
  event.waitUntil(
    clients.matchAll({
      type: 'window'
    })
    .then(function(windowClients) {
      console.log('WindowClients', windowClients);
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        console.log('WindowClient', client);
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// #3: Background sync

function broadcast(message) {
  return clients.matchAll().then(function(clients) {
    for (var client of clients) {
      client.postMessage(message);
    }
  });
}

function sendMessage() {
	return idbKeyval.get('message')
		.then((message) => {
			if(message){
				return fetch(firebaseMessageUrl, {
					method: 'POST',
					headers: {
			      'Accept': 'application/json',
			      'Content-Type': 'application/json',
			    },
					body: JSON.stringify(message)
				})
				.then((res) => res.json())
				.then((json) => {
					broadcast({ [json.name]: message });
				});
			} else {
				return Promise.resolve();
			}
		});
}

self.addEventListener('sync', function (event) {
	console.log('[ServiceWorker] Sync', event);
  if (event.tag === 'postMessage') {
    event.waitUntil(sendMessage());
  }
});


