# PlentyONE Language Switcher Chrome Extension

This Chrome extension allows you to quickly switch the language of your PlentyONE system between German (`de_DE`) and English (`en_EN`) by managing a specific cookie. Once the language is switched, the current page automatically reloads to apply the changes.

## Features

* **One-Click Language Toggle:** Easily switch between `de_DE` and `en_EN` for your PlentyONE systems.

* **Automatic Page Reload:** The current tab reloads immediately after the language is changed.

* **Domain Filtering:** The extension only works on the PlentyONE domains (and their subdomains) that it's pre-configured for, preventing it from affecting other websites.

* **User Feedback:** Provides helpful status messages directly in the extension's popup.

## Installation Guide

Follow these simple steps to install the "PlentyONE Language Switcher" extension in your Google Chrome browser:

### Step 1: Download and Extract the Extension

1.  **Download the ZIP file:** Obtain the extension's ZIP file (e.g., `PlentyOneLangSwitcher.zip`) from the releases [here](https://github.com/mbirnbach/PlentyONE-Language-Changer/releases).

2.  **Extract the contents:** Unzip the downloaded file into a new, empty folder on your computer. You can name this folder anything you like, for example, `PlentyOneLangSwitcher`.

    * After extraction, this folder should contain `manifest.json`, `popup.html`, `popup.js`, and an `icons/` folder.

### Step 2: Load the Extension in Chrome

1.  **Open Chrome Extensions:** Open your Chrome browser, type `chrome://extensions` into the address bar, and press Enter.

2.  **Enable Developer Mode:** In the top-right corner of the Extensions page, toggle on **"Developer mode"**.

3.  **Load Unpacked:** Click the **"Load unpacked"** button that appears.

4.  **Select Folder:** A file browser window will open. Navigate to and select the `PlentyOneLangSwitcher` folder (the one containing the `manifest.json` file). Click "Select Folder".

### Step 3: Refresh the Extension (If Needed)

* If you ever receive an updated version of the extension's files and replace them in your folder, you **must** reload the extension for those changes to take effect.

* Go back to `chrome://extensions`, find your "PlentyONE Language Switcher" extension, and click the **reload** button (a circular arrow icon) on its card.

### Step 4: Pin the Extension (Optional)

For quick access, you can pin the extension's icon to your Chrome toolbar:

1.  Click the puzzle piece icon (Extensions icon) in your Chrome browser's toolbar (usually to the right of the address bar).

2.  In the dropdown list, find "PlentyONE Language Switcher".

3.  Click the **pin icon** next to it. The extension's icon will now appear directly in your toolbar.

## Usage

1.  Navigate to a PlentyONE system page that the extension is configured to work with.

2.  Click the "PlentyONE Language Switcher" icon in your Chrome toolbar.

3.  Click the **"Toggle Language"** button in the popup window.

4.  The extension will update the `plentymarkets_lang_` cookie and then automatically reload the current page. The language of your PlentyONE system should switch accordingly.

## Important Notes

* **Cookie Path:** The extension smartly identifies and uses the existing path of your `plentymarkets_lang_` cookie. If the cookie isn't present, it defaults to using the root path (`/`) to ensure the cookie is set correctly.

* **Permissions:** The extension requires permission to manage cookies. This is necessary to function across various PlentyONE system domains. Always be aware of the permissions you grant to any Chrome extension.

* **Error Handling:** The extension provides messages within its popup if an operation fails or if you are on a domain that hasn't been configured in the extension.

If you encounter any issues or have suggestions, please refer to the project's source on GitHub for further assistance!