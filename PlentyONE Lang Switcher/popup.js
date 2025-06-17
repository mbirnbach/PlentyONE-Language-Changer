const COOKIE_NAME = "plentymarkets_lang_";
const LANG_DE = "de_DE";
const LANG_EN = "en_EN";

const ALLOWED_DOMAINS = [
    "my.plentysystems.com",
    "plentymarkets-cloud-hq.com",
    "plentymarkets-cloud-de.com",
    "plentymarkets-cloud-ie.com"
];

const toggleLangBtn = document.getElementById("toggleLangBtn");
const statusMessage = document.getElementById("status-message");
const messageBox = document.getElementById("message-box");

/**
 * Displays a message in the message box.
 * @param {string} message - The message to display.
 * @param {string} type - The type of message (e.g., 'error', 'info').
 */
function displayMessage(message, type = 'info') {
    messageBox.textContent = message;
    messageBox.classList.remove('hidden', 'bg-red-100', 'text-red-700', 'border-red-400', 'bg-green-100', 'text-green-700', 'border-green-400');
    if (type === 'error') {
        messageBox.classList.add('bg-red-100', 'text-red-700', 'border-red-400');
    } else { // default to info/success
        messageBox.classList.add('bg-green-100', 'text-green-700', 'border-green-400');
    }
    messageBox.classList.remove('hidden');
}

/**
 * Clears any displayed message.
 */
function clearMessage() {
    messageBox.classList.add('hidden');
    messageBox.textContent = '';
}

/**
 * Updates the status message in the popup.
 * @param {string} message - The message to display as status.
 */
function updateStatus(message) {
    statusMessage.textContent = message;
}

/**
 * Gets the cookie object for a specific name and URL.
 * @param {string} url - The URL to get the cookie from.
 * @param {string} name - The name of the cookie.
 * @returns {Promise<chrome.cookies.Cookie|null>} - The cookie object or null if not found.
 */
async function getCookie(url, name) {
    try {
        const cookie = await chrome.cookies.get({ url: url, name: name });
        return cookie || null;
    } catch (error) {
        console.error(`Error getting cookie '${name}':`, error);
        displayMessage(`Error getting cookie: ${error.message}`, 'error');
        return null;
    }
}

/**
 * Sets a cookie with a specified value and path.
 * @param {string} url - The URL to set the cookie for (used for scope).
 * @param {string} name - The name of the cookie.
 * @param {string} value - The value to set the cookie to.
 * @param {string} domain - The domain for the cookie.
 * @param {string} path - The path for the cookie.
 * @returns {Promise<void>}
 */
async function setCookie(url, name, value, domain, path) {
    try {
        await chrome.cookies.set({
            url: url,
            name: name,
            value: value,
            domain: domain,
            path: path, // Use the provided path
            expirationDate: (Date.now() / 1000) + (60 * 60 * 24 * 365) // 1 year from now
        });
        console.log(`Cookie '${name}' set to '${value}' with path '${path}' for domain '${domain}'`);
    } catch (error) {
        console.error(`Error setting cookie '${name}':`, error);
        displayMessage(`Error setting cookie: ${error.message}`, 'error');
        throw error; // Re-throw to indicate failure
    }
}

/**
 * Main function to toggle the language cookie and reload the page.
 */
async function toggleLanguage() {
    clearMessage();
    toggleLangBtn.disabled = true; // Disable button during operation
    updateStatus("Detecting current language...");

    try {
        // Get the current active tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab || !tab.url) {
            displayMessage("Could not get current tab URL.", 'error');
            return;
        }

        const url = new URL(tab.url);
        const currentDomain = url.hostname;

        // Check if the current domain is allowed or a subdomain of an allowed domain
        let isDomainAllowed = false;
        for (const allowedDomain of ALLOWED_DOMAINS) {
            // Check for exact match OR if it's a subdomain (e.g., "sub.domain.com" for "domain.com")
            if (currentDomain === allowedDomain || currentDomain.endsWith(`.${allowedDomain}`)) {
                isDomainAllowed = true;
                break;
            }
        }

        if (!isDomainAllowed) {
             displayMessage(`This domain (${currentDomain}) is not an allowed PlentyONE base domain or a subdomain of one. Please add the base domain to popup.js.`, 'error');
             updateStatus("Domain not allowed.");
             return;
        }

        // Get the current cookie object
        const currentCookie = await getCookie(tab.url, COOKIE_NAME);
        const currentLang = currentCookie ? currentCookie.value : null;
        const currentPath = currentCookie ? currentCookie.path : '/'; // Default to root path if no cookie found

        console.log(`Current '${COOKIE_NAME}' value: ${currentLang}, Path: ${currentPath}`);

        let newLang;
        if (currentLang === LANG_DE) {
            newLang = LANG_EN;
        } else {
            // Default to DE if not EN, or if cookie not found
            newLang = LANG_DE;
        }

        updateStatus(`Switching language to ${newLang}...`);
        await setCookie(tab.url, COOKIE_NAME, newLang, currentDomain, currentPath); // Pass the currentPath

        displayMessage(`Language switched to ${newLang}! Reloading page...`, 'info');
        updateStatus(`Language changed to ${newLang}.`);

        // Reload the current tab after cookie is set
        await chrome.tabs.reload(tab.id);

        // Close the popup after a short delay to allow the user to see the message
        setTimeout(() => window.close(), 1000);

    } catch (error) {
        console.error("Failed to toggle language:", error);
        displayMessage(`Operation failed: ${error.message}`, 'error');
        updateStatus("Operation failed.");
    } finally {
        toggleLangBtn.disabled = false; // Re-enable button
    }
}

// Attach event listener to the button
toggleLangBtn.addEventListener("click", toggleLanguage);

// Initial status check (optional, but good for user feedback)
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab && tab.url) {
            const url = new URL(tab.url);
            const currentDomain = url.hostname;

            let isDomainAllowedOnLoad = false;
            for (const allowedDomain of ALLOWED_DOMAINS) {
                if (currentDomain === allowedDomain || currentDomain.endsWith(`.${allowedDomain}`)) {
                    isDomainAllowedOnLoad = true;
                    break;
                }
            }

            if (isDomainAllowedOnLoad) {
                const currentCookie = await getCookie(tab.url, COOKIE_NAME);
                const currentLang = currentCookie ? currentCookie.value : null;
                if (currentLang) {
                    updateStatus(`Current language: ${currentLang}`);
                } else {
                    updateStatus("No language cookie found. Will set to de_DE.");
                }
            } else {
                updateStatus(`Not a PlentyONE domain.`);
                toggleLangBtn.disabled = true; // Disable button if not on an allowed domain
            }
        } else {
            updateStatus("Cannot access tab information.");
            toggleLangBtn.disabled = true;
        }
    } catch (error) {
        console.error("Error during initial DOM load:", error);
        updateStatus("Error loading status.");
        toggleLangBtn.disabled = true;
    }
});
