import '@src/Popup.css';
import { useStorageSuspense, withErrorBoundary, withSuspense } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';
import type { ComponentPropsWithoutRef } from 'react';
import { FaCoffee } from 'react-icons/fa'; // For the BuyMeACoffee Icon

const Popup = () => {
  const theme = useStorageSuspense(exampleThemeStorage);
  const isLight = theme === 'light';
  const logo = isLight ? 'popup/Logo Dark.svg' : 'popup/Logo Dark.svg';

  const injectContentScript = async () => {
    const [tab] = await chrome.tabs.query({ currentWindow: true, active: true });

    await chrome.scripting
      .executeScript({
        target: { tabId: tab.id! },
        files: ['/content-runtime/index.iife.js'],
      })
      .catch(err => {
        if (err.message.includes('Cannot access a chrome:// URL')) {
          alert('You cannot inject script here!');
        }
      });
  };

  const openOptionsPage = () => {
    chrome.runtime.openOptionsPage();
  };

  return (
    <div className={`App ${isLight ? 'bg-slate-50' : 'bg-gray-800'}`}>
      <header className={`App-header ${isLight ? 'text-gray-900' : 'text-gray-100'}`}>
        {/* Logo at the top */}
        <img src={chrome.runtime.getURL(logo)} className="App-logo" alt="logo" />

        {/* Welcome message */}
        <h2 className="font-bold text-xl mb-4">Welcome to Calendarize!</h2>
        <p className="text-sm mb-4 ">Easily extract events from web pages and add them to your Google Calendar.</p>

        {/* Button to inject content script */}
        <button
          className={
            'font-bold mt-4 py-2 px-6 rounded shadow hover:scale-105 transition-all ' +
            (isLight ? 'bg-blue-500 text-white' : 'bg-gray-700 text-white')
          }
          onClick={injectContentScript}>
          Create Calendar Event
        </button>

        {/* Button to open options page */}
        <button
          className={
            'font-bold mt-4 py-2 px-6 rounded shadow hover:scale-105 transition-all ' +
            (isLight ? 'bg-green-400 text-black' : 'bg-gray-600 text-white')
          }
          onClick={openOptionsPage}>
          Open Options
        </button>

        <ToggleButton> Toggle Theme </ToggleButton>

        {/* BuyMeACoffee icon */}
        <a
          href="https://www.buymeacoffee.com/yourprofile"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 text-sm text-yellow-500 hover:text-yellow-600">
          <FaCoffee /> Buy Me a Coffee
        </a>
      </header>
    </div>
  );
};

const ToggleButton = (props: ComponentPropsWithoutRef<'button'>) => {
  const theme = useStorageSuspense(exampleThemeStorage);
  return (
    <button
      className={
        props.className +
        ' ' +
        'font-bold mt-4 py-1 px-4 rounded shadow hover:scale-105 ' +
        (theme === 'light' ? 'bg-white text-black shadow-black' : 'bg-black text-white')
      }
      onClick={exampleThemeStorage.toggle}>
      {props.children}
    </button>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div>Loading...</div>), <div>Error Occurred</div>);
