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

namespace theme_retani_studio\output;

use completion_info;
use core\context\course as context_course;
use core_completion\cm_completion_details;
use core_course_category;
use core_course_list_element;
use renderable;
use renderer_base;
use stdClass;
use templatable;

/**
 * The course hero card at the top of course pages (the "coursehero" part of core/full_header).
 *
 * Shows the course category and short name as tags, the course name, its first contact, how many
 * sections and activities it has and, for users whose completion is tracked, their progress.
 * Based on mockup/Moodle Dashboard Implementation (6)/Retani Course Details.dc.html.
 *
 * @package    theme_retani_studio
 * @copyright  2026 Okeowo Aderemi
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class course_header implements renderable, templatable {
    /** @var int Number of segments in the progress bar. */
    public const SEGMENTS = 40;

    /**
     * Constructor.
     *
     * @param stdClass $course The course the page belongs to.
     */
    public function __construct(
        /** @var stdClass The course the page belongs to. */
        protected stdClass $course,
    ) {
    }

    /**
     * Export the data for the template.
     *
     * @param renderer_base $output
     * @return array
     */
    public function export_for_template(renderer_base $output): array {
        $context = context_course::instance($this->course->id);
        $modinfo = get_fast_modinfo($this->course);

        return [
            'title' => format_string($this->course->fullname, true, ['context' => $context]),
            'tags' => $this->get_tags($context),
            'contact' => $this->get_contact(),
            'sectioncount' => $this->count_sections($modinfo),
            'activitycount' => $this->count_activities($modinfo),
            'progress' => $this->get_progress($modinfo),
        ];
    }

    /**
     * Small labels above the course name: its category, short name and, when hidden, a hidden badge.
     *
     * @param context_course $context
     * @return string[]
     */
    protected function get_tags(context_course $context): array {
        $tags = [];
        $category = core_course_category::get($this->course->category, IGNORE_MISSING, true);
        if ($category) {
            $tags[] = $category->get_formatted_name();
        }
        $tags[] = format_string($this->course->shortname, true, ['context' => $context]);
        if (empty($this->course->visible)) {
            $tags[] = get_string('hiddenfromstudents');
        }
        return $tags;
    }

    /**
     * The first course contact (normally the teacher), as configured in the coursecontact setting.
     *
     * @return array|null
     */
    protected function get_contact(): ?array {
        $contacts = (new core_course_list_element($this->course))->get_course_contacts();
        if (!$contacts) {
            return null;
        }
        $first = reset($contacts);
        $user = $first['user'];
        // First letter or digit of each name, so names such as "(Demo Teacher)" do not give a bracket.
        $initial = fn(?string $name): string => \core_text::substr(preg_replace('/[^\p{L}\p{N}]/u', '', (string) $name), 0, 1);
        $initials = $initial($user->firstname ?? '') . $initial($user->lastname ?? '');
        return [
            'name' => $first['username'],
            'role' => $first['rolename'],
            'initials' => \core_text::strtoupper($initials),
            'others' => count($contacts) > 1 ? count($contacts) - 1 : 0,
        ];
    }

    /**
     * Sections the user can see, leaving out delegated sections (subsections), which belong to an activity.
     *
     * @param \course_modinfo $modinfo
     * @return int
     */
    protected function count_sections(\course_modinfo $modinfo): int {
        $count = 0;
        foreach ($modinfo->get_section_info_all() as $section) {
            if ($section->uservisible && !$section->is_delegated()) {
                $count++;
            }
        }
        return $count;
    }

    /**
     * Activities the user can see on the course page, leaving out the ones that only hold a subsection.
     *
     * @param \course_modinfo $modinfo
     * @return int
     */
    protected function count_activities(\course_modinfo $modinfo): int {
        $count = 0;
        foreach ($modinfo->get_cms() as $cm) {
            if ($cm->uservisible && $cm->is_visible_on_course_page() && !$cm->get_delegated_section_info()) {
                $count++;
            }
        }
        return $count;
    }

    /**
     * The user's progress through the activities that have completion enabled.
     *
     * Uses the same rule as the course editor state (cm completion "overall complete"), so the
     * theme_retani_studio/courseprogress module can keep the numbers live without them jumping.
     *
     * @param \course_modinfo $modinfo
     * @return array|null Null when completion is off or the user's completion is not tracked.
     */
    protected function get_progress(\course_modinfo $modinfo): ?array {
        global $USER;

        $completion = new completion_info($this->course);
        if (!$completion->is_enabled() || !$completion->is_tracked_user($USER->id)) {
            return null;
        }

        $total = 0;
        $done = 0;
        foreach ($modinfo->get_cms() as $cm) {
            if (!$cm->uservisible || !$completion->is_enabled($cm)) {
                continue;
            }
            $total++;
            if (cm_completion_details::get_instance($cm, $USER->id)->is_overall_complete()) {
                $done++;
            }
        }
        if ($total === 0) {
            return null;
        }

        $percent = (int) round($done / $total * 100);
        $filled = (int) round($done / $total * self::SEGMENTS);
        $segments = [];
        for ($i = 0; $i < self::SEGMENTS; $i++) {
            $segments[] = ['filled' => $i < $filled];
        }

        return [
            'done' => $done,
            'total' => $total,
            'percent' => $percent,
            'summary' => get_string('coursehero:progresssummary', 'theme_retani_studio',
                (object) ['done' => $done, 'total' => $total, 'percent' => $percent]),
            'segments' => $segments,
        ];
    }
}
