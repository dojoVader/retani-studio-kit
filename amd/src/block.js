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
 * JavaScript  Source for managing Block for Retani Studio
 *
 *
 * @module     theme_retani_studio/block
 * @copyright  2026 Okeowo Adere,o
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * Wrap icon shapes in a 24x24 outline SVG that takes its colour from the surrounding text.
 *
 * @param {String} shapes SVG child elements.
 * @returns {String} SVG markup.
 */
const svg = (shapes) => '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
    ' stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"' +
    ' aria-hidden="true" focusable="false">' + shapes + '</svg>';

/** Icons keyed by block name, without the "block_" prefix. */
const ICONS = {
    accessreview: svg('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="7.5" r="1"/>' +
        '<path d="M8 10h8M12 10v4l-2 3.5M12 14l2 3.5"/>'),
    // eslint-disable-next-line camelcase
    activity_results: svg('<path d="M4 20h16"/><rect x="5" y="11" width="3" height="7"/>' +
        '<rect x="10.5" y="6" width="3" height="12"/><rect x="16" y="9" width="3" height="9"/>'),
    // eslint-disable-next-line camelcase
    admin_bookmarks: svg('<path d="M6 4h12v16l-6-4-6 4z"/>'),
    badges: svg('<circle cx="12" cy="9" r="5"/><path d="M9 13.5 7.5 21 12 18.5 16.5 21 15 13.5"/>'),
    // eslint-disable-next-line camelcase
    blog_menu: svg('<path d="M4 6h16M4 12h10M4 18h7"/>' +
        '<path d="M14.5 20.5l.7-2.8 4.6-4.6a1.4 1.4 0 0 1 2 2l-4.6 4.6z"/>'),
    // eslint-disable-next-line camelcase
    blog_recent: svg('<rect x="4" y="3" width="13" height="18" rx="2"/><path d="M8 7h5M8 11h5M8 15h2"/>' +
        '<path d="M20.5 6v11l-1 2-1-2V6z"/>'),
    // eslint-disable-next-line camelcase
    blog_tags: svg('<path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9z"/><circle cx="7.5" cy="7.5" r="1.5"/>'),
    // eslint-disable-next-line camelcase
    calendar_month: svg('<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>' +
        '<path d="M7.5 13.5h1M11.5 13.5h1M15.5 13.5h1M7.5 16.5h1M11.5 16.5h1"/>'),
    // eslint-disable-next-line camelcase
    calendar_upcoming: svg('<path d="M20.5 11V7a2 2 0 0 0-2-2h-13a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2H11"/>' +
        '<path d="M3.5 10h17M8 3v4M16 3v4"/><circle cx="17" cy="17" r="4"/><path d="M17 15.5v1.5l1 1"/>'),
    comments: svg('<path d="M20 14a2 2 0 0 1-2 2H8l-4 4V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z"/><path d="M8 9h8M8 12h5"/>'),
    completionstatus: svg('<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.5 2.5L16 9.5"/>'),
    // eslint-disable-next-line camelcase
    course_list: svg('<path d="M12 7v13"/>' +
        '<path d="M3 5h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5v13h-6a3 3 0 0 0-3 2 3 3 0 0 0-3-2H3z"/>'),
    // eslint-disable-next-line camelcase
    course_summary: svg('<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>'),
    feedback: svg('<path d="M21 12a8.5 8.5 0 0 1-12.4 7.6L3 21l1.4-5.6A8.5 8.5 0 1 1 21 12z"/>' +
        '<path d="M8.5 12h.01M12 12h.01M15.5 12h.01"/>'),
    globalsearch: svg('<circle cx="10.5" cy="10.5" r="6.5"/><path d="M20 20l-4.8-4.8"/>' +
        '<path d="M4 10.5h13M10.5 4c-2 2-2 11 0 13M10.5 4c2 2 2 11 0 13"/>'),
    // eslint-disable-next-line camelcase
    glossary_random: svg('<path d="M5 19.5V5a2 2 0 0 1 2-2h12v15H7a2 2 0 0 0-2 2 2 2 0 0 0 2 2h12"/>' +
        '<path d="M9.5 13l2.5-6 2.5 6M10.4 11h3.2"/>'),
    html: svg('<path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>'),
    login: svg('<path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4"/><path d="M3 12h11M10 8l4 4-4 4"/>'),
    lp: svg('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>'),
    mentees: svg('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/>' +
        '<path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14a6.5 6.5 0 0 1 3.5 6"/>'),
    myoverview: svg('<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/>' +
        '<rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>'),
    myprofile: svg('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="10" r="3"/><path d="M6.5 18.5a6 6 0 0 1 11 0"/>'),
    navigation: svg('<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>'),
    // eslint-disable-next-line camelcase
    news_items: svg('<path d="M4 5h13v15H6a2 2 0 0 1-2-2z"/><path d="M17 9h3v9a2 2 0 0 1-2 2h-1"/>' +
        '<path d="M7.5 9h6M7.5 12.5h6M7.5 16h4"/>'),
    // eslint-disable-next-line camelcase
    online_users: svg('<circle cx="10" cy="8" r="4"/><path d="M3 20a7 7 0 0 1 11-5.7"/><circle cx="18" cy="17" r="2.5"/>'),
    // eslint-disable-next-line camelcase
    private_files: svg('<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>' +
        '<rect x="9.5" y="12.5" width="5" height="4" rx=".75"/><path d="M10.5 12.5v-1a1.5 1.5 0 0 1 3 0v1"/>'),
    // eslint-disable-next-line camelcase
    recent_activity: svg('<path d="M3 12h4l3-7 4 14 3-7h4"/>'),
    recentlyaccessedcourses: svg('<path d="M3.5 12a8.5 8.5 0 1 0 2.5-6L3.5 8.5"/><path d="M3.5 4v4.5H8"/>' +
        '<path d="M12 8v4l3 2"/>'),
    recentlyaccesseditems: svg('<path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h5"/><path d="M14 3l5 5v2M14 3v5h5"/>' +
        '<circle cx="17" cy="17" r="4"/><path d="M17 15.5v1.5l1 1"/>'),
    // eslint-disable-next-line camelcase
    rss_client: svg('<path d="M5 11a8 8 0 0 1 8 8M5 5a14 14 0 0 1 14 14"/><circle cx="6" cy="18" r="1.25"/>'),
    // eslint-disable-next-line camelcase
    search_forums: svg('<circle cx="10.5" cy="10.5" r="6.5"/><path d="M20 20l-4.8-4.8"/><path d="M8 9.5h5M8 12h3"/>'),
    selfcompletion: svg('<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 12.5l2.5 2.5L16 9.5"/>'),
    settings: svg('<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12"/>' +
        '<circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>'),
    // eslint-disable-next-line camelcase
    site_main_menu: svg('<path d="M4 10.5L12 4l8 6.5V19a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z"/>'),
    // eslint-disable-next-line camelcase
    social_activities: svg('<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/>' +
        '<circle cx="18" cy="18" r="2.5"/><path d="M8.2 10.8l7.6-3.6M8.2 13.2l7.6 3.6"/>'),
    starredcourses: svg('<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/>'),
    // eslint-disable-next-line camelcase
    tag_flickr: svg('<rect x="3" y="4.5" width="18" height="15" rx="2"/><circle cx="8.5" cy="9.5" r="1.75"/>' +
        '<path d="M21 16l-5-5-9 8.5"/>'),
    // eslint-disable-next-line camelcase
    tag_youtube: svg('<rect x="2.5" y="5" width="19" height="14" rx="4"/><path d="M10 9v6l5-3z"/>'),
    tags: svg('<path d="M3 11V4a1 1 0 0 1 1-1h7l8 8-7 7z"/><circle cx="7" cy="7" r="1.25"/>' +
        '<path d="M14 3l8 8-7.5 7.5"/>'),
    timeline: svg('<path d="M4 3v18"/><rect x="7" y="5" width="9" height="4" rx="1.5"/>' +
        '<rect x="10" y="10" width="10" height="4" rx="1.5"/><rect x="7" y="15" width="7" height="4" rx="1.5"/>'),
};

