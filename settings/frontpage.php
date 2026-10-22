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
 * Front page (site home landing page) settings, added to the theme settings as three tabs.
 *
 * Included from settings.php. The courses on the page come from the course catalogue; the settings here only choose
 * which. Everything else on the page is set here. The defaults are the sample content of the design.
 *
 * @package   theme_retani_studio
 * @copyright 2026 Retani
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

use theme_retani_studio\output\frontpage;

/** @var theme_retani_studio_admin_settingspage_tabs $settings */

$component = 'theme_retani_studio';
$prefix = $component . '/' . frontpage::PREFIX;

// Helpers, so that each setting is one line. A title string is "fp_<name>" unless one is given, and a description is
// only shown when the string "<title>_desc" exists.
$str = function(string $key, $a = null) use ($component): string {
    return get_string($key, $component, $a);
};
$desc = function(string $key, $a = null) use ($component): string {
    return get_string_manager()->string_exists($key . '_desc', $component) ? get_string($key . '_desc', $component, $a) : '';
};
$heading = function(admin_settingpage $page, string $name) use ($prefix, $str, $desc) {
    $page->add(new admin_setting_heading($prefix . 'heading_' . $name, $str('fp_heading_' . $name),
        $desc('fp_heading_' . $name)));
};
$checkbox = function(admin_settingpage $page, string $name, int $default = 1, ?string $title = null) use ($prefix, $str, $desc) {
    $title = $title ?? 'fp_' . $name;
    $page->add(new admin_setting_configcheckbox($prefix . $name, $str($title), $desc($title), $default));
};
$text = function(admin_settingpage $page, string $name, string $default = '', ?string $title = null, $a = null)
        use ($prefix, $str, $desc) {
    $title = $title ?? 'fp_' . $name;
    $page->add(new admin_setting_configtext($prefix . $name, $str($title, $a), $desc($title, $a), $default, PARAM_TEXT));
};
$link = function(admin_settingpage $page, string $name, string $default = '', ?string $title = null, $a = null)
        use ($prefix, $str, $desc) {
    $title = $title ?? 'fp_' . $name;
    $page->add(new admin_setting_configtext($prefix . $name, $str($title, $a), $desc($title, $a) ?: $str('fp_link_desc'),
        $default, PARAM_RAW_TRIMMED));
};
$textarea = function(admin_settingpage $page, string $name, string $default = '', ?string $title = null, $a = null,
        ?string $description = null) use ($prefix, $str, $desc) {
    $title = $title ?? 'fp_' . $name;
    $description = $description ?? $desc($title, $a);
    $page->add(new admin_setting_configtextarea($prefix . $name, $str($title, $a), $description, $default, PARAM_TEXT,
        60, 5));
};
$colour = function(admin_settingpage $page, string $name, string $default, ?string $title = null, $a = null)
        use ($prefix, $str, $desc) {
    $title = $title ?? 'fp_' . $name;
    $page->add(new admin_setting_configcolourpicker($prefix . $name, $str($title, $a), $desc($title, $a), $default));
};
$file = function(admin_settingpage $page, string $name, ?string $title = null, $a = null, int $maxfiles = 1)
        use ($prefix, $str, $desc) {
    $title = $title ?? 'fp_' . $name;
    $setting = new admin_setting_configstoredfile($prefix . $name, $str($title, $a), $desc($title, $a),
        frontpage::PREFIX . $name, 0, ['maxfiles' => $maxfiles, 'accepted_types' => ['web_image']]);
    // Theme files are served with the theme revision in their URL, so it changes when an image is replaced.
    $setting->set_updatedcallback('theme_reset_all_caches');
    $page->add($setting);
};
$select = function(admin_settingpage $page, string $name, string $default, array $choices, ?string $title = null, $a = null)
        use ($prefix, $str, $desc) {
    $title = $title ?? 'fp_' . $name;
    $page->add(new admin_setting_configselect($prefix . $name, $str($title, $a), $desc($title, $a), $default, $choices));
};
$lines = fn(array $rows): string => implode("\n", array_map(fn($row) => implode('|', (array) $row), $rows));

// Tab: front page — header, hero, offers and courses.
$page = new admin_settingpage('theme_retani_studio_frontpage', $str('fp_tab'));

$heading($page, 'general');
$checkbox($page, 'enabled');
$checkbox($page, 'showsitecontent', 0);
$colour($page, 'accentcolor', frontpage::PALETTE[0]);
$colour($page, 'herobgcolor', frontpage::PALETTE[1]);
$colour($page, 'footerbgcolor', frontpage::PALETTE[2]);

