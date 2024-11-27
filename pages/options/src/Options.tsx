import '@src/Options.css';
import { useStorageSuspense, withErrorBoundary, withSuspense } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';
import { Button } from '@extension/ui';
import { useState } from 'react';

const client_id = 'YOUR_CLIENT_ID.apps.googleusercontent.com';

const Options = () => {
  const theme = useStorageSuspense(exampleThemeStorage);
  const isLight = theme === 'light';
  const logo = isLight ? 'options/Logo Dark.svg' : 'options/Logo Dark.svg';

  // testing
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSave = () => {
    chrome.storage.local.set({ exampleKey: inputValue }, () => {
      console.log('Value saved to storage:', inputValue);
    });
  };

  return (
    <div className={`App-container ${isLight ? 'text-gray-900 bg-slate-50' : 'text-gray-100 bg-gray-800'}`}>
      <img src={chrome.runtime.getURL(logo)} className="App-logo" alt="logo" />

      <h2 className="font-bold text-xl mb-4">Welcome to Calendarize!</h2>

      <div className="p-6">
        <button className="font-bold mt-4 py-2 px-6 rounded shadow hover:scale-105 transition-all bg-blue-500 text-white">
          Connect to Google Calendar
        </button>
      </div>
      <p>
        Edit <code>pages/options/src/Options.tsx</code>
      </p>
      <Button className="mt-4" onClick={exampleThemeStorage.toggle} theme={theme}>
        Toggle theme
      </Button>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Options, <div> Loading ... </div>), <div> Error Occur </div>);
