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
 * The site home layout: the Retani landing page, set up in the "Front page" tabs of the theme settings.
 *
 * The standard drawers layout is used instead when the landing page is turned off. The landing page has no edit
 * mode switch, and is shown whether or not editing is on.
 *
 * @package   theme_retani_studio
 * @copyright 2026 Okeowo Aderemi
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

$frontpage = new \theme_retani_studio\output\frontpage($PAGE);
if (!$frontpage->is_enabled()) {
    require(__DIR__ . '/drawers.php');
    return;
}

$templatecontext = $frontpage->export_for_template($OUTPUT) + [
    'output' => $OUTPUT,
    'bodyattributes' => $OUTPUT->body_attributes(['retani-frontpage']),
];

echo $OUTPUT->render_from_template('theme_retani_studio/frontpage', $templatecontext);
