/* global chrome */

// Store preferences in synced storage if available, use local as a fallback:
// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/storage/sync
// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/storage/local
export default chrome.storage.sync || chrome.storage.local;
