<?php
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

namespace theme_retani_studio\external;

use completion_info;
use core\context\course as context_course;
use core\context\system as context_system;
use core_course_list_element;
use core_external\external_api;
use core_external\external_function_parameters;
use core_external\external_multiple_structure;
use core_external\external_single_structure;
use core_external\external_value;

/**
 * Extra course details for the Retani course overview table: teachers, level, enrolments and completion rate.
 *
 * These complement core_course_get_enrolled_courses_by_timeline_classification, which the table uses for
 * the course list itself but which does not return course contacts or participation figures.
 *
 * @package    theme_retani_studio
 * @copyright  2026 Okeowo Aderemi
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class get_course_overview_details extends external_api {
    /** Most courses one call may ask about; the table asks for one page at a time. */
    public const MAX_COURSES = 100;

    /** Shortname of the course custom field shown in the Level column, when the site has one. */
    public const LEVEL_FIELD = 'level';

    /**
     * Parameters.
     *
     * @return external_function_parameters
     */
    public static function execute_parameters(): external_function_parameters {
        return new external_function_parameters([
            'courseids' => new external_multiple_structure(
                new external_value(PARAM_INT, 'Course id'),
                'Courses to describe',
            ),
        ]);
    }

    /**
     * Describe the given courses.
     *
     * Courses the user cannot access are left out. Enrolment counts and the completion rate are only returned
     * where the user may view the course participants.
     *
     * @param int[] $courseids
     * @return array
     */
    public static function execute(array $courseids): array {
        global $CFG;
        require_once($CFG->libdir . '/completionlib.php');

        ['courseids' => $courseids] = self::validate_parameters(self::execute_parameters(), ['courseids' => $courseids]);
        self::validate_context(context_system::instance());

        $courseids = array_slice(array_unique(array_filter($courseids)), 0, self::MAX_COURSES);
        $result = [];
        foreach ($courseids as $courseid) {
            $course = get_course($courseid);
            if (!can_access_course($course)) {
                continue;
            }
            $context = context_course::instance($course->id);
            $canviewparticipants = has_capability('moodle/course:viewparticipants', $context);
            $enrolled = $canviewparticipants ? count_enrolled_users($context, '', 0, true) : null;

            $result[] = [
                'id' => (int) $course->id,
                'level' => self::get_level($course->id),
                'teachers' => self::get_teachers($course),
                'enrolledcount' => $enrolled,
                'completionrate' => $canviewparticipants ? self::get_completion_rate($course, $context, $enrolled) : null,
            ];
        }
        return $result;
    }

    /**
     * Returns.
     *
     * @return external_multiple_structure
     */
    public static function execute_returns(): external_multiple_structure {
        return new external_multiple_structure(new external_single_structure([
            'id' => new external_value(PARAM_INT, 'Course id'),
            'level' => new external_value(PARAM_TEXT, 'Value of the "level" course custom field', VALUE_OPTIONAL),
            'teachers' => new external_multiple_structure(new external_single_structure([
                'id' => new external_value(PARAM_INT, 'User id'),
                'fullname' => new external_value(PARAM_TEXT, 'Full name'),
                'rolename' => new external_value(PARAM_TEXT, 'Role name'),
            ]), 'Course contacts, as configured in Site administration > Appearance > Courses'),
            'enrolledcount' => new external_value(PARAM_INT, 'Active enrolled users', VALUE_OPTIONAL),
            'completionrate' => new external_value(PARAM_FLOAT,
                'Percentage of active enrolled users who completed the course', VALUE_OPTIONAL),
        ]));
    }

    /**
     * The course contacts, which is how Moodle lists a course's teachers in course listings.
     *
     * @param \stdClass $course
     * @return array
     */
    protected static function get_teachers(\stdClass $course): array {
        $teachers = [];
        foreach ((new core_course_list_element($course))->get_course_contacts() as $contact) {
            $teachers[] = [
                'id' => (int) $contact['user']->id,
                'fullname' => $contact['username'],
                'rolename' => $contact['rolename'],
            ];
        }
        return $teachers;
    }

    /**
     * Exported value of the "level" course custom field, if the site defines one and this course has a value.
     *
     * @param int $courseid
     * @return string|null
     */
    protected static function get_level(int $courseid): ?string {
        $handler = \core_course\customfield\course_handler::create();
        foreach ($handler->get_instance_data($courseid, true) as $data) {
            if ($data->get_field()->get('shortname') !== self::LEVEL_FIELD) {
                continue;
            }
            $value = $data->export_value();
            return ($value === null || $value === '') ? null : strip_tags((string) $value);
        }
        return null;
    }

    /**
     * Share of active enrolled users who have completed the course.
     *
     * @param \stdClass $course
     * @param context_course $context
     * @param int $enrolled Active enrolled users.
     * @return float|null Null when completion tracking is off or nobody is enrolled.
     */
    protected static function get_completion_rate(\stdClass $course, context_course $context, int $enrolled): ?float {
        global $DB;

        if (!$enrolled || !(new completion_info($course))->is_enabled()) {
            return null;
        }
        [$enrolledsql, $params] = get_enrolled_sql($context, '', 0, true);
        $params['courseid'] = $course->id;
        $completed = $DB->count_records_sql(
            "SELECT COUNT(1)
               FROM {course_completions} cc
               JOIN ($enrolledsql) eu ON eu.id = cc.userid
              WHERE cc.course = :courseid AND cc.timecompleted IS NOT NULL",
            $params,
        );
        return round($completed / $enrolled * 100, 1);
    }
}
