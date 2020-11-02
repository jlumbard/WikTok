// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';




chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({color: '#3aa757'}, function() {
    console.log("The color is green.");
  });

  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: 'en.wikipedia.org'},
      })
      ],
          actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
    console.log("page changed")

  });
});

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
