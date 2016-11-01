'use strict';

const subscribeButtonEl = document.getElementById('subscribe');

if(subscribeButtonEl){
	let isSubscribed = false;

	subscribeButtonEl.addEventListener('click', function() {
	  if (isSubscribed) {
	    unsubscribe();
	  } else {
	    subscribe();
	  }
	});

	function subscribe() {
	  reg.pushManager.subscribe({userVisibleOnly: true}).
	  then(function(pushSubscription) {
	    sub = pushSubscription;
	    console.log('Subscribed! Endpoint:', sub.endpoint);
	    subscribeButtonEl.textContent = 'Unsubscribe';
	    isSubscribed = true;
	  });
	}

	function unsubscribe() {
	  sub.unsubscribe().then(function(event) {
	    subscribeButtonEl.textContent = 'Subscribe';
	    console.log('Unsubscribed!', event);
	    isSubscribed = false;
	  }).catch(function(error) {
	    console.log('Error unsubscribing', error);
	    subscribeButtonEl.textContent = 'Subscribe';
	  });
	}
}
