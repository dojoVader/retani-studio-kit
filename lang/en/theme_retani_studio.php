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
 * Language file.
 *
 * @package   theme_retani_studio
 * @copyright 2016 Frédéric Massart
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

$string['advancedsettings'] = 'Advanced settings';
$string['aigeneratedimage'] = 'AI-generated image';
$string['backgroundimage'] = 'Background image';
$string['backgroundimage_desc'] = 'The image to display as a background of the site. The background image you upload here will override the background image in your theme preset files.';
$string['brandcolor'] = 'Brand colour';
$string['brandcolor_desc'] = 'The accent colour.';
$string['bootswatch'] = 'Bootswatch';
$string['bootswatch_desc'] = 'A bootswatch is a set of Bootstrap variables and css to style Bootstrap';
$string['carousellabel'] = 'Highlights';
$string['carouselnext'] = 'Next slide';
$string['carouselprevious'] = 'Previous slide';
$string['carouselslide'] = 'Go to slide {$a}';
$string['choosereadme'] = 'Retani Studio is a customisable theme forked from Boost.';
$string['colourmode:auto'] = 'System';
$string['colourmode:dark'] = 'Dark';
$string['colourmode:light'] = 'Light';
$string['colourmodeselected'] = 'Colour mode: {$a}';
$string['configtitle'] = 'Retani Studio';
$string['courseoverview:code'] = 'Code';
$string['courseoverview:completionrate'] = 'Completion rate';
$string['courseoverview:enrolled'] = 'Enrolled';
$string['courseoverview:entercourse'] = 'Enter this course';
$string['courseoverview:filter'] = 'Filter';
$string['courseoverview:level'] = 'Level';
$string['courseoverview:loadfailed'] = 'Courses could not be loaded.';
$string['courseoverview:nomatch'] = 'No courses match “{$a}”.';
$string['courseoverview:noprogress'] = 'No completion criteria';
$string['courseoverview:pagestatus'] = 'Page {$a}';
$string['courseoverview:progress'] = 'Progress';
$string['courseoverview:sortby'] = 'Sort by {$a}';
$string['courseoverview:teacher'] = 'Teacher';
$string['copyright'] ='Copyright © {$a->year} {$a->sitename}. All rights reserved';
$string['coursehero:activities'] = '{$a} activities';
$string['coursehero:othercontacts'] = '+{$a}';
$string['coursehero:progress'] = 'Your progress';
$string['coursehero:progresssummary'] = '{$a->done} of {$a->total} complete · {$a->percent}%';
$string['coursehero:sections'] = '{$a} sections';
$string['defaultcolourmode'] = 'Default colour mode';
$string['defaultcolourmode_desc'] = 'The colour mode used by people who have not chosen one. \'System\' follows the colour scheme set on their device or browser. While colour modes are experimental, this is set to \'Light\', so that people are only shown the dark mode once they choose it.';
$string['enablecolourmodes'] = 'Enable colour modes';
$string['enablecolourmodes_desc'] = 'Allow people to switch the site between a light and a dark colour scheme. When disabled, the site is always shown in light mode.

