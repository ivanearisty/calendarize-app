import 'webextension-polyfill';
import { exampleThemeStorage } from '@extension/storage';

exampleThemeStorage.get().then(theme => {
  console.log('theme', theme);
});

const createCalendarEventID: string = 'createCalendarEvent';

console.log('background loaded');

console.log("Edit 'chrome-extension/lib/background/index.ts' and save to reload.");

chrome.runtime.onInstalled.addListener(async () => {
  chrome.contextMenus.create({
    id: createCalendarEventID,
    title: 'Create Calendar Event',
    contexts: ['selection'],
  });

  console.log('Context menu created');
});

chrome.contextMenus.onClicked.addListener(async (info: chrome.contextMenus.OnClickData, _tab?: chrome.tabs.Tab) => {
  if (info.menuItemId === createCalendarEventID) console.log('User Selected ', info.selectionText);
  if (info) console.log('test');
});
