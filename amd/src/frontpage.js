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
 * The interactive parts of the site home landing page: the small screen menu, the course category tabs, the
 * monthly/yearly pricing switch and the testimonials.
 *
 * @module     theme_retani_studio/frontpage
 * @copyright  2026 Retani
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * Open and close the menu shown on small screens.
 *
 * @param {HTMLElement} root
 */
const initMenu = (root) => {
    const toggle = root.querySelector('[data-action="fp-menu"]');
    if (!toggle) {
        return;
    }
    const setOpen = (open) => {
        root.classList.toggle('fp-menu-open', open);
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    toggle.addEventListener('click', () => setOpen(!root.classList.contains('fp-menu-open')));
    root.querySelectorAll('.fp-mobilenav a').forEach((link) => link.addEventListener('click', () => setOpen(false)));
};

/**
 * Filter the course cards by category.
 *
 * @param {HTMLElement} root
 */
const initCourseTabs = (root) => {
    const tabs = root.querySelectorAll('[data-fp-category]');
    const cards = root.querySelectorAll('[data-fp-course]');
    tabs.forEach((tab) => tab.addEventListener('click', () => {
        const category = tab.dataset.fpCategory;
        tabs.forEach((other) => other.setAttribute('aria-selected', other === tab ? 'true' : 'false'));
        cards.forEach((card) => {
            card.hidden = category !== '0' && card.dataset.fpCourse !== category;
        });
    }));
};

/**
 * Switch the plan prices between monthly and yearly.
 *
 * @param {HTMLElement} root
 */
const initPricing = (root) => {
    const region = root.querySelector('[data-region="fp-pricing"]');
    if (!region) {
        return;
    }
    const buttons = region.querySelectorAll('[data-fp-period]');
    buttons.forEach((button) => button.addEventListener('click', () => {
        region.classList.toggle('fp-show-yearly', button.dataset.fpPeriod === 'yearly');
        buttons.forEach((other) => other.setAttribute('aria-pressed', other === button ? 'true' : 'false'));
    }));
};

/**
 * Show one testimonial at a time, picked with the avatar buttons.
 *
 * @param {HTMLElement} root
 */
const initTestimonials = (root) => {
    const region = root.querySelector('[data-region="fp-testimonials"]');
    if (!region) {
        return;
    }
    const buttons = region.querySelectorAll('[data-fp-testimonial]');
    const panels = region.querySelectorAll('[data-fp-testimonial-panel]');
    buttons.forEach((button) => button.addEventListener('click', () => {
        const index = button.dataset.fpTestimonial;
        panels.forEach((panel) => {
            panel.hidden = panel.dataset.fpTestimonialPanel !== index;
        });
        buttons.forEach((other) => other.setAttribute('aria-pressed', other === button ? 'true' : 'false'));
    }));
};

/**
 * Set up the landing page.
 *
 * @param {string} rootId The id of the page's root element.
 */
export const init = (rootId) => {
    const root = document.getElementById(rootId);
    if (!root) {
        return;
    }
    initMenu(root);
    initCourseTabs(root);
    initPricing(root);
    initTestimonials(root);
};