This feature is experimental. Plugins are only shown in the dark colour scheme if they take their colours from the theme, so pages of a plugin which has not been checked yet may be shown with light backgrounds, or with text which is hard to read against them.';
$string['experimentalsettings'] = 'Experimental settings';
$string['generalsettings'] = 'General settings';
$string['general'] = 'General';
$string['leftbar:collapse'] = 'Collapse sidebar';
$string['leftbar:coursecount'] = '{$a} courses';
$string['leftbar:coursemanagement'] = 'Course management';
$string['leftbar:courseoutline'] = 'Course outline';
$string['leftbar:expand'] = 'Expand sidebar';
$string['leftbar:currentcourse'] = 'Current course';
$string['leftbar:help'] = 'Help & Support';
$string['leftbar:mybadges'] = 'My badges';
$string['leftbar:navigation'] = 'Site navigation';
$string['leftbar:switchcategory'] = 'Switch category';
$string['loginbackgroundimage'] = 'Login page background image';
$string['loginbackgroundimage_desc'] = 'The image to display as a background for the login page.';
$string['loginheading'] = 'Log in to your account';
$string['loginseparatoremail'] = 'or continue with email';
$string['loginsubheading'] = 'Enter your information to access your account';
$string['logo'] = 'Logo';
$string['logo_desc'] = 'The logo shown at the top of the login page panel. If no logo is uploaded, the site name is shown instead.';
$string['nobootswatch'] = 'None';
$string['pluginname'] = 'Retani Studio';
$string['presetfiles'] = 'Additional theme preset files';
$string['presetfiles_desc'] = 'Preset files can be used to dramatically alter the appearance of a theme.';
$string['preset'] = 'Theme preset';
$string['preset_desc'] = 'Pick a preset to broadly change the look of the theme.';
$string['privacy:colourmode:auto'] = 'The current preference is to follow the colour mode of the device or browser.';
$string['privacy:colourmode:dark'] = 'The current preference is for the dark colour mode.';
$string['privacy:colourmode:light'] = 'The current preference is for the light colour mode.';
$string['privacy:metadata'] = 'The Boost theme does not store any personal data about any user.';
$string['privacy:metadata:preference:colourmode'] = 'The user\'s preference for the light or dark colour mode.';
$string['privacy:metadata:preference:leftbaroutline'] = 'The user\'s preference for showing the course outline in the left bar.';
$string['privacy:leftbaroutlineclosed'] = 'The current preference for the left bar course outline is hidden.';
$string['privacy:leftbaroutlineopen'] = 'The current preference for the left bar course outline is shown.';
$string['rawscss'] = 'Raw SCSS';
$string['rawscss_desc'] = 'Use this field to provide SCSS or CSS code which will be injected at the end of the style sheet.';
$string['rawscsspre'] = 'Raw initial SCSS';
$string['rawscsspre_desc'] = 'In this field you can provide initialising SCSS code, it will be injected before everything else. Most of the time you will use this setting to define variables.';
$string['region-side-pre'] = 'Right';
$string['section:progress'] = '{$a->done} of {$a->total} activities complete';
$string['showfooter'] = 'Show footer';
$string['unaddableblocks'] = 'Unneeded blocks';
$string['unaddableblocks_desc'] = 'The blocks specified are not needed when using this theme and will not be listed in the \'Add a block\' menu.';
$string['privacy:metadata:preference:draweropenblock'] = 'The user\'s preference for hiding or showing the drawer with blocks.';
$string['privacy:metadata:preference:draweropenindex'] = 'The user\'s preference for hiding or showing the drawer with course index.';
$string['privacy:metadata:preference:draweropennav'] = 'The user\'s preference for hiding or showing the drawer menu navigation.';
$string['privacy:drawerindexclosed'] = 'The current preference for the index drawer is closed.';
$string['privacy:drawerindexopen'] = 'The current preference for the index drawer is open.';
$string['privacy:drawerblockclosed'] = 'The current preference for the block drawer is closed.';
$string['privacy:drawerblockopen'] = 'The current preference for the block drawer is open.';
$string['adminpagedesc_experimentalsettings'] = 'Features still being tested. They may change or be removed.';
$string['adminsettings:count'] = '{$a} settings';
$string['adminsettings:countone'] = '1 setting';
$string['adminsettings:saved'] = 'All changes saved';
$string['adminsettings:unsaved'] = 'Unsaved changes';
$string['adminindex:count'] = '{$a} pages';
$string['adminindex:countone'] = '1 page';
$string['adminsearch:placeholder'] = 'Search settings';
$string['admintabdesc_appearance'] = 'Themes, navigation, calendars and how content looks across the site.';
$string['admintabdesc_courses'] = 'Course and category management, defaults, backups and course requests.';
$string['admintabdesc_development'] = 'Debugging, experimental features and developer tools.';
$string['admintabdesc_grades'] = 'Gradebook defaults, grade letters, scales and outcomes.';
$string['admintabdesc_modules'] = 'Install, enable and configure plugins.';
$string['admintabdesc_reports'] = 'Logs, statistics and reports about site activity.';
$string['admintabdesc_root'] = 'Site-wide notifications, features and shared tools.';
$string['admintabdesc_server'] = 'System paths, email, performance, tasks and maintenance.';
$string['admintabdesc_users'] = 'Accounts, permissions, roles and privacy.';
$string['formsection:count'] = '{$a} fields';
$string['formsection:countone'] = '1 field';
$string['rolepicker:added'] = 'Added';
$string['blocksidebar:add'] = 'Add';
$string['blocksidebar:addblockhint'] = 'Timeline, calendar, badges and more';
$string['blocksidebar:loading'] = 'Loading blocks…';
$string['blocksidebar:nomatch'] = 'No blocks match “{$a}”';
$string['blocksidebar:search'] = 'Search blocks';

$string['quiznav:answeredcount'] = '{$a->count}/{$a->total} answered';
$string['quiznav:correctcount'] = '{$a->count}/{$a->total} correct';
