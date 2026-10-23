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

// Front page (site home landing page).
$string['fp_accentcolor'] = 'Accent colour';
$string['fp_accentcolor_desc'] = 'Used for buttons, links, the numbers band, testimonials and the call to action.';
$string['fp_allcategories'] = 'All categories';
$string['fp_brandaccent'] = 'Brand name (accent part)';
$string['fp_brandaccent_desc'] = 'Shown after the brand name in the accent colour, for example "Bank Academy".';
$string['fp_brandname'] = 'Brand name';
$string['fp_brandname_desc'] = 'Shown in the header when no logo is uploaded. If both brand name fields are empty, the site name is used.';
$string['fp_buttontext'] = 'Button text';
$string['fp_buttontextn'] = 'Button {$a} text';
$string['fp_buttonurl'] = 'Button link';
$string['fp_buttonurln'] = 'Button {$a} link';
$string['fp_by'] = 'by';
$string['fp_contacttext'] = 'Contact button text';
$string['fp_contacturl'] = 'Contact button link';
$string['fp_copyright'] = 'Copyright text';
$string['fp_copyright_desc'] = '{year} is replaced with the current year and {sitename} with the site name. Leave empty to use the standard copyright text.';
$string['fp_courseids'] = 'Course IDs';
$string['fp_courseids_desc'] = 'The IDs of the courses to show, in order, separated by commas. Courses a visitor is not allowed to see are left out.';
$string['fp_coursescategory'] = 'Category';
$string['fp_coursescategory_desc'] = 'Show courses from this category and its subcategories.';
$string['fp_coursescount'] = 'Number of courses';
$string['fp_coursesprice'] = 'Show prices';
$string['fp_coursesprice_desc'] = 'Show the course fee from the "Enrolment on payment" (or PayPal) enrolment method of each course. Courses without one are shown as free.';
$string['fp_coursessort'] = 'Order';
$string['fp_coursessort_fullname'] = 'Course name';
$string['fp_coursessort_newest'] = 'Newest first';
$string['fp_coursessort_sortorder'] = 'Course management order';
$string['fp_coursessort_startdate'] = 'Latest start date first';
$string['fp_coursessource'] = 'Courses to show';
$string['fp_coursessource_category'] = 'Courses from a category';
$string['fp_coursessource_desc'] = 'The courses always come from the course catalogue of the site. Only courses the visitor is allowed to see are shown.';
$string['fp_coursessource_ids'] = 'Chosen courses';
$string['fp_coursestabs'] = 'Category tabs';
$string['fp_coursestabs_desc'] = 'Show tabs above the courses to filter them by category, when they come from more than one category.';
$string['fp_ctatext'] = 'Call to action text';
$string['fp_enabled'] = 'Use the landing page';
$string['fp_enabled_desc'] = 'Show the landing page set up on these tabs as the site home. When unticked, the site home uses the standard layout.';
$string['fp_faqs'] = 'Questions';
$string['fp_faqs_desc'] = 'One question per line, as: Question|Answer';
$string['fp_featuredimage'] = 'Image';
$string['fp_featuredpoints'] = 'Key points';
$string['fp_featuredpoints_desc'] = 'One point per line.';
$string['fp_featuredprice'] = 'Price';
$string['fp_featuredpricelabel'] = 'Price label';
$string['fp_featuredtext'] = 'Description';
$string['fp_featuredtitle'] = 'Programme name';
$string['fp_featuredvideourl'] = 'Video link';
$string['fp_featuredvideourl_desc'] = 'When set, a play button on the image opens this link (for example a YouTube video) in a new tab.';
$string['fp_footerbgcolor'] = 'Footer background colour';
$string['fp_footercollinks'] = 'Footer column {$a} links';
$string['fp_footercoltitle'] = 'Footer column {$a} title';
$string['fp_free'] = 'Free';
$string['fp_heading_courses'] = 'Courses';
$string['fp_heading_courses_desc'] = 'The courses are taken from the course catalogue of the site.';
$string['fp_heading_cta'] = 'Call to action';
$string['fp_heading_faq'] = 'Frequently asked questions';
$string['fp_heading_featured'] = 'Featured programme';
$string['fp_heading_footer'] = 'Footer';
$string['fp_heading_general'] = 'Landing page';
$string['fp_heading_header'] = 'Header';
$string['fp_heading_hero'] = 'Hero';
$string['fp_heading_news'] = 'News';
$string['fp_heading_offers'] = 'Why choose us';
$string['fp_heading_partners'] = 'Partners';
$string['fp_heading_paths'] = 'Learning paths';
$string['fp_heading_pricing'] = 'Membership plans';
$string['fp_heading_stats'] = 'Numbers band';
$string['fp_heading_testimonials'] = 'Testimonials';
$string['fp_herobgcolor'] = 'Hero background colour';
$string['fp_herobuttontext'] = 'Search button text';
$string['fp_heroimage'] = 'Hero image';
$string['fp_herosearch'] = 'Show course search';
$string['fp_herosearch_desc'] = 'Show a course search box under the hero text.';
$string['fp_herosearchplaceholder'] = 'Search box placeholder';
$string['fp_herotext'] = 'Hero text';
$string['fp_herotitle'] = 'Hero title';
$string['fp_icon_book'] = 'Book';
$string['fp_icon_building'] = 'Building';
$string['fp_icon_certificate'] = 'Certificate';
$string['fp_icon_chart'] = 'Chart';
$string['fp_icon_clock'] = 'Clock';
$string['fp_icon_device'] = 'Mobile device';
$string['fp_icon_globe'] = 'Globe';
$string['fp_icon_people'] = 'People';
$string['fp_icon_shield'] = 'Shield';
$string['fp_learner'] = '{$a} learner';
$string['fp_learners'] = '{$a} learners';
$string['fp_link_desc'] = 'A full URL, a path on this site starting with / (for example /course/index.php), or an anchor on the page such as #courses.';
$string['fp_linklines_desc'] = 'One link per line, as: Label|Link. A link can be a full URL, a path on this site starting with / or an anchor such as #courses.';
$string['fp_login'] = 'Log in';
$string['fp_loginregister'] = 'Log in / Register';
$string['fp_logo'] = 'Header logo';
$string['fp_logo_desc'] = 'Shown in the header in place of the brand name.';
$string['fp_monthly'] = 'Monthly';
$string['fp_navlinks'] = 'Menu links';
$string['fp_newsitemauthor'] = 'News item {$a} author';
$string['fp_newsitemdate'] = 'News item {$a} date';
$string['fp_newsitemimage'] = 'News item {$a} image';
$string['fp_newsitemsummary'] = 'News item {$a} summary';
$string['fp_newsitemtitle'] = 'News item {$a} title';
$string['fp_newsitemtitle_desc'] = 'Leave empty to hide this news item.';
$string['fp_newsitemurl'] = 'News item {$a} link';
$string['fp_offericon'] = 'Item {$a} icon';
$string['fp_offertext'] = 'Item {$a} text';
$string['fp_offertitle'] = 'Item {$a} title';
$string['fp_offertitle_desc'] = 'Leave empty to hide this item.';
$string['fp_partnerlogos'] = 'Partner logos';
$string['fp_partnerlogos_desc'] = 'Up to 12 logos, shown in file name order. The file name (without its extension) is used as the logo\'s alternative text.';
$string['fp_paths'] = 'Paths';
$string['fp_paths_desc'] = 'One path per line, as: Title|Label|Description|Link. The label is shown above the title, for example "12 courses".';
$string['fp_peryear'] = '/ year';
$string['fp_permonth'] = '/ month';
$string['fp_plancolour'] = 'Plan {$a} colour';
$string['fp_planfeatures'] = 'Plan {$a} features';
$string['fp_planfeatures_desc'] = 'One feature per line. Start a line with - to show the feature as not included.';
$string['fp_planname'] = 'Plan {$a} name';
$string['fp_planname_desc'] = 'Leave empty to hide this plan.';
$string['fp_planprice'] = 'Plan {$a} monthly price';
$string['fp_planprice_desc'] = 'A number without the currency symbol. 0 shows the plan as free. The yearly price is worked out from it.';
$string['fp_planurl'] = 'Plan {$a} link';
$string['fp_playvideo'] = 'Play video';
$string['fp_poweredby'] = 'Powered by';
$string['fp_pricingcurrency'] = 'Currency symbol';
$string['fp_pricingdiscount'] = 'Yearly discount (%)';
$string['fp_pricingdiscount_desc'] = 'The yearly price is twelve times the monthly price, less this percentage.';
$string['fp_pricingfeatured'] = 'Highlighted plan';
$string['fp_pricingfeatured_desc'] = 'The plan drawn raised, with a solid button.';
$string['fp_pricingyearlylabel'] = 'Yearly switch label';
$string['fp_sectiontext'] = 'Section text';
$string['fp_sectiontitle'] = 'Section title';
$string['fp_showsection'] = 'Show this section';
$string['fp_showsitecontent'] = 'Show the standard site home content';
$string['fp_showsitecontent_desc'] = 'Also show the content set up in Site administration > Site home > Site home settings (announcements, course lists and so on) under the landing page sections. It is always shown while editing.';
$string['fp_stats'] = 'Numbers';
$string['fp_stats_desc'] = 'One per line, as: Number|Label';
$string['fp_subscribetext'] = 'Subscribe text';
$string['fp_subscribetitle'] = 'Subscribe title';
$string['fp_subscribeurl'] = 'Subscribe form address';
$string['fp_subscribeurl_desc'] = 'The address the subscribe form sends the email address to (as a field called "email"), such as a mailing list sign-up URL. When empty, the form is not shown.';
$string['fp_tab'] = 'Front page';
$string['fp_tabfooter'] = 'Front page footer';
$string['fp_tabsections'] = 'Front page sections';
$string['fp_testimonialname'] = 'Testimonial {$a} name';
$string['fp_testimonialname_desc'] = 'Leave empty to hide this testimonial.';
$string['fp_testimonialquote'] = 'Testimonial {$a} quote';
$string['fp_testimonialrole'] = 'Testimonial {$a} role';
$string['fp_yearly'] = 'Yearly';
