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


/**
 * The course category layout. The list of courses at /course/index.php is drawn as the Retani course listing; other
 * category pages, and the listing when it is turned off, use the standard drawers layout.
 *
 * @package   theme_retani_studio
 * @copyright 2026 Okeowo Aderemi
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

$frontpage = new \theme_retani_studio\output\frontpage($PAGE);
if (!\theme_retani_studio\output\course_listing::applies_to($PAGE) || !$frontpage->is_course_listing_enabled()) {
    require(__DIR__ . '/drawers.php');
    return;
}

$listing = new \theme_retani_studio\output\course_listing($PAGE);
$templatecontext = $frontpage->export_chrome($OUTPUT) + [
    'listing' => $listing->export_for_template($OUTPUT),
    'output' => $OUTPUT,
    'bodyattributes' => $OUTPUT->body_attributes(['retani-frontpage', 'retani-courselisting']),
];

echo $OUTPUT->render_from_template('theme_retani_studio/course_listing', $templatecontext);
