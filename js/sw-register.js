if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(function(reg){
            console.log('service worker for restaurant-review app successfully registered');
        }).catch(function(reg){
            console.log('service worker for restaurant review app not registered')
    });
}