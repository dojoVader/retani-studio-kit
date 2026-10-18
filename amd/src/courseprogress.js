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
 * Course page helpers for the Retani course design (core_courseformat/local/content override).
 *
 * - moveToggleAll() moves the "Collapse all / Expand all" button into the tab bar of core/full_header.
 * - init() starts a reactive component which keeps a "done / total" chip on every section, and the
 *   progress bar of the course hero, in step with the activity completion in the course state.
 *
 * @module     theme_retani_studio/courseprogress
 * @copyright  2026 Okeowo Aderemi
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {BaseComponent} from 'core/reactive';
import {getCurrentCourseEditor} from 'core_courseformat/courseeditor';
import {getString} from 'core/str';

const SELECTORS = {
    TOOLBAR: '[data-region="retani-course-toolbar"]',
    TABTOOLS: '[data-region="retani-header-tabtools"]',
    SECTION: `[data-for='section']`,
    SECTION_TITLE: `:scope > .section-item > [data-for='section_title']`,
    SECTION_BADGES: `:scope > [data-region='sectionbadges']`,
    CHIP: `:scope > [data-region='retani-section-progress']`,
    COURSE_PROGRESS: '[data-region="retani-course-progress"]',
    COURSE_SUMMARY: '[data-region="summary"]',
    COURSE_BAR: '[data-region="bar"]',
};

/**
 * Move the collapse/expand all button from the course content into the header tab bar.
 *
 * Must run before core_courseformat/local/content is initialised, so the content component binds to the
 * button in its new place. When the page has no tab bar the button stays above the sections.
 *
 * @param {string} contentSelector Selector of the course content wrapper.
 */
export const moveToggleAll = (contentSelector) => {
    const toolbar = document.querySelector(contentSelector)?.querySelector(SELECTORS.TOOLBAR);
    const slot = document.querySelector(SELECTORS.TABTOOLS);
    if (!toolbar || !slot) {
        return;
    }
    slot.append(...toolbar.childNodes);
    toolbar.remove();
};

/**
 * Count the activities with completion, and the completed ones, among the given course modules.
 *
 * Uses the same rule as theme_retani_studio\output\course_header::get_progress(), so numbers rendered on
 * the server do not change when this component takes over.
 *
 * @param {Array} cms Course module state objects.
 * @returns {{done: number, total: number}}
 */
const countCompletion = (cms) => {
    let done = 0;
    let total = 0;
    cms.forEach((cm) => {
        if (!cm?.uservisible || (cm.completionstate ?? null) === null) {
            return;
        }
        total++;
        if (cm.isoverallcomplete) {
            done++;
        }
    });
    return {done, total};
};

class CourseProgress extends BaseComponent {

    /**
     * Constructor hook.
     */
    create() {
        this.name = 'theme_retani_studio_courseprogress';
    }

    /**
     * Create the component from the content template.
     *
     * @param {string} target Selector of the course content wrapper.
     * @returns {CourseProgress|null}
     */
    static init(target) {
        const element = document.querySelector(target);
        if (!element) {
            return null;
        }
        return new this({element, reactive: getCurrentCourseEditor()});
    }

    /**
     * Initial state ready.
     */
    stateReady() {
        this._refresh();
    }

    /**
     * Watch every change which can move a completion count.
     *
     * Section re-renders (for example in edit mode) drop the chip, so section changes refresh too.
     *
     * @returns {Array}
     */
    getWatchers() {
        return [
            {watch: 'cm.completionstate:updated', handler: this._refresh},
            {watch: 'cm.isoverallcomplete:updated', handler: this._refresh},
            {watch: 'cm.uservisible:updated', handler: this._refresh},
            {watch: 'cm:created', handler: this._refresh},
            {watch: 'cm:deleted', handler: this._refresh},
            {watch: 'section:created', handler: this._refresh},
            {watch: 'section:updated', handler: this._refresh},
        ];
    }

    /**
     * Redraw the section chips and the course progress bar.
     */
    _refresh() {
        const state = this.reactive.state;
        if (!state?.section || !state?.cm) {
            return;
        }
        state.section.forEach((section) => {
            const cms = (section.cmlist ?? []).map((cmid) => state.cm.get(cmid));
            this._refreshSection(section.id, countCompletion(cms));
        });
        this._refreshCourse(countCompletion([...state.cm.values()]));
    }

    /**
     * Draw, update or remove the chip of one section.
     *
     * @param {number|string} sectionid
     * @param {{done: number, total: number}} counts
     */
    _refreshSection(sectionid, {done, total}) {
        const section = this.getElement(SELECTORS.SECTION, sectionid);
        const header = section?.querySelector(SELECTORS.SECTION_TITLE);
        if (!header) {
            return;
        }
        let chip = header.querySelector(SELECTORS.CHIP);
        if (total === 0) {
            chip?.remove();
            return;
        }
        if (!chip) {
            chip = document.createElement('span');
            chip.className = 'retani-section-progress';
            chip.dataset.region = 'retani-section-progress';
            chip.innerHTML = '<span class="retani-section-progress-dot" aria-hidden="true"></span>'
                + '<span class="retani-section-progress-text"></span>';
            const badges = header.querySelector(SELECTORS.SECTION_BADGES);
            if (badges) {
                badges.after(chip);
            } else {
                header.append(chip);
            }
        }
        chip.classList.toggle('is-complete', done === total);
        chip.classList.toggle('is-started', done > 0 && done < total);
        chip.querySelector('.retani-section-progress-text').textContent = `${done}/${total}`;
        getString('section:progress', 'theme_retani_studio', {done, total})
            .then((label) => chip.setAttribute('title', label))
            .catch(() => undefined);
    }

    /**
     * Update the progress bar of the course hero in core/full_header.
     *
     * @param {{done: number, total: number}} counts
     */
    _refreshCourse({done, total}) {
        const progress = document.querySelector(SELECTORS.COURSE_PROGRESS);
        if (!progress || total === 0) {
            return;
        }
        if (Number(progress.dataset.done) === done && Number(progress.dataset.total) === total) {
            return;
        }
        progress.dataset.done = done;
        progress.dataset.total = total;

        const percent = Math.round(done / total * 100);
        const bar = progress.querySelector(SELECTORS.COURSE_BAR);
        if (bar) {
            const segments = [...bar.children];
            const filled = Math.round(done / total * segments.length);
            segments.forEach((segment, index) => segment.classList.toggle('is-filled', index < filled));
            bar.setAttribute('aria-valuenow', percent);
        }
        getString('coursehero:progresssummary', 'theme_retani_studio', {done, total, percent})
            .then((summary) => {
                const text = progress.querySelector(SELECTORS.COURSE_SUMMARY);
                if (text) {
                    text.textContent = summary;
                }
                bar?.setAttribute('aria-valuetext', summary);
                return summary;
            })
            .catch(() => undefined);
    }
}

export const init = (target) => CourseProgress.init(target);
