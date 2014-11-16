// Install Service Worker
if (navigator.serviceWorker) {
  navigator.serviceWorker.register('/worker.js').then(function(reg) {
    console.log('◕‿◕', reg);
  }, function(err) {
    console.log('ಠ_ಠ', err);
  });
}

// Setup routing
var contacts = function() {
  console.log('changing to contacts');
  document.getElementById('foo').style.display = 'none';
  document.getElementById('home').style.display = 'block';
};
var foo = function() {
  console.log('changing to foo');
  document.getElementById('foo').style.display = 'block';
  document.getElementById('home').style.display = 'none';
};

var routes = {
  'contacts': contacts,
  'foo': foo
};

var router = Router(routes);
router.init('/');
