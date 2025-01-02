import fs from 'node:fs';
import deepmerge from 'deepmerge';

const packageJson = JSON.parse(fs.readFileSync('../package.json', 'utf8'));

const isFirefox = process.env.__FIREFOX__ === 'true';

const sidePanelConfig = {
  side_panel: {
    default_path: 'side-panel/index.html',
  },
  permissions: ['sidePanel'],
};

/**
 * After changing, please reload the extension at `chrome://extensions`
 * @type {chrome.runtime.ManifestV3}
 */
const manifest = deepmerge(
  {
    manifest_version: 3,
    default_locale: 'en',
    /**
     * if you want to support multiple languages, you can use the following reference
     * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Internationalization
     */
    name: 'Calendarize',
    version: packageJson.version,
    description:
      'Calendarize is a simple extension to add events to your Google Calendar using context from the web page you are currently browsing.',
    host_permissions: ['https://www.googleapis.com/*', 'https://api.openai.com/*'],
    permissions: ['identity', 'storage', 'scripting', 'activeTab', 'contextMenus'],
    oauth2: {
      client_id: '477909400950-cvrm725dgmbefef91m68a0a6ar8pa75r.apps.googleusercontent.com',
      scopes: ['https://www.googleapis.com/auth/calendar'],
    },
    key: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtbomW8vFLhDsTfNo3Wl+r6jsh7QIV1FYcbGiv4EN5qpH1KwYYaRROEnn2tZ11p0I/xtdAEtYrHwwbh9+x4+BeTR++UqHiMCKjkfNXJln1938zfKh+LZaupM0IM1tEA7s05jY+IPJ7yhMjLWeA/dkPLaIdSdMsi/pnLo1gOQ0Z7k75ajj9424q7BDKMs2dYTU4S6BDbxbRdL/VH67Zym4LUuV6fscRge7LCBFZbmfHZbhzEFdgxLwgeqNJ62W+yMHkfZrEetfiyIubg/0xYqovajXoGN9KCJ0d4Qy7V8l9wfiE87ktlve9R10OrrQz3srpvbTStn/aDw1FIDk+DFtaQIDAQAB',
    options_page: 'options/index.html',
    background: {
      service_worker: 'background.iife.js',
      type: 'module',
    },
    action: {
      default_popup: 'popup/index.html',
      default_icon: 'icon-34.png',
    },
    icons: {
      128: 'icon-128.png',
    },
    content_scripts: [
      {
        matches: ['http://*/*', 'https://*/*', '<all_urls>'],
        js: ['content/index.iife.js'],
      },
      {
        matches: ['http://*/*', 'https://*/*', '<all_urls>'],
        js: ['content-ui/index.iife.js'],
      },
      {
        matches: ['http://*/*', 'https://*/*', '<all_urls>'],
        css: ['content.css'],
      },
    ],
    devtools_page: 'devtools/index.html',
    web_accessible_resources: [
      {
        resources: ['*.js', '*.css', '*.svg', 'icon-128.png', 'icon-34.png'],
        matches: ['*://*/*'],
      },
    ],
  },
  !isFirefox && sidePanelConfig,
);

export default manifest;
