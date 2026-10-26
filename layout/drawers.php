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
 * A drawer based layout for the Retani Studio theme.
 *
 * @package   theme_retani_studio
 * @copyright 2021 Bas Brands
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

require_once($CFG->libdir . '/behat/lib.php');
require_once($CFG->dirroot . '/course/lib.php');

if (isloggedin()) {
    $courseindexopen = (get_user_preferences('drawer-open-index', true) == true);
    $blockdraweropen = (get_user_preferences('drawer-open-block') == true);
} else {
    $courseindexopen = false;
    $blockdraweropen = false;
}

if (defined('BEHAT_SITE_RUNNING') && get_user_preferences('behat_keep_drawer_closed') != 1) {
    $blockdraweropen = true;
}

$extraclasses = ['uses-drawers'];
if ($courseindexopen) {
    $extraclasses[] = 'drawer-open-index';
}

$blockshtml = $OUTPUT->blocks(\theme_retani_studio\output\block_sidebar::REGION);
$hasblocks = \theme_retani_studio\output\block_sidebar::has_content($PAGE, $blockshtml);
if (!$hasblocks) {
    $blockdraweropen = false;
}
$courseindex = core_course_drawer();
if (!$courseindex) {
    $courseindexopen = false;
}

// Retractable left bar, for users who are signed in to an account of their own.
$leftbar = false;
if (isloggedin() && !isguestuser()) {
    $hascourseoutline = !empty($courseindex);
    $leftbar = (new \theme_retani_studio\output\left_bar($PAGE, $hascourseoutline))->export_for_template($OUTPUT);
    $extraclasses[] = 'has-retani-leftbar';
    if ($leftbar['collapsed']) {
        $extraclasses[] = 'retani-leftbar-collapsed';
    }
    if ($hascourseoutline) {
        // On wide screens the course index lives in the left bar's course outline (the LeftBar component moves it
        // there), so its drawer never opens; on small screens, where the bar is hidden, the drawer is used as usual.
        $extraclasses[] = 'has-retani-courseoutline';
        $courseindexopen = false;
        $extraclasses = array_diff($extraclasses, ['drawer-open-index']);
    }
}


$forceblockdraweropen = $OUTPUT->firstview_fakeblocks();

// Right-hand block bar (in place of the Boost block drawer). It opens with the page when the user left it open,
// and when the page shows its first-visit blocks.
$blocksidebar = false;
if ($hasblocks) {
    $blocksidebaropen = $blockdraweropen || $forceblockdraweropen;
    $blocksidebar = (new \theme_retani_studio\output\block_sidebar($PAGE, $blockshtml, $blocksidebaropen))
        ->export_for_template($OUTPUT);
    $extraclasses[] = 'has-retani-blocksidebar';
    if ($blocksidebaropen) {
        $extraclasses[] = 'retani-blocksidebar-open';
    }
}

$bodyattributes = $OUTPUT->body_attributes($extraclasses);

$overflow = '';
if ($PAGE->has_secondary_navigation()) {
    // The secondary navigation itself is drawn by core_renderer::full_header() as the header tab bar.
    $overflowdata = $PAGE->secondarynav->get_overflow_menu_data();
    if (!is_null($overflowdata)) {
        $selectmenu = new \core\output\select_menu(
            'tertiarynavigation',
            $overflowdata->urls,
            $overflowdata->selected,
        );
        $selectmenu->set_label($overflowdata->label, $overflowdata->labelattributes);
        $overflow = $selectmenu->export_for_template($OUTPUT);
    }
}

$primary = new core\navigation\output\primary($PAGE);
$renderer = $PAGE->get_renderer('core');
$primarymenu = $primary->export_for_template($renderer);
$buildregionmainsettings = !$PAGE->include_region_main_settings_in_header_actions() && !$PAGE->has_secondary_navigation();
// If the settings menu will be included in the header then don't add it here.
$regionmainsettingsmenu = $buildregionmainsettings ? $OUTPUT->region_main_settings_menu() : false;

$header = $PAGE->activityheader;
$headercontent = $header->export_for_template($renderer);

$coursefullname = ($PAGE->course?->fullname) ? format_string(
    $PAGE->course->fullname,
    true,
    ['context' => context_course::instance($PAGE->course->id), 'escape' => false],
) : '';
$courseurl = $PAGE->course ? new \core\url('/course/view.php', ['id' => $PAGE->course->id]) : null;

$templatecontext = [
    'sitename' => format_string($SITE->shortname, true, ['context' => context_course::instance(SITEID), "escape" => false]),
    'coursefullname' => $coursefullname,
    'courseurl' => $courseurl ? $courseurl->out(false) : null,
    'output' => $OUTPUT,
    'sidepreblocks' => $blockshtml,
    'hasblocks' => $hasblocks,
    'bodyattributes' => $bodyattributes,
    'courseindexopen' => $courseindexopen,
    'blockdraweropen' => $blockdraweropen,
    'courseindex' => $courseindex,
    'primarymoremenu' => $primarymenu['moremenu'],
    'mobileprimarynav' => $primarymenu['mobileprimarynav'],
    'usermenu' => $primarymenu['user'],
    'langmenu' => $primarymenu['lang'],
    'forceblockdraweropen' => $forceblockdraweropen,
    'regionmainsettingsmenu' => $regionmainsettingsmenu,
    'hasregionmainsettingsmenu' => !empty($regionmainsettingsmenu),
    'overflow' => $overflow,
    'headercontent' => $headercontent,
    'leftbar' => $leftbar,
    'blocksidebar' => $blocksidebar,

];

echo $OUTPUT->render_from_template('theme_retani_studio/drawers', $templatecontext);
