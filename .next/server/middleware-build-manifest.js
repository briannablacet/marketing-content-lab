self.__BUILD_MANIFEST = {
  "polyfillFiles": [
    "static/chunks/polyfills.js"
  ],
  "devFiles": [
    "static/chunks/react-refresh.js"
  ],
  "ampDevFiles": [],
  "lowPriorityFiles": [],
  "rootMainFiles": [],
  "rootMainFilesTree": {},
  "pages": {
    "/": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/index.js"
    ],
    "/_app": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/_app.js"
    ],
    "/_error": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/_error.js"
    ],
    "/content-strategy": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/content-strategy.js"
    ],
    "/creation-hub": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/creation-hub.js"
    ],
    "/style-checker": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/style-checker.js"
    ],
    "/walkthrough/[step]": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/walkthrough/[step].js"
    ],
    "/walkthrough/complete": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/walkthrough/complete.js"
    ]
  },
  "ampFirstPages": []
};
self.__BUILD_MANIFEST.lowPriorityFiles = [
"/static/" + process.env.__NEXT_BUILD_ID + "/_buildManifest.js",
,"/static/" + process.env.__NEXT_BUILD_ID + "/_ssgManifest.js",

];