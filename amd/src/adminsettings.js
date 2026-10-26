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
 * Save status for the admin settings form (core_admin/settings override).
 *
 * Shows "All changes saved" until a setting is changed, then "Unsaved changes".
 * Cancel resets the form to the values it was loaded with.
 *
 * @module     theme_retani_studio/adminsettings
 * @copyright  2026 Okeowo Aderemi
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {getString} from 'core/str';
import {resetFormDirtyState} from 'core_form/changechecker';

const SELECTORS = {
    STATUS: '[data-region="retani-settings-status"]',
    STATUS_TEXT: '[data-region="retani-settings-status-text"]',
};

/**
 * Set the status line.
 *
 * @param {HTMLElement} form
 * @param {Boolean} dirty
 */
const setStatus = async(form, dirty) => {
    const status = form.querySelector(SELECTORS.STATUS);
    if (!status) {
        return;
    }
    const state = dirty ? 'unsaved' : 'saved';
    if (status.dataset.state === state) {
        return;
    }
    status.dataset.state = state;
    status.querySelector(SELECTORS.STATUS_TEXT).textContent =
        await getString(`adminsettings:${state}`, 'theme_retani_studio');
};

/**
 * Start watching the form.
 *
 * @param {String} formId
 */
export const init = formId => {
    const form = document.getElementById(formId);
    if (!form || form.dataset.retaniSettingsInit) {
        return;
    }
    form.dataset.retaniSettingsInit = 'true';

    const markDirty = () => setStatus(form, true);
    form.addEventListener('input', markDirty);
    form.addEventListener('change', markDirty);

    form.addEventListener('reset', () => {
        // The browser restores the values after the reset event, so wait a tick before clearing the state.
        setTimeout(() => {
            resetFormDirtyState(form);
            setStatus(form, false);
        });
    });
};