const SELECTORS = {
    TITLE: '#page-content [data-block] .block-header .card-title',
};

/**
 * Adds an icon before each block title, chosen by the block type (e.g. "timeline").
 */
export default class Block {
    /** @type {HTMLElement} */
    root;

    /**
     * Create the instance and decorate the block titles straight away.
     *
     * @param {HTMLElement} root Element to search for blocks in.
     * @returns {Block}
     */
    static init(root = document) {
        return new Block(root);
    }

    /**
     * @param {HTMLElement} root Element to search for blocks in.
     */
    constructor(root = document) {
        this.root = root;
        this.addIcons();
    }

    /**
     * Get the icon markup for a block type.
     *
     * @param {String} type Block name without the "block_" prefix.
     * @returns {String} SVG markup, or an empty string.
     */
    getIcon(type) {
        return ICONS[type] ?? '';
    }

    /**
     * Add icons to any block titles that don't have one yet. Safe to call again.
     *
     * @returns {Block}
     */
    addIcons() {
        this.root.querySelectorAll(SELECTORS.TITLE).forEach((title) => {
            const type = title.closest('[data-block]').dataset.block;
            const svg = this.getIcon(type);
            // Skip blocks without an icon, and titles that already have one.
            if (!svg || title.previousElementSibling?.classList.contains('block-icon')) {
                return;
            }
            const span = document.createElement('span');
            span.className = `block-icon retani-icon icon-${type}`;
            span.setAttribute('aria-hidden', 'true');
            span.innerHTML = svg;
            title.before(span);
        });
        return this;
    }
}
