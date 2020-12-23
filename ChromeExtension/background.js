// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';




chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.set({ color: '#3aa757' }, function () {
    console.log("The color is green.");
  });

  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: { hostEquals: 'en.wikipedia.org' },
      })
      ],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
    console.log("page changed")

  });
});

function shootRequestIfURL(details) {
  if (/^[^:/]+:\/\/[^/]*en.wikipedia\.[^/.]+\//.test(details.url)) {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
      let currentURL = tabs[0].url;
      console.log(currentURL)
      console.log(details);
      if (chrome.storage) {
        chrome.storage.sync.get(['articleLiked'], function (obj) {
          chrome.storage.sync.get(['timeLoaded'], function (timeObj) {
            fetch('https://127.0.0.1:5000/pushUserInteractionData', {
              method: 'POST',
              credentials: 'include',
              crossDomain: true,
              headers: {
                'Accept': 'text/html',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                timeSpent: timeObj['timeLoaded'] - Date.now(),
                liked: obj['articleLiked']
              })
            })

              .then(response => response.text())
              .then(data => {
                console.log("test")
                console.log(data)
              })
          });
        });
        chrome.storage.sync.set({ articleLiked: false }, function () {
          console.log("articleLikedFalse");
        });
        chrome.storage.sync.set({ timeLoaded: Date.now() }, function () {
          console.log("resetTime")
         });
      }
      
      // use `url` here inside the callback because it's asynchronous!
    });
  }
}

chrome.webNavigation.onBeforeNavigate.addListener(shootRequestIfURL);

// chrome.webNavigation.onCompleted.addListener(function(event) {
//   alert(event.url + " onCompleted")

//   window.addEventListener('beforeunload', function (e) {
//     // Cancel the event
//     console.log('test beforeunload')
//     e.returnValue = '';
//   });

//   chrome.storage.sync.set({color: '#3aa757'}, function() {
//     console.log("The color is green.");


//   });
// }, {url: [{urlMatches : 'https://en.wikipedia.org/'}]});

// chrome.webNavigation.onBeforeNavigate.addListener(function(event) {
//   alert(event.url+" onBeforeRequest")
//   chrome.storage.sync.set({color: '#3aa757'}, function() {
//     console.log("The color is green.");
//   });
// }, {urls: ['https://en.wikipedia.org/*']});
