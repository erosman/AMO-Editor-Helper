// ==UserScript==
// @name          AMO Editor Helper
// @namespace     erosman
// @description   Helper functions for AMO Editors
// @updateURL     https://userscripts.org/scripts/source/.meta.js
// @downloadURL   https://userscripts.org/scripts/source/.user.js
// @include       https://addons.mozilla.org/en-US/editors/queue/*
// @grant         GM_setValue
// @grant         GM_getValue
// @author        erosman
// @version       1.0
// ==/UserScript==

/* --------- Note ---------
  This script enables addon list filtering.
  It also shows the changes in the queue totals.
  


  --------- History ---------
  

  1.0 Initial release
  
*/

(function() { // anonymous function wrapper, used for error checking & limiting scope
if (frameElement) { return; } // end execution if in a frame/object/embedding points
'use strict'; // ECMAScript 5


var tr = document.getElementsByClassName('addon-row');

for (var i = 0, len = tr.length; i < len; i++) {
  
  if (!tr[i].children[2].textContent.match(/Extension/i) ||           // not Extensions
       tr[i].children[7].textContent.match(/Binary|External/i) ||     // Binary Components|Requires External Software
       tr[i].querySelector('div[title="Admin Review"]') ||            // Admin Review
      !tr[i].querySelector('div[title="Firefox"]') ||                 // not Firefox
      !tr[i].querySelector('div[title="All Platforms"], div[title="Windows"]') // not Windows
     ) { tr[i].style.opacity = '0.5'; }
}


// stats
var tabnav = document.getElementsByClassName('tabnav');
if (!tabnav[0]) { return; } // end execution if not found

// temaplates
var span = document.createElement('span');
span.setAttribute('style', 'color: #f00;  font-size: 0.9em; vertical-align: super;'); // style for the notice

// check if stats was set previous, otherwise set it
try { var data = JSON.parse(GM_getValue('data')); }
catch (e) { // malformed data
  var data = {};
  data.stat = {};
}

// prepare variables
var fastTrack, fullRev, penUpdate, preRev, modRev;

var arr = [
  [fastTrack, 'fastTrack', 0],
  [fullRev, 'fullRev', 1],
  [penUpdate, 'penUpdate', 2],
  [preRev, 'preRev', 3],
  [modRev, 'modRev', 4],
];


for (var i = 0, len = arr.length; i < len; i++) {
  
  var item = arr[i];
  var node = tabnav[0].children[item[2]];
  item[0] = parseInt(node.textContent.match(/\d+/), 10) || 0;
  
  var n = data.stat && data.stat[item[1]] ? item[0] - data.stat[item[1]] : 0;
  if (n) { addStat(n, node.children[0]); }
  data.stat[item[1]] = item[0];
}

// update the data for the next time
GM_setValue('data', JSON.stringify(data));


function addStat(n, node) {

  var elem = span.cloneNode(false);
  elem.textContent = (n > 0 ? '+' : '') + n;
  node.appendChild(elem);
}


})(); // end of anonymous function