$heading($page, 'header');
$file($page, 'logo');
$text($page, 'brandname', 'Meridian');
$text($page, 'brandaccent', 'Bank Academy');
$textarea($page, 'navlinks', $lines([
    ['Home', '/'],
    ['Courses', '#courses'],
    ['Learning Paths', '#paths'],
    ['Plans', '#pricing'],
    ['News', '#news'],
]), null, null, $str('fp_linklines_desc'));
$text($page, 'contacttext', 'Contact');
$link($page, 'contacturl', '/user/contactsitesupport.php');

$heading($page, 'hero');
$text($page, 'herotitle', 'Build a banking career that grows with you');
$textarea($page, 'herotext', 'CIBN-aligned courses in operations, credit, compliance and digital banking, taught by ' .
    'practising bankers from our own branches and head office.');
$checkbox($page, 'herosearch');
$text($page, 'herosearchplaceholder', 'Search for a course');
$text($page, 'herobuttontext', 'Find a course');
$file($page, 'heroimage');

$heading($page, 'offers');
$checkbox($page, 'showoffers', 1, 'fp_showsection');
$text($page, 'offerstitle', 'Why train with us', 'fp_sectiontitle');
$textarea($page, 'offerstext', 'Practical training built around how Nigerian banks actually work, from the banking hall ' .
    'to the boardroom.', 'fp_sectiontext');
$icons = [];
foreach (array_keys(frontpage::ICONS) as $icon) {
    $icons[$icon] = $str('fp_icon_' . $icon);
}
$offers = [
    1 => ['Taught by practising bankers', 'Every course is led by branch managers, credit officers and compliance leads ' .
        'who do the job daily.', 'people'],
    2 => ['Recognised certification', 'CIBN-aligned courses with CPD credits and certificates employers across the ' .
        'industry recognise.', 'certificate'],
    3 => ['Learn on any device', 'Self-paced lessons, live virtual classes and offline downloads in the Moodle app.',
        'device'],
    4 => ['', '', 'chart'],
];
foreach ($offers as $i => [$title, $body, $icon]) {
    $text($page, "offer{$i}title", $title, 'fp_offertitle', $i);
    $textarea($page, "offer{$i}text", $body, 'fp_offertext', $i);
    $select($page, "offer{$i}icon", $icon, $icons, 'fp_offericon', $i);
}

$heading($page, 'courses');
$checkbox($page, 'showcourses', 1, 'fp_showsection');
$text($page, 'coursestitle', 'Popular Courses', 'fp_sectiontitle');
$select($page, 'coursessource', 'category', [
    'category' => $str('fp_coursessource_category'),
    'ids' => $str('fp_coursessource_ids'),
]);
$categories = [0 => $str('fp_allcategories')];
if ($ADMIN->fulltree) {
    $categories += core_course_category::make_categories_list();
}
$select($page, 'coursescategory', '0', $categories);
$select($page, 'coursessort', 'newest', [
    'newest' => $str('fp_coursessort_newest'),
    'startdate' => $str('fp_coursessort_startdate'),
    'fullname' => $str('fp_coursessort_fullname'),
    'sortorder' => $str('fp_coursessort_sortorder'),
]);
$text($page, 'courseids', '');
$counts = array_combine(range(3, frontpage::MAX_COURSES), range(3, frontpage::MAX_COURSES));
$select($page, 'coursescount', '6', $counts);
$checkbox($page, 'coursestabs');
$checkbox($page, 'coursesprice');
$text($page, 'coursesbutton1text', 'View all courses', 'fp_buttontextn', 1);
$link($page, 'coursesbutton1url', '/course/index.php', 'fp_buttonurln', 1);
$text($page, 'coursesbutton2text', 'Explore learning paths', 'fp_buttontextn', 2);
$link($page, 'coursesbutton2url', '#paths', 'fp_buttonurln', 2);
$settings->hide_if($prefix . 'coursescategory', $prefix . 'coursessource', 'eq', 'ids');
$settings->hide_if($prefix . 'coursessort', $prefix . 'coursessource', 'eq', 'ids');
$settings->hide_if($prefix . 'courseids', $prefix . 'coursessource', 'eq', 'category');

$settings->add($page);

// Tab: front page sections — numbers, learning paths, featured programme, plans, testimonials and FAQ.
$page = new admin_settingpage('theme_retani_studio_frontpage_sections', $str('fp_tabsections'));

$heading($page, 'stats');
$checkbox($page, 'showstats', 1, 'fp_showsection');
$textarea($page, 'stats', $lines([
    ['42,000', 'Bankers trained'],
    ['68', 'Courses'],
    ['35', 'Expert faculty'],
    ['120', 'Partner institutions'],
]));

