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
 * The site home layout for the Retani Studio theme: a landing page built from the front page settings.
 *
 * @package   theme_retani_studio
 * @copyright 2026 Retani
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

use theme_retani_studio\output\frontpage;

// With the landing page switched off, the site home is drawn like any other page.
if (!frontpage::is_enabled($PAGE)) {
    require(__DIR__ . '/drawers.php');
    return;
}

$editing = $PAGE->user_is_editing();
$bodyattributes = $OUTPUT->body_attributes(['retani-landing']);

$primary = new core\navigation\output\primary($PAGE);
$renderer = $PAGE->get_renderer('core');
$primarymenu = $primary->export_for_template($renderer);
$loggedin = isloggedin() && !isguestuser();

$templatecontext = (new frontpage($PAGE))->export_for_template($OUTPUT) + [
    'output' => $OUTPUT,
    'bodyattributes' => $bodyattributes,
    'usermenu' => $loggedin ? $primarymenu['user'] : false,
    // The site home content (site announcements, course lists and so on, as set up in Site home settings) stays on the
    // page, because it is how the site home is edited; it is shown when editing, or when the theme is set to show it.
    'showsitecontent' => $editing || !empty($PAGE->theme->settings->fp_showsitecontent),
    'editing' => $editing,
    'extraheadhtml' => '<link rel="preconnect" href="https://fonts.googleapis.com">' .
        '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' .
        '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&amp;display=swap">',
];

echo $OUTPUT->render_from_template('theme_retani_studio/frontpage', $templatecontext);
