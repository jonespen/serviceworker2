'use strict';

const subscribeButtonEl = document.getElementById('subscribe');

if(!enableSub){
	subscribeButtonEl.style.display = 'none';
}

if(enableSub && subscribeButtonEl){
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
			let endpointParts = sub.endpoint.split('/')
    	let registrationId = endpointParts[endpointParts.length - 1]
	    console.log('Subscribed! registrationId:', registrationId);
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