$heading($page, 'paths');
$checkbox($page, 'showpaths', 1, 'fp_showsection');
$text($page, 'pathstitle', 'Learning Paths', 'fp_sectiontitle');
$textarea($page, 'paths', $lines([
    ['Graduate Trainee Programme', '12 courses', 'Foundations of banking, products, operations and ethics for new ' .
        'entrants.', '/course/index.php'],
    ['Branch Operations', '9 courses', 'Teller, customer service, cash and branch control for front-office staff.',
        '/course/index.php'],
    ['Credit & Risk Management', '11 courses', 'Credit appraisal, risk rating, recovery and portfolio management.',
        '/course/index.php'],
    ['Compliance & AML', '8 courses', 'KYC, AML/CFT, sanctions screening and regulatory reporting.', '/course/index.php'],
    ['Digital Banking & Fintech', '10 courses', 'Payments, cybersecurity, data and agency banking.', '/course/index.php'],
    ['Leadership & Management', '7 courses', 'Managing teams, sales targets and performance in a bank.',
        '/course/index.php'],
]));
$text($page, 'pathsbuttontext', 'View path', 'fp_buttontext');

$heading($page, 'featured');
$checkbox($page, 'showfeatured', 1, 'fp_showsection');
$text($page, 'featuredheading', 'Featured Certification', 'fp_sectiontitle');
$text($page, 'featuredtitle', 'Certified Credit Analyst Programme');
$textarea($page, 'featuredtext', 'A 12-week programme in financial statement analysis, cash-flow lending and credit ' .
    'risk rating, built on real Nigerian SME and corporate loan files.');
$textarea($page, 'featuredpoints', $lines([
    'Real loan files from SME and corporate lending',
    'Weekly live sessions with senior credit officers',
    'Final assessment and CPD-accredited certificate',
    'Mentorship from a relationship manager',
]));
$file($page, 'featuredimage');
$link($page, 'featuredvideourl', '', 'fp_featuredvideourl');
$text($page, 'featuredbuttontext', 'Apply now', 'fp_buttontext');
$link($page, 'featuredbuttonurl', '/course/index.php', 'fp_buttonurl');
$text($page, 'featuredpricelabel', 'Fee');
$text($page, 'featuredprice', '₦350,000');

$heading($page, 'pricing');
$checkbox($page, 'showpricing', 1, 'fp_showsection');
$text($page, 'pricingtitle', 'Membership Plans', 'fp_sectiontitle');
$text($page, 'pricingcurrency', '₦');
$text($page, 'pricingdiscount', '15');
$text($page, 'pricingyearlylabel', 'Yearly · save 15%');
$text($page, 'pricingbuttontext', 'Choose', 'fp_buttontext');
$select($page, 'pricingfeatured', '2', [1 => 1, 2 => 2, 3 => 3]);
$plans = [
    1 => ['Individual', '#E5656B', 15000, ['Access to 20 core courses', 'Certificates of completion',
        'Mobile and offline learning', '- Live virtual classes', '- Team reporting dashboard']],
    2 => ['Professional', '#2F80D1', 35000, ['Full course library', 'Certificates and CPD credits',
        'Mobile and offline learning', 'Live virtual classes', 'Exam preparation packs']],
    3 => ['Institution', '#3DBFA8', 250000, ['Up to 50 staff seats', 'Full course library', 'Team reporting dashboard',
        'Custom learning paths', 'Dedicated account manager']],
];
foreach ($plans as $i => [$name, $planscolour, $price, $features]) {
    $text($page, "plan{$i}name", $name, 'fp_planname', $i);
    $colour($page, "plan{$i}colour", $planscolour, 'fp_plancolour', $i);
    $text($page, "plan{$i}price", (string) $price, 'fp_planprice', $i);
    $textarea($page, "plan{$i}features", $lines($features), 'fp_planfeatures', $i);
    $link($page, "plan{$i}url", '/login/signup.php', 'fp_planurl', $i);
}

$heading($page, 'testimonials');
$checkbox($page, 'showtestimonials', 1, 'fp_showsection');
$testimonials = [
    1 => ['Oluwaseun Alade', 'Credit Analyst, Lagos', 'The credit analysis course used real loan files. Within a month ' .
        'I was writing appraisals my line manager signed off without changes.'],
    2 => ['Blessing Ibekwe', 'Customer Service Officer, Enugu', 'Branch Operations Essentials gave me the confidence to ' .
        'handle cash, complaints and account opening on my first posting.'],
    3 => ['Musa Sani', 'Compliance Officer, Abuja', 'The AML course is practical and current. The case studies mirror ' .
        'exactly what we see in transaction monitoring every day.'],
];
foreach ($testimonials as $i => [$name, $role, $quote]) {
    $text($page, "testimonial{$i}name", $name, 'fp_testimonialname', $i);
    $text($page, "testimonial{$i}role", $role, 'fp_testimonialrole', $i);
    $textarea($page, "testimonial{$i}quote", $quote, 'fp_testimonialquote', $i);
}

