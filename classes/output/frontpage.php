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

use context_course;
use context_system;
use core\url;
use core_course_category;
use core_course_list_element;
use moodle_page;
use renderer_base;

/**
 * The landing page shown as the site home (layout/frontpage.php).
 *
 * Everything on it is set in the "Front page" tabs of the theme settings. Text settings which have never been saved
 * use the defaults from the language file, and a text setting saved empty hides the element it fills. The course
 * cards, the courses menu, the counters and the news come from the site itself.
 *
 * @package    theme_retani_studio
 * @copyright  2026 Okeowo Aderemi
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class frontpage {
    /** @var string[] The sections of the page, in the order they are shown. */
    const SECTIONS = ['announcement', 'hero', 'features', 'courses', 'about', 'stats', 'instructors', 'testimonials',
        'teach', 'news', 'cta', 'sitecontent'];

    /** @var string[] The sections shown until the setting is saved: all but the standard site home content. */
    const DEFAULT_SECTIONS = ['announcement', 'hero', 'features', 'courses', 'about', 'stats', 'instructors',
        'testimonials', 'teach', 'news', 'cta'];

    /** @var int The number of feature cards under the hero. */
    const FEATURES = 3;

    /** @var int The number of counters in the statistics band. */
    const STATS = 3;

    /** @var int The number of instructors that can be set up. */
    const MAX_INSTRUCTORS = 6;

    /** @var int The number of testimonials that can be set up. */
    const MAX_TESTIMONIALS = 6;

    /** @var int[] The choices for the number of course cards. */
    const COURSE_COUNTS = [4, 8, 12, 16];

    /** @var int The number of top level categories in the courses menu. */
    const MENU_CATEGORIES = 5;

    /** @var int The number of links under each category of the courses menu. */
    const MENU_LINKS = 4;

    /** @var int Courses created within this many seconds carry the "New" badge. */
    const NEW_PERIOD = 30 * DAYSECS;

    /** @var string[] The social networks with a link setting, in the order they are shown. */
    const SOCIALS = ['facebook', 'x', 'youtube', 'instagram', 'linkedin'];

    /** @var \stdClass The theme settings. */
    protected \stdClass $settings;

    /** @var context_system */
    protected context_system $context;

    /**
     * Constructor.
     *
     * @param moodle_page $page The site home page.
     */
    public function __construct(
        /** @var moodle_page The site home page. */
        protected moodle_page $page,
    ) {
        $this->settings = $page->theme->settings ?? new \stdClass();
        $this->context = context_system::instance();
    }

    /**
     * Whether the landing page is drawn, rather than the standard site home.
     *
     * The landing page has no edit mode: it is shown whether or not editing is on, and is changed in the theme
     * settings. Turn it off to edit the blocks and content of the standard site home.
     *
     * @return bool
     */
    public function is_enabled(): bool {
        if (!($this->settings->fpenabled ?? true)) {
            return false;
        }
        return $this->page->pagetype === 'site-index';
    }

    /**
     * The value of a front page text setting.
     *
     * @param string $name The setting name, without the "fp" prefix.
     * @return string The setting, or its default from the language file if it has never been saved. Not escaped.
     */
    protected function text(string $name): string {
        $value = $this->settings->{"fp{$name}"} ?? null;
        if ($value === null) {
            $value = self::default_text($name);
        }
        $value = trim((string) $value);
        if ($value === '') {
            return '';
        }
        return format_string($value, true, ['context' => $this->context, 'escape' => false]);
    }

    /**
     * The default of a front page text setting.
     *
     * @param string $name The setting name, without the "fp" prefix.
     * @return string The default, or an empty string when the language file has none.
     */
    public static function default_text(string $name): string {
        $manager = get_string_manager();
        $key = "fp{$name}_default";
        return $manager->string_exists($key, 'theme_retani_studio') ? get_string($key, 'theme_retani_studio') : '';
    }

    /**
     * A link from a front page setting.
     *
     * @param string $name The setting name, without the "fp" prefix.
     * @return string|null An absolute URL, or null when the setting is empty or not a link.
     */
    protected function link(string $name): ?string {
        return self::resolve_url($this->text($name));
    }

    /**
     * Turns a link typed into a setting into an absolute URL.
     *
     * @param string $value A full URL, a path on this site starting with "/", or an anchor starting with "#".
     * @return string|null The URL, or null when the value is empty or not a link.
     */
    public static function resolve_url(string $value): ?string {
        $value = trim($value);
        if ($value === '') {
            return null;
        }
        if (str_starts_with($value, '#')) {
            return $value;
        }
        if (str_starts_with($value, '/') && !str_starts_with($value, '//')) {
            return (new url($value))->out(false);
        }
        $clean = clean_param($value, PARAM_URL);
        return $clean === '' ? null : $clean;
    }

    /**
     * The URL of an image uploaded to a front page setting.
     *
     * @param string $name The setting name, without the "fp" prefix.
     * @param string|null $fallback The bundled image (in pix/) to use when nothing has been uploaded.
     * @param renderer_base $output
     * @return string|null
     */
    protected function image(string $name, ?string $fallback, renderer_base $output): ?string {
        $url = $this->page->theme->setting_file_url("fp{$name}", "fp{$name}");
        if ($url) {
            return (string) $url;
        }
        return $fallback ? $output->image_url($fallback, 'theme')->out(false) : null;
    }

    /**
     * A number setting, kept within limits.
     *
     * @param string $name The setting name, without the "fp" prefix.
     * @param int $default Used when the setting has never been saved.
     * @param int $max
     * @return int
     */
    protected function count(string $name, int $default, int $max): int {
        $value = $this->settings->{"fp{$name}"} ?? $default;
        return max(0, min($max, (int) $value));
    }

    /**
     * The sections which are shown.
     *
     * @return array Section name => true.
     */
    protected function sections(): array {
        $value = $this->settings->fpsections ?? null;
        $sections = $value === null ? self::DEFAULT_SECTIONS : explode(',', $value);
        return array_fill_keys(array_intersect(self::SECTIONS, $sections), true);
    }

    /**
     * The eyebrow and heading of a section.
     *
     * @param string $section
     * @return array With tag, heading and hasheader.
     */
    protected function section_header(string $section): array {
        $tag = $this->text("{$section}tag");
        $heading = $this->text("{$section}heading");
        return [
            'tag' => $tag,
            'heading' => $heading,
            'hasheader' => $tag !== '' || $heading !== '',
        ];
    }

    /**
     * Context for theme_retani_studio/frontpage.
     *
     * @param renderer_base $output
     * @return array
     */
    public function export_for_template(renderer_base $output): array {
        $sections = $this->sections();
        // The courses are also needed for the featured course of the courses menu.
        $courses = $this->courses($output);

        $context = $this->export_chrome($output, $courses) + [
            'showsitecontent' => isset($sections['sitecontent']),
        ];

        if (isset($sections['hero'])) {
            $context['hero'] = $this->hero($output);
        }
        if (isset($sections['features'])) {
            $context['features'] = $this->features() ?: false;
        }
        if (isset($sections['courses']) && $courses) {
            $context['courses'] = $this->section_header('courses') + [
                'courses' => $courses,
                'filters' => $this->course_filters($courses),
                'allurl' => (new url('/course/index.php'))->out(false),
            ];
        }
        if (isset($sections['about'])) {
            $context['about'] = $this->about($output);
        }
        if (isset($sections['stats'])) {
            $context['stats'] = $this->stats();
        }
        if (isset($sections['instructors'])) {
            $context['instructors'] = $this->instructors($output);
        }
        if (isset($sections['testimonials'])) {
            $context['testimonials'] = $this->testimonials($output);
        }
        if (isset($sections['teach'])) {
            $context['teach'] = $this->teach($output);
        }
        if (isset($sections['news'])) {
            $context['news'] = $this->news($output);
        }
        if (isset($sections['cta'])) {
            $context['cta'] = $this->cta();
        }
        return $context;
    }

    /**
     * Context for the parts shared with the other Retani pages: the announcement bar, the header and the footer.
     *
     * @param renderer_base $output
     * @param array|null $courses The course cards, for the featured course of the courses menu. Loaded when null.
     * @return array With sitename, logourl, announcement, header and footer.
     */
    public function export_chrome(renderer_base $output, ?array $courses = null): array {
        global $SITE;

        $courses ??= $this->courses($output);
        $sitename = format_string($SITE->shortname, true, ['context' => context_course::instance(SITEID), 'escape' => false]);
        return [
            'sitename' => $sitename,
            'logourl' => $this->logo_url($output),
            'announcement' => isset($this->sections()['announcement']) ? ($this->text('announcement') ?: false) : false,
            'header' => $this->header($output, $courses),
            'footer' => $this->footer($output, $sitename),
        ];
    }

    /**
     * Whether the Retani course listing replaces the standard list of courses at /course/index.php.
     *
     * @return bool
     */
    public function is_course_listing_enabled(): bool {
        return (bool) ($this->settings->fpcourselisting ?? true);
    }

    /**
     * The logo for the header and footer.
     *
     * @param renderer_base $output
     * @return string|null The logo uploaded in the theme settings, else the site logo, else null for the site name.
     */
    protected function logo_url(renderer_base $output): ?string {
        $url = $this->page->theme->setting_file_url('logo', 'logo');
        if ($url) {
            return (string) $url;
        }
        $url = $output->get_logo_url(null, 80);
        return $url ? $url->out(false) : null;
    }

    /**
     * The header: navigation, the courses menu and, when not logged in, the login button.
     *
     * @param renderer_base $output
     * @param array $courses The course cards, the first of which is featured in the courses menu.
     * @return array
     */
    protected function header(renderer_base $output, array $courses): array {
        global $CFG;

        $primary = new \core\navigation\output\primary($this->page);
        $primarymenu = $primary->export_for_template($output);

        $links = [];
        foreach ($primarymenu['mobileprimarynav'] as $node) {
            $node = (array) $node;
            if (!empty($node['divider']) || empty($node['text'])) {
                continue;
            }
            $children = [];
            foreach ($node['children'] ?? [] as $child) {
                $child = (array) $child;
                if (!empty($child['divider']) || empty($child['text'])) {
                    continue;
                }
                $children[] = ['text' => $child['text'], 'url' => self::url_string($child['url'] ?? null)];
            }
            $links[] = [
                'text' => $node['text'],
                'url' => self::url_string($node['url'] ?? null),
                'isactive' => !empty($node['isactive']),
                'children' => $children,
                'haschildren' => !empty($children),
                'id' => \html_writer::random_id('retani-fp-menu-'),
            ];
        }
        $loggedin = isloggedin() && !isguestuser();
        $cansignup = !empty($CFG->registerauth) && is_enabled_auth($CFG->registerauth);

        return [
            // The courses menu goes after the first link, which is the site home.
            'firstlinks' => array_slice($links, 0, 1),
            'otherlinks' => array_slice($links, 1),
            'coursesmenu' => $this->courses_menu($courses),
            'langmenu' => $primarymenu['lang'] ?: false,
            'modetoggle' => self::mode_toggle(),
            'loginurl' => $loggedin ? false : get_login_url(),
            'loginlabel' => get_string($cansignup ? 'fploginsignup' : 'fplogin', 'theme_retani_studio'),
        ];
    }

    /**
     * The light and dark mode toggle of the header.
     *
     * Shown when colour modes are on for the site and "Light and dark mode toggle" is on. The choice is stored the
     * same way as the navbar's colour mode menu: as the user preference for people who are logged in, and in a cookie
     * for everybody, which the server reads for visitors (\theme_retani_studio\colour_mode::get_current_mode()).
     *
     * @return array|false Context for the toggle, or false when it is not shown.
     */
    protected static function mode_toggle(): array|false {
        if (!\theme_retani_studio\colour_mode::is_enabled() || !get_config('theme_retani_studio', 'fpmodetoggle')) {
            return false;
        }
        $mode = \theme_retani_studio\colour_mode::get_current_mode();
        return [
            // "Auto" is resolved in the browser, which corrects this when the device is dark.
            'dark' => $mode === \theme_retani_studio\colour_mode::DARK,
            'preference' => \theme_retani_studio\colour_mode::PREFERENCE,
            'cookieattributes' => \theme_retani_studio\colour_mode::get_cookie_attributes(),
            'canstore' => \theme_retani_studio\colour_mode::can_choose_mode(),
            'label' => get_string('fpmodetoggle_label', 'theme_retani_studio'),
        ];
    }

    /**
     * The courses menu: the top level categories, with their subcategories or courses, and a featured course.
     *
     * @param array $courses The course cards.
     * @return array|false False when there are no categories to show.
     */
    protected function courses_menu(array $courses): array|false {
        global $CFG, $DB;

        $columns = [];
        foreach (core_course_category::top()->get_children(['limit' => self::MENU_CATEGORIES]) as $category) {
            $name = $category->get_formatted_name();
            $links = [];
            foreach ($category->get_children(['limit' => self::MENU_LINKS]) as $child) {
                $links[] = [
                    'text' => $child->get_formatted_name(),
                    'url' => (new url('/course/index.php', ['categoryid' => $child->id]))->out(false),
                ];
            }
            if (!$links) {
                foreach ($category->get_courses(['limit' => self::MENU_LINKS, 'sort' => ['sortorder' => 1]]) as $course) {
                    $links[] = [
                        'text' => $course->get_formatted_name(),
                        'url' => (new url('/course/view.php', ['id' => $course->id]))->out(false),
                    ];
                }
            }
            $coursecount = $category->get_courses_count(['recursive' => true]);
            $columns[] = [
                'code' => get_string($coursecount == 1 ? 'cl:countone' : 'cl:count', 'theme_retani_studio',
                    number_format($coursecount)),
                'name' => $name,
                'url' => (new url('/course/index.php', ['categoryid' => $category->id]))->out(false),
                'links' => $links,
            ];
        }
        if (!$columns) {
            return false;
        }

        $coursecount = $DB->count_records_select('course', 'id <> :siteid AND visible = 1', ['siteid' => SITEID]);
        $usercount = $DB->count_records_select('user', 'deleted = 0 AND suspended = 0 AND confirmed = 1 AND id <> :guest',
            ['guest' => $CFG->siteguest ?? 0]);

        return [
            'id' => \html_writer::random_id('retani-fp-courses-'),
            'columns' => $columns,
            'featured' => $courses[0] ?? false,
            'summary' => get_string('fpmenusummary', 'theme_retani_studio', [
                'courses' => number_format($coursecount),
                'users' => number_format($usercount),
            ]),
            'allurl' => (new url('/course/index.php'))->out(false),
        ];
    }

    /**
     * The hero at the top of the page.
     *
     * @param renderer_base $output
     * @return array
     */
    protected function hero(renderer_base $output): array {
        return [
            'title' => $this->text('herotitle'),
            'text' => $this->text('herotext'),
            'button' => $this->text('herobutton'),
            'url' => $this->link('herourl') ?? (new url('/course/index.php'))->out(false),
            'image' => $this->image('heroimage', 'login/slide1', $output),
            'imagealt' => $this->text('heroimagealt'),
            'badge' => $this->badge('hero'),
        ];
    }

    /**
     * The badge on the image of a section.
     *
     * @param string $section
     * @return array|false
     */
    protected function badge(string $section): array|false {
        $value = $this->text("{$section}badgevalue");
        $label = $this->text("{$section}badgelabel");
        if ($value === '' && $label === '') {
            return false;
        }
        return ['value' => $value, 'label' => $label];
    }

    /**
     * The feature cards under the hero.
     *
     * @return array[]
     */
    protected function features(): array {
        $icons = ['clock', 'chat', 'shield'];
        $features = [];
        for ($i = 1; $i <= self::FEATURES; $i++) {
            $title = $this->text("feature{$i}title");
            $text = $this->text("feature{$i}text");
            if ($title === '' && $text === '') {
                continue;
            }
            $features[] = [
                'title' => $title,
                'text' => $text,
                'url' => $this->link("feature{$i}url"),
                'linktext' => get_string('fpmoreabout', 'theme_retani_studio'),
                'icon' . $icons[$i - 1] => true,
            ];
        }
        return $features;
    }

    /**
     * The course cards: the courses chosen in the settings, else the newest courses.
     *
     * @param renderer_base $output
     * @return array[]
     */
    protected function courses(renderer_base $output): array {
        global $DB;

        $count = (int) ($this->settings->fpcoursescount ?? 8);
        if (!in_array($count, self::COURSE_COUNTS)) {
            $count = 8;
        }

        $ids = array_filter(array_map('intval', preg_split('/[\s,]+/', (string) ($this->settings->fpcourseids ?? ''))));
        $list = [];
        if ($ids) {
            foreach (array_unique($ids) as $id) {
                if ($id == SITEID || !($course = $DB->get_record('course', ['id' => $id]))) {
                    continue;
                }
                if (!core_course_category::can_view_course_info($course)) {
                    continue;
                }
                $list[] = new core_course_list_element($course);
                if (count($list) >= $count) {
                    break;
                }
            }
        } else {
            $list = core_course_category::top()->get_courses([
                'recursive' => true,
                // Only cached fields can be sorted on: the newest courses have the highest IDs.
                'sort' => ['id' => -1],
                'limit' => $count,
            ]);
        }

        $cards = [];
        foreach ($list as $course) {
            $cards[] = $this->course_card($course, $output);
        }
        return $cards;
    }

    /**
     * One course card.
     *
     * @param core_course_list_element $course
     * @param renderer_base $output
     * @return array
     */
    protected function course_card(core_course_list_element $course, renderer_base $output): array {
        $context = context_course::instance($course->id);

        $image = \core_course\external\course_summary_exporter::get_course_image($course);
        if (!$image) {
            $image = $output->get_generated_image_for_id($course->id);
        }

        $students = count_enrolled_users($context, '', 0, true);
        $activities = 0;
        foreach (get_fast_modinfo($course->id)->get_cms() as $cm) {
            if ($cm->visible && !$cm->deletioninprogress && $cm->has_view()) {
                $activities++;
            }
        }

        $category = core_course_category::get($course->category, IGNORE_MISSING);

        return [
            'id' => $course->id,
            'name' => $course->get_formatted_name(),
            'url' => (new url('/course/view.php', ['id' => $course->id]))->out(false),
            'image' => $image,
            'categoryid' => $category ? $category->id : 0,
            'category' => $category ? $category->get_formatted_name() : '',
            'students' => get_string($students == 1 ? 'fpstudent' : 'fpstudents', 'theme_retani_studio',
                number_format($students)),
            'activities' => get_string($activities == 1 ? 'fpactivity' : 'fpactivities', 'theme_retani_studio',
                number_format($activities)),
            'price' => $this->course_price($course->id),
            'isnew' => $course->timecreated > time() - self::NEW_PERIOD,
            'viewlabel' => get_string('fpviewcourse', 'theme_retani_studio'),
        ];
    }

    /**
     * The fee for enrolling in a course, when it has an enabled payment enrolment method.
     *
     * @param int $courseid
     * @return string|false The lowest fee, formatted with its currency, or false when enrolment is not paid for.
     */
    protected function course_price(int $courseid): string|false {
        $best = null;
        foreach (enrol_get_instances($courseid, true) as $instance) {
            if (!in_array($instance->enrol, ['fee', 'paypal']) || !enrol_is_enabled($instance->enrol)) {
                continue;
            }
            $cost = (float) $instance->cost;
            if ($cost <= 0 || empty($instance->currency)) {
                continue;
            }
            if ($best === null || $cost < $best[0]) {
                $best = [$cost, $instance->currency];
            }
        }
        if ($best === null) {
            return false;
        }
        try {
            return \core_payment\helper::get_cost_as_string($best[0], $best[1]);
        } catch (\Throwable $e) {
            return format_float($best[0], 2) . ' ' . $best[1];
        }
    }

    /**
     * The category filters above the course cards: one for each category with a course on the page.
     *
     * @param array $courses The course cards.
     * @return array[]
     */
    protected function course_filters(array $courses): array {
        $categories = [];
        foreach ($courses as $course) {
            if ($course['categoryid'] && !isset($categories[$course['categoryid']])) {
                $categories[$course['categoryid']] = ['id' => $course['categoryid'], 'name' => $course['category']];
            }
        }
        // A single category filters nothing.
        return count($categories) > 1 ? array_values($categories) : [];
    }

    /**
     * The "about us" section.
     *
     * @param renderer_base $output
     * @return array
     */
    protected function about(renderer_base $output): array {
        $points = [];
        foreach (preg_split('/\R/', $this->text('aboutpoints')) as $point) {
            if (trim($point) !== '') {
                $points[] = ['text' => trim($point)];
            }
        }
        return $this->section_header('about') + [
            'text' => $this->text('abouttext'),
            'points' => $points,
            'button' => $this->text('aboutbutton'),
            'url' => $this->link('abouturl') ?? (new url('/course/index.php'))->out(false),
            'image' => $this->image('aboutimage', 'login/slide2', $output),
            'imagealt' => $this->text('aboutimagealt'),
            'badge' => $this->badge('about'),
        ];
    }

    /**
     * The statistics band.
     *
     * @return array|false
     */
    protected function stats(): array|false {
        $items = [];
        for ($i = 1; $i <= self::STATS; $i++) {
            $value = $this->text("stat{$i}value");
            $label = $this->text("stat{$i}label");
            if ($value !== '' || $label !== '') {
                $items[] = ['value' => $value, 'label' => $label];
            }
        }
        $heading = $this->text('statsheading');
        if (!$items && $heading === '') {
            return false;
        }
        return ['heading' => $heading, 'items' => $items];
    }

    /**
     * The instructors.
     *
     * @param renderer_base $output
     * @return array|false
     */
    protected function instructors(renderer_base $output): array|false {
        $count = $this->count('instructorscount', 4, self::MAX_INSTRUCTORS);
        $people = [];
        for ($i = 1; $i <= $count; $i++) {
            $name = $this->text("instructor{$i}name");
            if ($name === '') {
                continue;
            }
            $people[] = [
                'name' => $name,
                'role' => $this->text("instructor{$i}role"),
                'image' => $this->image("instructor{$i}image", null, $output),
                'initials' => self::initials($name),
                'offset' => $i % 3 == 2,
                'imagealt' => get_string('fpportraitof', 'theme_retani_studio', $name),
            ];
        }
        if (!$people) {
            return false;
        }
        return $this->section_header('instructors') + ['people' => $people];
    }

    /**
     * The testimonials.
     *
     * @param renderer_base $output
     * @return array|false
     */
    protected function testimonials(renderer_base $output): array|false {
        $count = $this->count('testimonialscount', 2, self::MAX_TESTIMONIALS);
        $items = [];
        for ($i = 1; $i <= $count; $i++) {
            $quote = $this->text("testimonial{$i}quote");
            if ($quote === '') {
                continue;
            }
            $name = $this->text("testimonial{$i}name");
            $items[] = [
                'quote' => $quote,
                'name' => $name,
                'role' => $this->text("testimonial{$i}role"),
                'image' => $this->image("testimonial{$i}image", null, $output),
                'initials' => self::initials($name),
            ];
        }
        if (!$items) {
            return false;
        }
        return $this->section_header('testimonials') + [
            'items' => $items,
            'hascontrols' => count($items) > 2,
            'id' => \html_writer::random_id('retani-fp-testimonials-'),
        ];
    }

    /**
     * The "become an instructor" section.
     *
     * @param renderer_base $output
     * @return array
     */
    protected function teach(renderer_base $output): array {
        $points = [];
        foreach ([1, 2] as $i) {
            $title = $this->text("teachpoint{$i}title");
            $text = $this->text("teachpoint{$i}text");
            if ($title !== '' || $text !== '') {
                $points[] = ['title' => $title, 'text' => $text];
            }
        }
        return $this->section_header('teach') + [
            'text' => $this->text('teachtext'),
            'points' => $points,
            'button' => $this->text('teachbutton'),
            'url' => $this->link('teachurl'),
            'image' => $this->image('teachimage', 'login/slide3', $output),
            'imagealt' => $this->text('teachimagealt'),
            'badge' => $this->badge('teach'),
        ];
    }

    /**
     * The latest posts of the site announcements forum.
     *
     * @param renderer_base $output
     * @return array|false False when there is no forum, the user cannot read it, or it has no posts.
     */
    protected function news(renderer_base $output): array|false {
        global $CFG, $DB;

        $count = $this->count('newscount', 3, 6);
        if (!$count || !($forum = $DB->get_record('forum', ['course' => SITEID, 'type' => 'news']))) {
            return false;
        }
        $modinfo = get_fast_modinfo(SITEID);
        $cm = $modinfo->instances['forum'][$forum->id] ?? null;
        if (!$cm || !$cm->uservisible) {
            return false;
        }
        $modcontext = \context_module::instance($cm->id);
        if (!has_capability('mod/forum:viewdiscussion', $modcontext)) {
            return false;
        }

        require_once($CFG->dirroot . '/mod/forum/lib.php');
        $discussions = forum_get_discussions($cm, '', true, -1, $count);
        if (!$discussions) {
            return false;
        }

        $fs = get_file_storage();
        $posts = [];
        foreach ($discussions as $discussion) {
            $image = null;
            foreach ($fs->get_area_files($modcontext->id, 'mod_forum', 'attachment', $discussion->id, 'filename', false)
                    as $file) {
                if ($file->is_valid_image()) {
                    $image = url::make_pluginfile_url($file->get_contextid(), 'mod_forum', 'attachment',
                        $file->get_itemid(), $file->get_filepath(), $file->get_filename())->out(false);
                    break;
                }
            }
            $posts[] = [
                'subject' => format_string($discussion->subject, true, ['context' => $modcontext, 'escape' => false]),
                'url' => (new url('/mod/forum/discuss.php', ['d' => $discussion->discussion]))->out(false),
                'date' => userdate($discussion->modified, get_string('strftimedate', 'langconfig')),
                'author' => fullname($discussion),
                'image' => $image,
                'pattern' => $output->get_generated_image_for_id($discussion->discussion),
            ];
        }

        return $this->section_header('news') + [
            'posts' => $posts,
            'allurl' => (new url('/mod/forum/view.php', ['f' => $forum->id]))->out(false),
            'alllabel' => $this->text('newsbutton'),
        ];
    }

    /**
     * The call to action band above the footer.
     *
     * @return array|false
     */
    protected function cta(): array|false {
        $heading = $this->text('ctaheading');
        if ($heading === '') {
            return false;
        }
        return [
            'heading' => $heading,
            'text' => $this->text('ctatext'),
            'button' => $this->text('ctabutton'),
            'url' => $this->link('ctaurl') ?? (new url('/course/index.php'))->out(false),
        ];
    }

    /**
     * The footer.
     *
     * @param renderer_base $output
     * @param string $sitename
     * @return array
     */
    protected function footer(renderer_base $output, string $sitename): array {
        global $SITE;

        $socials = [];
        foreach (self::SOCIALS as $network) {
            if ($url = $this->link("social{$network}")) {
                $socials[] = [
                    'url' => $url,
                    'label' => get_string("fpsocial{$network}", 'theme_retani_studio'),
                    'icon' . $network => true,
                ];
            }
        }

        $columns = [];
        foreach ([1, 2] as $i) {
            $links = self::parse_links($this->text("footercol{$i}links"));
            $title = $this->text("footercol{$i}title");
            if ($links) {
                $columns[] = ['title' => $title, 'links' => $links];
            }
        }

        $contacts = [];
        if (($address = $this->text('address')) !== '') {
            $contacts[] = ['text' => $address, 'iconaddress' => true];
        }
        if (($email = $this->text('email')) !== '' && validate_email($email)) {
            $contacts[] = ['text' => $email, 'url' => 'mailto:' . $email, 'iconemail' => true];
        }
        if (($phone = $this->text('phone')) !== '') {
            $contacts[] = ['text' => $phone, 'url' => 'tel:' . preg_replace('/[^\d+]/', '', $phone), 'iconphone' => true];
        }

        $copyright = $this->text('copyright');
        if ($copyright === '') {
            $copyright = get_string('copyright', 'theme_retani_studio', [
                'year' => userdate(time(), '%Y'),
                'sitename' => format_string($SITE->fullname, true, ['context' => context_course::instance(SITEID),
                    'escape' => false]),
            ]);
        } else {
            $copyright = str_replace('{year}', userdate(time(), '%Y'), $copyright);
        }

        return [
            'text' => $this->text('footertext'),
            'socials' => $socials,
            'columns' => $columns,
            'contacttitle' => $contacts ? $this->text('contacttitle') : '',
            'contacts' => $contacts,
            'copyright' => $copyright,
            'legallinks' => self::parse_links($this->text('legallinks')),
        ];
    }

    /**
     * A navigation URL as a string.
     *
     * @param url|string|null $url
     * @return string
     */
    protected static function url_string(url|string|null $url): string {
        if ($url instanceof url) {
            return $url->out(false);
        }
        return $url ? (string) $url : '#';
    }

    /**
     * Reads a list of links typed into a setting, one per line as "Label|URL".
     *
     * @param string $value
     * @return array[] Each with text and url.
     */
    public static function parse_links(string $value): array {
        $links = [];
        foreach (preg_split('/\R/', $value) as $line) {
            $parts = array_map('trim', explode('|', $line, 2));
            if ($parts[0] === '') {
                continue;
            }
            $url = isset($parts[1]) ? self::resolve_url($parts[1]) : null;
            $links[] = ['text' => $parts[0], 'url' => $url ?? '#'];
        }
        return $links;
    }

    /**
     * The initials of a name, shown when a person has no photo.
     *
     * @param string $name
     * @return string
     */
    protected static function initials(string $name): string {
        $initials = '';
        foreach (preg_split('/\s+/u', trim($name)) as $word) {
            if ($word !== '') {
                $initials .= \core_text::strtoupper(\core_text::substr($word, 0, 1));
            }
            if (\core_text::strlen($initials) >= 2) {
                break;
            }
        }
        return $initials;
    }
}
