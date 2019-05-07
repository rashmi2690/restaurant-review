const appName = 'restaurant-reviews';
const appVersion = '1';
const staticCache = appName + '-v_' + appVersion;

const imageCache = appName + '-images';

const appCaches = [staticCache,imageCache];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(staticCache).then((cache) => {
            cache.addAll([
                '/',
                '/restaurant.html',
                '/css/styles.css',
                '/data/restaurants.json',
                '/js/main.js',
                '/js/restaurant_info.js',
                '/js/dbhelper.js',
                'js/sw-register.js'
            ])
        })
    )
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if(key.startsWith(appName) && !appCaches.includes(key)){
                        return cache.delete(key);
                    }
                    return Promise.resolve(); //will return an empty promise if the condition is not satisfied, instead of undefined
                })
            )
        })
    )
});

self.addEventListener('fetch',(event) => {
    const requestURL = event.request.url;
    if (requestURL.includes('/restaurant.html')){
        event.respondWith(
            caches.match('/restaurant.html').then((response) => {
                return response;
            })
        );
        return;
    }
    if (requestURL.includes('/img/') && requestURL.includes('.jpg')){
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request).then((response) => {
                    return caches.open(imageCache).then((cache) => {
                        cache.put(event.request,response.clone());
                        return response;
                    })
                })
            })
        );
        return;
    }
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request)
        })
    )
});