$heading($page, 'faq');
$checkbox($page, 'showfaq', 1, 'fp_showsection');
$text($page, 'faqtitle', 'Frequently Asked Questions', 'fp_sectiontitle');
$textarea($page, 'faqs', $lines([
    ['Who can enrol in these courses?', 'Our own staff, staff of partner banks and microfinance institutions, and ' .
        'individuals preparing for a banking career.'],
    ['Are the certificates recognised?', 'Courses are aligned to the CIBN curriculum and carry CPD credits. ' .
        'Certificates are issued after the final assessment.'],
    ['Can I learn while working?', 'Yes. Lessons are self-paced, live classes run in the evenings and recordings are ' .
        'available for every session.'],
    ['Is compliance training free for staff?', 'Mandatory courses such as AML/CFT and information security are free ' .
        'for all Meridian staff.'],
    ['How do I pay?', 'Pay by card, bank transfer or USSD. Institutions can be invoiced monthly or yearly.'],
    ['Can I study on my phone?', 'Yes. All courses work in the Moodle app on Android and iOS, including offline ' .
        'downloads for low-data areas.'],
]));

$settings->add($page);

// Tab: front page footer — news, partners, call to action and footer.
$page = new admin_settingpage('theme_retani_studio_frontpage_footer', $str('fp_tabfooter'));

$heading($page, 'news');
$checkbox($page, 'shownews', 1, 'fp_showsection');
$text($page, 'newstitle', 'Recent News', 'fp_sectiontitle');
$text($page, 'newsbuttontext', 'View all news', 'fp_buttontext');
$link($page, 'newsbuttonurl', '/mod/forum/index.php?id=' . SITEID, 'fp_buttonurl');
$news = [
    1 => ['Q4 Graduate Trainee intake now open', '16 Oct 2026', 'Academy',
        'Applications close 15 November for the next cohort of graduate trainees.'],
    2 => ['New course on open banking in Nigeria', '3 Oct 2026', 'Digital Banking',
        'Learn how APIs and customer-consented data are changing products.'],
    3 => ['Updated AML/CFT module released', '22 Sep 2026', 'Compliance',
        'Refreshed case studies reflect the latest regulatory guidance.'],
];
foreach ($news as $i => [$title, $date, $author, $summary]) {
    $text($page, "news{$i}title", $title, 'fp_newsitemtitle', $i);
    $text($page, "news{$i}date", $date, 'fp_newsitemdate', $i);
    $text($page, "news{$i}author", $author, 'fp_newsitemauthor', $i);
    $textarea($page, "news{$i}summary", $summary, 'fp_newsitemsummary', $i);
    $link($page, "news{$i}url", '', 'fp_newsitemurl', $i);
    $file($page, "news{$i}image", 'fp_newsitemimage', $i);
}

$heading($page, 'partners');
$checkbox($page, 'showpartners', 1, 'fp_showsection');
$text($page, 'partnerstitle', 'Accreditation & Partners', 'fp_sectiontitle');
$file($page, 'partnerlogos', null, null, 12);

$heading($page, 'cta');
$checkbox($page, 'showcta', 1, 'fp_showsection');
$text($page, 'ctatext', 'Start your next banking certification this quarter');
$text($page, 'ctabuttontext', 'Apply now', 'fp_buttontext');
$link($page, 'ctabuttonurl', '/login/signup.php', 'fp_buttonurl');

$heading($page, 'footer');
$footer = [
    1 => ['Quick links', [['About the academy', '#'], ['Courses', '/course/index.php'], ['Learning paths', '#paths'],
        ['Plans', '#pricing'], ['Certification', '#']]],
    2 => ['Learners', [['Learner portal', '/my/'], ['Training calendar', '/calendar/view.php'],
        ['Certificates', '/badges/mybadges.php'], ['Exam guides', '#'], ['Policies', '/admin/tool/policy/viewall.php']]],
];
foreach ($footer as $i => [$title, $links]) {
    $text($page, "footercol{$i}title", $title, 'fp_footercoltitle', $i);
    $textarea($page, "footercol{$i}links", $lines($links), 'fp_footercollinks', $i, $str('fp_linklines_desc'));
}
$text($page, 'subscribetitle', 'Subscribe today');
$textarea($page, 'subscribetext', 'New courses, exam dates and regulatory updates, once a month.');
$link($page, 'subscribeurl', '', 'fp_subscribeurl');
$text($page, 'subscribebuttontext', 'Subscribe', 'fp_buttontext');
$text($page, 'copyright', '© {year} {sitename}.');

$settings->add($page);
