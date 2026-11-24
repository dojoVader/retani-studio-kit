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
 * Switches the class on the html tag at once, and saves the choice as a user preference so that the server draws the
 * next administration page the same way. Separate from the colour modes (theme_retani_studio/colourmode).
 *
 * @module     theme_retani_studio/admindarkmode
 * @copyright  2026 Okeowo Aderemi
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import Ajax from 'core/ajax';
import Notification from 'core/notification';

/**
 * Save a user preference of the current user through the core_user_set_user_preferences web service.
 *
 * Not core_user/repository: in this Moodle version it posts to the REST router (r.php/api), which is not reachable on
 * every server, and fails without the page knowing.
 *
 * @param {String} name
 * @param {String|Number} value
 * @return {Promise}
 */
const savePreference = (name, value) => Ajax.call([{
    methodname: 'core_user_set_user_preferences',
    args: {preferences: [{name, value: String(value), userid: 0}]},
}])[0];

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
            document.documentElement.classList.toggle(toggle.dataset.cssclass, dark);
            showState(toggle, dark);
            savePreference(toggle.dataset.preference, dark ? 1 : 0).catch(Notification.exception);
        });
    });
};
