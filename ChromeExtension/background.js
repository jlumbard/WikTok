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
  console.log(details.url)
  if (/^[^:/]+:\/\/[^/]*en.wikipedia\.[^/.]+\//.test(details.url)) {
    console.log("Marked as a wiki uRL.")
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
      let currentURL = tabs[0].url;
      console.log(currentURL)
      console.log(details);
      //This ensures that the tab navigated FROM was a wiki link. It is probs more important than 
      //the one you navigate TO being a wiki link, IMO. THis is all more an art than a science though.
      if (/^[^:/]+:\/\/[^/]*en.wikipedia\.[^/.]+\//.test(currentURL)) {//THen both navigate to and from are wiki articles.
        console.log("Marked as a wiki uRL (2)")
        if (chrome.storage) {
          chrome.storage.sync.get(['articleLiked'], function (obj) {
            chrome.storage.sync.get(['timeLoaded'], function (timeObj) {
              fetch('https://127.0.0.1:5000/pushUserInteractionData', {
                method: 'POST',
                credentials: 'include',
                crossDomain: true,
                headers: {
                  'Accept': 'text/html',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  timeSpent: timeObj['timeLoaded'] - Date.now(),
                  liked: obj['articleLiked'],
                  article: currentURL
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
      }
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
