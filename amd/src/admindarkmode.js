// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * The toggle between light and dark Site administration pages (theme_retani_studio/admin_dark_toggle).
 *
 * Switches the class and the colour mode on the html tag at once, and saves the choice in the administration pages'
 * own user preference, so that the server draws the next administration page the same way. The colour mode preference
 * of the rest of the site (theme_retani_studio/colourmode, the front page toggle) is not changed.
 *
 * @module     theme_retani_studio/admindarkmode
 * @copyright  2026 Okeowo Aderemi
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {setUserPreference} from 'theme_retani_studio/preference';
import Notification from 'core/notification';


const SELECTORS = {
    toggle: '[data-action="toggle-admindark"]',
    iconDark: '[data-region="admindark-icon-dark"]',
    iconLight: '[data-region="admindark-icon-light"]',
};

/**
 * Show a toggle as on or off.
 *
 * @param {HTMLElement} toggle
 * @param {boolean} dark
 */
const showState = (toggle, dark) => {
    toggle.setAttribute('aria-pressed', dark ? 'true' : 'false');
    toggle.querySelector(SELECTORS.iconDark).hidden = !dark;
    toggle.querySelector(SELECTORS.iconLight).hidden = dark;
};

/**
 * Initialise the toggle. Safe to call more than once.
 */
export const init = () => {
    document.querySelectorAll(SELECTORS.toggle).forEach((toggle) => {
        if (toggle.dataset.initialised) {
            return;
        }
        toggle.dataset.initialised = '1';
        toggle.addEventListener('click', () => {
            const dark = toggle.getAttribute('aria-pressed') !== 'true';
            const root = document.documentElement;
            const mode = dark ? 'dark' : 'light';
            root.classList.toggle(toggle.dataset.cssclass, dark);
            root.setAttribute('data-bs-theme', mode);
            root.setAttribute('data-colourmode', mode);
            showState(toggle, dark);
            setUserPreference(toggle.dataset.preference, dark ? 1 : 0).catch(Notification.exception);
        });
    });
};
