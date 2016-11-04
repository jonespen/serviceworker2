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
		<ol>
			${Object.keys(messages).map((key) => `<li>${messages[key].value}</li>`).join('')}
		</ol>`
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

const onMessageSave = (message) => {
  console.log('onMessageSave', message);
	messages = Object.assign(messages, message)
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
			if (enablePush && reg && reg.sync) {
				console.log('Browser support sync 🤗');
				idbKeyval.set('message', data).then(() => {
					reg.sync.register('postMessage').then(() => console.log('postMessage registered'));
				});
			} else {
				console.log('Browser sync not or enabled supported 😭');
				fetch(firebaseMessageUrl, {
					method: 'POST',
					headers: {
	          'Accept': 'application/json',
	          'Content-Type': 'application/json',
	        },
					body: JSON.stringify(data)
				})
				.then((response) => response.json())
				.then((id) => onMessageSave({ [id.name]: data }));
			}
		}
	}, false);
}


init();

// #3: Sync
function onServiceWorkerMessage(data){
	onMessageSave(data);
}
if (navigator.serviceWorker) {
  navigator.serviceWorker.addEventListener('message', (event) => onServiceWorkerMessage(event.data));
}
