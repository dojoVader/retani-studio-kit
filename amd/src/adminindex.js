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
 * Site administration index (core/settings_link_page override).
 *
 * Keeps the page h1 and description in step with the selected tab: the secondary navigation switches
 * the tab panes client-side, and each pane carries its own title and description.
 *
 * @module     theme_retani_studio/adminindex
 * @copyright  2026 Okeowo Aderemi
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

const SELECTORS = {
    INDEX: '[data-region="retani-adminindex"]',
    ACTIVE_PANE: ':scope > .tab-pane.active',
    TITLE: '[data-region="retani-adminheader-title"]',
    DESCRIPTION: '[data-region="retani-adminheader-description"]',
};

/**
 * Show the title and description of a pane in the page header.
 *
 * @param {HTMLElement|null} pane
 */
const showPaneHeading = pane => {
    if (!pane || !pane.dataset.title) {
        return;
    }
    const title = document.querySelector(SELECTORS.TITLE);
    if (title) {
        title.textContent = pane.dataset.title;
    }
    const description = document.querySelector(SELECTORS.DESCRIPTION);
    if (description) {
        description.textContent = pane.dataset.description || '';
        description.hidden = !pane.dataset.description;
    }
};

let initialised = false;

/**
 * Start following the selected tab.
 */
export const init = () => {
    const index = document.querySelector(SELECTORS.INDEX);
    if (!index || initialised) {
        return;
    }
    initialised = true;

    document.addEventListener('shown.bs.tab', event => {
        const href = event.target?.getAttribute?.('href') || '';
        const hash = href.slice(href.indexOf('#') + 1);
        if (!hash) {
            return;
        }
        const pane = document.getElementById(hash);
        if (pane && index.contains(pane)) {
            showPaneHeading(pane);
        }
    });

    // A tab picked from the URL hash may already be showing.
    showPaneHeading(index.querySelector(SELECTORS.ACTIVE_PANE));
};
