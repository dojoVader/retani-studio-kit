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

use block_myoverview\output\main;
use core\url;

/**
 * Course overview block renderer: shows the courses as the Retani course table.
 *
 * The table itself is the theme_retani_studio/courseoverview/CourseOverview React component, mounted from the
 * theme's override of block_myoverview/main. This renderer adds the JSON props that component needs.
 *
 * @package    theme_retani_studio
 * @copyright  2026 Okeowo Aderemi
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class block_myoverview_renderer extends \block_myoverview\output\renderer {
    /** Groupings the block can offer, in the order its own grouping menu lists them. */
    protected const GROUPINGS = ['allincludinghidden', 'all', 'inprogress', 'future', 'past', 'favourites', 'hidden'];

    /**
     * Render the block content.
     *
     * @param main $main
     * @return string
     */
    public function render_main(main $main) {
        global $USER;

        if (!count(enrol_get_all_users_courses($USER->id, true))) {
            return $this->render_from_template('block_myoverview/zero-state', $main->export_for_zero_state_template($this));
        }
        $context = $main->export_for_template($this);
        $props = $this->get_react_props($context);
        $context['reactprops'] = json_encode($props, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        // Lets block_myoverview/placeholders draw skeleton cards or skeleton rows to match.
        $context['iscardview'] = $props['view'] === 'card';
        return $this->render_from_template('block_myoverview/main', $context);
    }

    /**
     * Props for the CourseOverview component, mirroring its CourseOverviewProps type.
     *
     * @param array $context The block's own template context, from main::export_for_template().
     * @return array
     */
    protected function get_react_props(array $context): array {
        $filters = [];
        foreach (self::GROUPINGS as $grouping) {
            if (!empty($context['displaygrouping' . $grouping])) {
                $filters[] = [
                    'key' => $grouping,
                    'grouping' => $grouping,
                    'label' => get_string($grouping === 'hidden' ? 'hiddencourses' : $grouping, 'block_myoverview'),
                ];
            }
        }
        if (!empty($context['displaygroupingcustomfield'])) {
            foreach ($context['customfieldvalues'] as $field) {
                $filters[] = [
                    'key' => 'customfield:' . $field->value,
                    'grouping' => 'customfield',
                    'label' => $field->name,
                    'customfieldname' => $context['customfieldname'],
                    'customfieldvalue' => (string) $field->value,
                ];
            }
        }
        $selected = $context['grouping'] === 'customfield' ? 'customfield:' . $context['customfieldvalue'] : $context['grouping'];

        // The block's card layout is the card grid; its list and summary layouts are both shown as the table.
        $toview = fn(string $layout): string => $layout === 'card' ? 'card' : 'list';
        $views = array_values(array_unique(array_map(fn($layout) => $toview($layout->id), $context['layouts'])));

        return [
            'filters' => $filters,
            'filter' => $selected,
            'view' => $toview((string) $context['view']),
            'views' => $views,
            'sort' => $context['sort'],
            'paging' => (int) $context['paging'],
            'showcategory' => !empty($context['displaycategories']),
            'actions' => array_map(fn(array $action): array => [
                'url' => $action['url'] instanceof url ? $action['url']->out(false) : (string) $action['url'],
                'label' => $action['label'],
                'primary' => str_contains($action['class'], 'btn-primary'),
            ], $context['courseactionurls']),
            'strings' => [
                'title' => get_string('pluginname', 'block_myoverview'),
                'controls' => get_string('aria:controls', 'block_myoverview'),
                'search' => get_string('searchcourses', 'block_myoverview'),
                'filter' => get_string('courseoverview:filter', 'theme_retani_studio'),
                'code' => get_string('courseoverview:code', 'theme_retani_studio'),
                'coursename' => get_string('title', 'block_myoverview'),
                'level' => get_string('courseoverview:level', 'theme_retani_studio'),
                'category' => get_string('category'),
                'teacher' => get_string('courseoverview:teacher', 'theme_retani_studio'),
                'enrolled' => get_string('courseoverview:enrolled', 'theme_retani_studio'),
                'completionrate' => get_string('courseoverview:completionrate', 'theme_retani_studio'),
                'progress' => get_string('courseoverview:progress', 'theme_retani_studio'),
                'sortby' => get_string('courseoverview:sortby', 'theme_retani_studio'),
                'nocourses' => get_string('nocourses'),
                'nomatch' => get_string('courseoverview:nomatch', 'theme_retani_studio'),
                'loadfailed' => get_string('courseoverview:loadfailed', 'theme_retani_studio'),
                'previous' => get_string('previous'),
                'next' => get_string('next'),
                'page' => get_string('courseoverview:pagestatus', 'theme_retani_studio'),
                'hidden' => get_string('hiddenfromstudents'),
                'cardview' => get_string('aria:card', 'block_myoverview'),
                'listview' => get_string('aria:list', 'block_myoverview'),
                'completepercent' => get_string('completepercent', 'block_myoverview'),
                'noprogress' => get_string('courseoverview:noprogress', 'theme_retani_studio'),
                'entercourse' => get_string('courseoverview:entercourse', 'theme_retani_studio'),
            ],
        ];
    }
}
