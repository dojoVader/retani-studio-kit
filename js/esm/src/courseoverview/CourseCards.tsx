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
 * The course card grid, from the "Course overview" card view in mockup/Retani Home.dc.html.
 *
 * @module     theme_retani_studio/courseoverview/CourseCards
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {Icon, PATHS} from './icons';
import {isSet, type CourseOverviewStrings, type CourseRowData} from './types';

/** Segments in a card's progress bar, as in the mockup. */
const SEGMENTS = 30;

/** Skeleton cards shown while a page loads. */
const SKELETON_CARDS = 4;

type CardStrings = Pick<CourseOverviewStrings, 'hidden' | 'completepercent' | 'noprogress' | 'entercourse'>;

/**
 * Segmented progress bar: one segment per 1/30th of the course, filled up to the user's progress.
 *
 * @param props Component props.
 * @param props.progress Percentage complete, or null without completion criteria.
 * @returns The bar.
 */
function SegmentBar({progress}: {progress: number | null}) {
    const filled = progress === null ? 0 : Math.round(progress / 100 * SEGMENTS);
    return (
        <div className="retani-courseoverview-segments" aria-hidden="true">
            {Array.from({length: SEGMENTS}, (_, i) => <span key={i} className={i < filled ? 'is-filled' : undefined} />)}
        </div>
    );
}

/**
 * One course card.
 *
 * @param props Component props.
 * @param props.course The course.
 * @param props.strings Labels.
 * @returns The card.
 */
function CourseCard({course, strings}: {course: CourseRowData; strings: CardStrings}) {
    const progress = course.hasprogress && isSet(course.progress) ? Math.round(course.progress) : null;
    const teacher = course.details?.teachers[0]?.fullname;
    const meta = [course.coursecategory, teacher].filter(Boolean).join(' · ');
    const progresslabel = progress === null ? strings.noprogress : strings.completepercent.replace('{$a}', String(progress));

    return (
        <article className={`retani-courseoverview-card${course.visible ? '' : ' is-dimmed'}`}>
            <a className="retani-courseoverview-cardimage" href={course.viewurl} tabIndex={-1} aria-hidden="true"
                style={{backgroundImage: `url("${course.courseimage}")`}}>
                <span className="retani-courseoverview-badge">{course.shortname}</span>
            </a>
            <div className="retani-courseoverview-cardbody">
                <h3 className="retani-courseoverview-cardtitle">
                    <a href={course.viewurl}>{course.fullname}</a>
                </h3>
                {meta && (
                    <span className="retani-courseoverview-cardmeta">
                        <Icon path={PATHS.folder} size={12} strokeWidth={2} />
                        <span>{meta}</span>
                    </span>
                )}
                {!course.visible && <span className="retani-courseoverview-hidden">{strings.hidden}</span>}
                <div className="retani-courseoverview-cardprogress">
                    <span>{progresslabel}</span>
                    <SegmentBar progress={progress} />
                </div>
                <a className="retani-courseoverview-enter" href={course.viewurl}>
                    {strings.entercourse}
                    <span className="visually-hidden">: {course.fullname}</span>
                </a>
            </div>
        </article>
    );
}

export interface CourseCardsProps {
    courses: CourseRowData[];
    loading: boolean;
    failed: boolean;
    search: string;
    strings: CardStrings & Pick<CourseOverviewStrings, 'nocourses' | 'nomatch' | 'loadfailed'>;
}

/**
 * Render the card grid, with its loading, empty and error states.
 *
 * @param props Component props.
 * @returns The grid.
 */
export default function CourseCards({courses, loading, failed, search, strings}: CourseCardsProps) {
    if (loading && courses.length === 0) {
        return (
            <div className="retani-courseoverview-cards" aria-busy="true">
                {Array.from({length: SKELETON_CARDS}, (_, i) => (
                    <div key={i} className="retani-courseoverview-card is-skeleton" aria-hidden="true">
                        <span className="retani-courseoverview-cardimage" />
                        <span className="retani-courseoverview-cardbody"><span /><span /><span /></span>
                    </div>
                ))}
            </div>
        );
    }
    if (failed) {
        return <div className="retani-courseoverview-empty is-standalone" role="alert">{strings.loadfailed}</div>;
    }
    if (courses.length === 0) {
        return (
            <div className="retani-courseoverview-empty is-standalone">
                {search.trim() ? strings.nomatch.replace('{$a}', search.trim()) : strings.nocourses}
            </div>
        );
    }
    return (
        <div className={`retani-courseoverview-cards${loading ? ' is-loading' : ''}`} aria-busy={loading}>
            {courses.map((course) => <CourseCard key={course.id} course={course} strings={strings} />)}
        </div>
    );
}
