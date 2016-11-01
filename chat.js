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
	console.log(messages);
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
			fetch(`${firebaseUrl}/messages.json`, {
				method: 'POST',
				headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
				body: JSON.stringify(data)
			})
			.then((response) => response.json())
			.then((newObject) => {
				messages[newObject.name] = data;
				updateMessages();

				// Delete cached firebase response
				//deleteFirebaseCache();
			});
		}
	}, false);
}

init();
