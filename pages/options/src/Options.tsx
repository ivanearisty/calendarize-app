import '@src/Options.css';
import { useStorageSuspense, withErrorBoundary, withSuspense } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';
import { Button, cn } from '@extension/ui';
import { useEffect, useState } from 'react';

const Options = () => {
  const theme = useStorageSuspense(exampleThemeStorage);
  const isLight = theme === 'light';
  const logo = isLight ? 'options/Logo Dark.svg' : 'options/Logo Dark.svg';
  const [inputValue, setInputValue] = useState('');
  const [loggedInGoogle, setLoggedInGoogle] = useState(false);
  const [loggedInOpenAI, setloggedInOpenAI] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const isLoggedInOpenAi = async () => {};

  const logInOpenAI = async (token: string) => {};

  const isLoggedInGoogle = async () => {
    try {
      const result = await chrome.identity.getAuthToken({ interactive: false });
      if (result) {
        console.log('User is Logged In');
        console.log('Token:', result.token);
        console.log('Granted Scopes:', result.grantedScopes);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error fetching token:', error);
      return false;
    }
  };

  const logOutGoogle = async () => {
    try {
      setLoggedInGoogle(false);
      console.log('Successfully logged out.');
      chrome.identity.getAuthToken({ interactive: false }, async token => {
        if (token) {
          try {
            await fetch(`https://oauth2.googleapis.com/revoke?token=${token}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
            });
            console.log('Token revoked successfully.');
          } catch (error) {
            console.error('Error revoking token:', error);
          }
          chrome.identity.removeCachedAuthToken({ token });
        }
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const getAuthToken = () => {
    if (chrome.identity && chrome.identity.getAuthToken) {
      chrome.identity.getAuthToken({ interactive: true }, token => {
        if (chrome.runtime.lastError) {
          console.error('Error fetching auth token:', chrome.runtime.lastError.message);
          return;
        }

        if (token) {
          console.log('Auth Token:', token);
          setLoggedInGoogle(true);
        }
      });
    } else {
      console.log(chrome.runtime.lastError);
      console.error('chrome.identity.getAuthToken is not available');
    }
  };

  const handleSave = () => {
    chrome.storage.local.set({ exampleKey: inputValue }, () => {
      console.log('Value saved to storage:', inputValue);
    });
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      const googleLogin = await isLoggedInGoogle();
      setLoggedInGoogle(googleLogin);
      const openAiLogin = await isLoggedInOpenAi();
      // setloggedInOpenAI(openAiLogin);
    };

    checkLoginStatus();
  }, []);

  return (
    <div className={`App-container ${isLight ? 'text-gray-900 bg-slate-50' : 'text-gray-100 bg-gray-800'}`}>
      <img src={chrome.runtime.getURL(logo)} className="App-logo" alt="logo" />

      <h2 className="font-bold text-xl mb-4 pt-10">Welcome to Calendarize!</h2>

      <div className="p-6 grid grid-rows-2 grid-cols-2 gap-y-2 gap-x-8">
        <Button
          className=""
          onClick={() => {
            if (loggedInGoogle) {
              console.log('User already Logged-In');
            } else {
              getAuthToken();
            }
          }}
          theme={theme}>
          {loggedInGoogle ? "You're connected to G-calendar!" : 'Connect to Google Calendar'}
        </Button>

        <Button className="" onClick={() => {}} theme={theme}>
          {loggedInOpenAI ? "You're connected to OpenAI!" : 'Connect to OpenAI'}
        </Button>

        {loggedInGoogle && (
          <Button
            className={cn(theme === 'light' ? 'hover:bg-red-100' : 'hover:bg-red-700')}
            onClick={logOutGoogle} // Call a logout function
            theme={theme}>
            Log out from Google
          </Button>
        )}

        {loggedInOpenAI ? (
          <Button
            className={cn(theme === 'light' ? 'hover:bg-red-100' : 'hover:bg-red-700')}
            // onClick={logOutOpenai}
            theme={theme}>
            Log out from OpenAI
          </Button>
        ) : (
          <textarea
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            className={cn(
              'mt-4 py-1 px-2 min-h-10 font-bold rounded shadow transition-all focus:outline-dotted focus:outline-slate-500 text-[10px] text-left align-text-top resize-y',
              theme === 'light' ? 'bg-white text-black' : 'bg-black text-white',
            )}
            placeholder="Enter OpenAI Auth Token"
            rows={4}
          />
        )}
      </div>
      <div>
        <Button className="mt-4" onClick={exampleThemeStorage.toggle} theme={theme}>
          Toggle theme
        </Button>
      </div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Options, <div> Loading ... </div>), <div> Error Occur </div>);
