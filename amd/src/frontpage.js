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
 * Behaviour of the front page (theme_retani_studio/frontpage): the header menus, the navigation toggle on small
 * screens, the course category filters and the testimonial arrows; and the filters of the course listing
 * (theme_retani_studio/course_listing), which shares the header.
 *
 * The menus also open on hover and keyboard focus through CSS; the buttons here make them work on touch screens and
 * keep aria-expanded in step.
 *
 * @module     theme_retani_studio/frontpage
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
    modeToggle: '[data-action="rfp-modetoggle"]',
    root: '[data-region="retani-frontpage"]',
    menu: '[data-region="rfp-menu"]',
    menuButton: '[data-action="rfp-menu"]',
    navToggle: '[data-action="rfp-navtoggle"]',
    filter: '[data-action="rfp-filter"]',
    courses: '[data-region="rfp-courses"]',
    course: '.rfp-course',
    testimonials: '[data-region="rfp-testimonials"]',
    track: '[data-region="rfp-track"]',
    prev: '[data-action="rfp-prev"]',
    filterForm: '[data-region="rcl-filters"]',
    autosubmit: '[data-autosubmit]',
    apply: '[data-region="rcl-apply"]',
    next: '[data-action="rfp-next"]',
};

/**
 * Close every open header menu, except the given one.
 *
 * @param {HTMLElement} root
 * @param {HTMLElement|null} except
 */
const closeMenus = (root, except = null) => {
    root.querySelectorAll(SELECTORS.menu).forEach((menu) => {
        if (menu !== except) {
            menu.classList.remove('open');
            menu.querySelector(SELECTORS.menuButton)?.setAttribute('aria-expanded', 'false');
        }
    });
};

/**
 * Set up the header menus and the navigation toggle.
 *
 * @param {HTMLElement} root
 */
const initHeader = (root) => {
    root.querySelectorAll(SELECTORS.menuButton).forEach((button) => {
        button.addEventListener('click', () => {
            const menu = button.closest(SELECTORS.menu);
            const open = !menu.classList.contains('open');
            closeMenus(root, menu);
            menu.classList.toggle('open', open);
            button.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest(SELECTORS.menu)) {
            closeMenus(root);
        }
    });
    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') {
            return;
        }
        const open = root.querySelector(`${SELECTORS.menu}.open`);
        if (open) {
            closeMenus(root);
            open.querySelector(SELECTORS.menuButton)?.focus();
        }
    });

    const toggle = root.querySelector(SELECTORS.navToggle);
    if (toggle) {
        toggle.addEventListener('click', () => {
            const nav = document.getElementById(toggle.getAttribute('aria-controls'));
            const open = toggle.getAttribute('aria-expanded') !== 'true';
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            nav?.classList.toggle('open', open);
        });
    }
};

/**
 * Set up the course category filters.
 *
 * @param {HTMLElement} root
 */
const initFilters = (root) => {
    const section = root.querySelector(SELECTORS.courses);
    if (!section) {
        return;
    }
    const filters = section.querySelectorAll(SELECTORS.filter);
    filters.forEach((filter) => {
        filter.addEventListener('click', () => {
            const category = filter.dataset.category;
            filters.forEach((other) => {
                other.classList.toggle('active', other === filter);
                other.setAttribute('aria-pressed', other === filter ? 'true' : 'false');
            });
            section.querySelectorAll(SELECTORS.course).forEach((course) => {
                course.hidden = category !== '' && course.dataset.category !== category;
            });
        });
    });
};

/**
 * Set up the testimonial arrows, which scroll the list by one testimonial.
 *
 * @param {HTMLElement} root
 */
const initTestimonials = (root) => {
    root.querySelectorAll(SELECTORS.testimonials).forEach((section) => {
        const track = section.querySelector(SELECTORS.track);
        if (!track) {
            return;
        }
        const step = (direction) => {
            const item = track.firstElementChild;
            const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
            const width = item ? item.getBoundingClientRect().width + gap : track.clientWidth;
            // Scrolling goes to the left in right-to-left languages.
            const sign = getComputedStyle(track).direction === 'rtl' ? -1 : 1;
            track.scrollBy({left: sign * direction * width, behavior: 'smooth'});
        };
        section.querySelector(SELECTORS.prev)?.addEventListener('click', () => step(-1));
        section.querySelector(SELECTORS.next)?.addEventListener('click', () => step(1));
    });
};

/**
 * Set up the course listing filters: a change submits the form, so the apply button is not needed.
 *
 * The sort menu belongs to the form through its form attribute, so it is found through form.elements.
 *
 * @param {HTMLElement} root
 */
const initListingFilters = (root) => {
    const form = root.querySelector(SELECTORS.filterForm);
    if (!form) {
        return;
    }
    const apply = form.querySelector(SELECTORS.apply);
    if (apply) {
        apply.classList.add('visually-hidden');
        // Without a "clear filters" link beside it, the row would be empty.
        if (apply.parentElement.children.length === 1) {
            apply.parentElement.hidden = true;
        }
    }
    Array.from(form.elements).forEach((element) => {
        if (element.matches(SELECTORS.autosubmit)) {
            element.addEventListener('change', () => form.requestSubmit());
        }
    });
};

/**
 * Set up the light and dark mode toggle of the header.
 *
 * The page changes at once. The choice is kept in the colour mode cookie, which the server reads for visitors, and as
 * the colour mode user preference for people who are logged in, as the navbar's colour mode menu does.
 *
 * @param {HTMLElement} root
 */
const initModeToggle = (root) => {
    const html = document.documentElement;
    root.querySelectorAll(SELECTORS.modeToggle).forEach((toggle) => {
        // The server cannot resolve "auto", so take the state from the page.
        toggle.setAttribute('aria-pressed', html.getAttribute('data-bs-theme') === 'dark' ? 'true' : 'false');
        toggle.addEventListener('click', () => {
            const mode = html.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-bs-theme', mode);
            html.setAttribute('data-colourmode', mode);
            root.querySelectorAll(SELECTORS.modeToggle).forEach((other) => {
                other.setAttribute('aria-pressed', mode === 'dark' ? 'true' : 'false');
            });
            document.cookie = `${toggle.dataset.preference}=${mode}${toggle.dataset.cookieattributes}`;
            if (toggle.dataset.canstore) {
                savePreference(toggle.dataset.preference, mode).catch(Notification.exception);
            }
        });
    });
};

/**
 * Initialise the front page.
 */
export const init = () => {
    const root = document.querySelector(SELECTORS.root);
    if (!root || root.dataset.rfpInitialised) {
        return;
    }
    root.dataset.rfpInitialised = '1';
    initHeader(root);
    initFilters(root);
    initTestimonials(root);
    initListingFilters(root);
    initModeToggle(root);
};
