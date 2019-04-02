(function(){
    if('serviceWorker' in navigator){ //deteksi service worker di browser
        console.log("SW ada")
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js').then(function(registration) {
              // Registration was successful
              console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }).catch(function(err) {
              // registration failed :(
              console.log('ServiceWorker registration failed: ', err);
            });
          });
    } else {
        console.log('service not supported in this Browser')
        return
    }
}) ();