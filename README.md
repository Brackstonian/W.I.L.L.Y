# W.I.L.L.Y
W.I.L.L.Y (WebRTC Interactive Live Layer Yard)

.
├── dist
├── node_modules
├── public/
│   ├── css/
│   │   ├── home.css
│   │   ├── overlay.css
│   │   ├── share.css
│   │   └── view.css
│   └── js/
│       ├── home.bundle.js
│       ├── overlay.bundle.js
│       ├── share.bundle.js
│       └── view.bundle.js
├── src/
│   ├── main/
│   │   ├── eventHandlers.js
│   │   ├── main.js
│   │   └── windowManger.js
│   ├── renderer/
│   │   ├── pages/
│   │   │   ├── home.js
│   │   │   ├── overlay.js
│   │   │   ├── share.js
│   │   │   └── view.js
│   │   ├── canvasManager.js
│   │   └── peerManager.js
│   └── preload.js
├── styles/
│   ├── components/
│   │   └── video-player.scss
│   ├── layouts/
│   │   └── base.scss
│   ├── pages/
│   │   ├── home.scss
│   │   ├── overlay.scss
│   │   ├── share.scss
│   │   └── view.scss
│   ├── partials/
│   │   ├── button.scss
│   │   └── modal.scss
│   └── normalize.scss
├── views/
│   ├── components/
│   │   └── videoPlayer.twig
│   ├── layouts/
│   │   └── base.twig
│   ├── pages/
│   │   ├── home.twig
│   │   ├── overlay.twig
│   │   ├── share.twig
│   │   └── view.twig
│   └── partials/
│       ├── button.twig
│       └── modal.twig
├── .babelrc
├── .gitignore
├── package-lock.json
├── package.json
└── webpack.config.js