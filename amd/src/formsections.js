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
 * Field counts in the form section headers (core_form/element-header override).
 *
 * Shows "N fields" on the right of each section header, counting the visible rows of the section.
 * The count follows fields that other fields show or hide (hideIf / disabledIf).
 *
 * @module     theme_retani_studio/formsections
 * @copyright  2026 Okeowo Aderemi
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {getString} from 'core/str';

const SELECTORS = {
    COUNT: '[data-region="retani-formsection-count"]',
    ROW: '.fitem',
};

const watched = new WeakSet();

/**
 * Whether a row is shown.
 *
 * @param {HTMLElement} row
 * @returns {Boolean}
 */
const isShown = row => !row.hidden && !row.classList.contains('d-none') && row.style.display !== 'none';

/**
 * Update the count of one section.
 *
 * @param {HTMLElement} fieldset
 * @param {HTMLElement} countNode
 */
const updateCount = async(fieldset, countNode) => {
    // Rows of this section only: their nearest enclosing row is the section's fieldset itself.
    const rows = [...fieldset.querySelectorAll(SELECTORS.ROW)]
        .filter(row => row.parentElement.closest(SELECTORS.ROW) === fieldset)
        .filter(isShown);
    const count = rows.length;
    const text = count === 1
        ? await getString('formsection:countone', 'theme_retani_studio')
        : await getString('formsection:count', 'theme_retani_studio', count);
    countNode.textContent = count ? text : '';
};

/**
 * Fill in the counts of every section header on the page.
 */
export const init = () => {
    document.querySelectorAll(SELECTORS.COUNT).forEach(countNode => {
        const fieldset = countNode.closest('fieldset');
        if (!fieldset || watched.has(fieldset)) {
            return;
        }
        watched.add(fieldset);
        updateCount(fieldset, countNode);

        let timer = null;
        new MutationObserver(() => {
            clearTimeout(timer);
            timer = setTimeout(() => updateCount(fieldset, countNode), 100);
        }).observe(fieldset, {subtree: true, attributes: true, attributeFilter: ['class', 'hidden', 'style']});
    });
};
