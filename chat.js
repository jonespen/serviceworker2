const firebaseUrl = 'https://cat-chat-827fd.firebaseio.com';
const firebaseMessageUrl = `${firebaseUrl}/messages.json`;
const dataCacheName = 'cat-chat-v1';

// store messages here
let messages = {};
const messagesEl = document.getElementById('messages');

const loadMessages = () => {
  fetch(firebaseMessageUrl)
  	.then((response) => response.json())
  	.then((json) => {
  		messages = json;
  		updateMessages();
  	});
}

const updateMessages = () => {
	messagesEl.innerHTML = `
		<ul>
			${Object.keys(messages).map((key) => `<li>${messages[key].value}</li>`).join('')}
		</ul>`
}

const deleteFirebaseCache = () => {
	if('caches' in window){
		caches.open(dataCacheName)
			.then((cache) => {
				cache.delete(firebaseUrl);
				return cache;
			})
			.then((cache) => {
				// Fetch the new messages and store to cache
				fetch(firebaseMessageUrl)
					.then((response) => {
						cache.put(firebaseMessageUrl, response);
					});
			});
	}
}

const onMessageSave = (newObject, data) => {
	messages[newObject.name] = data;
	updateMessages();
}

const init = () => {
	// load messages from firebase, which also loads them
	loadMessages();
	// listen for submits on form
	const formEl = document.getElementById('form');
	const textareaEl = document.getElementById('textarea');
	formEl.addEventListener('submit', (e) => {
		e.preventDefault();
		if(textareaEl.value){
			const data = { value: textareaEl.value, timestamp: Date.now() };

			if (reg && reg.sync) {
				console.log('Browser support sw sync 🤗');
				idbKeyval.set('message', data).then(() => {
					idbKeyval.get('message').then((msg) => console.log(msg));
					reg.sync.register('postMessage').then(() => console.log('postMessage registered'));
				});
			} else {
				console.log('Browser sync not supported 😭');
				fetch(firebaseMessageUrl, {
					method: 'POST',
					headers: {
	          'Accept': 'application/json',
	          'Content-Type': 'application/json',
	        },
					body: JSON.stringify(data)
				})
				.then((response) => response.json())
				.then((id) => onMessageSave(id, data));
			}
		}
	}, false);
}


init();

// #3: Sync
function onServiceWorkerMessage(message){
	console.log('onServiceWorkerMessage', message);
	onMessageSave(message);
}
if (navigator.serviceWorker) {
  navigator.serviceWorker.addEventListener('message', (event) => onServiceWorkerMessage(event.data));
}

