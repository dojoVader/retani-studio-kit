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

use core\context\system as context_system;
use core\url;
use core_course_category;
use moodle_page;
use renderable;
use renderer_base;
use templatable;

/**
 * Data for the retractable left bar (theme_retani_studio/retani/left_bar).
 *
 * Builds the props handed to the theme_retani_studio/leftbar/LeftBar React component: the site brand, the course
 * category selector, the navigation menu and the user menu. Every link is checked against the current user's
 * capabilities here, so the component only ever renders what the user may open.
 *
 * @package    theme_retani_studio
 * @copyright  2026 Okeowo Aderemi
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class left_bar implements renderable, templatable {
    /** @var string User preference holding whether the bar is collapsed. */
    public const PREFERENCE = 'theme_retani_studio_leftbar_collapsed';

    /** @var string User preference holding whether the course outline is shown in place of the navigation menu. */
    public const OUTLINE_PREFERENCE = 'theme_retani_studio_leftbar_outline';

    /** @var int Maximum number of enrolled courses listed under "My courses". */
    protected const MAX_COURSES = 6;

    /** @var int Maximum number of categories listed in the category selector. */
    protected const MAX_CATEGORIES = 20;

    /**
     * Constructor.
     *
     * @param moodle_page $page The page the bar is rendered on.
     * @param bool $hascourseoutline Whether the page has a course index the bar can show as the course outline.
     */
    public function __construct(
        /** @var moodle_page The page the bar is rendered on. */
        protected moodle_page $page,
        /** @var bool Whether the page has a course index the bar can show as the course outline. */
        protected bool $hascourseoutline = false,
    ) {
    }

    /**
     * Whether the current user has collapsed the bar.
     *
     * @return bool
     */
    public static function is_collapsed(): bool {
        return (bool) get_user_preferences(self::PREFERENCE, false);
    }

    /**
     * Export the data for the template.
     *
     * @param renderer_base $output
     * @return array
     */
    public function export_for_template(renderer_base $output): array {
        global $SITE;

        $sitename = format_string($SITE->shortname, true, ['context' => context_system::instance(), 'escape' => false]);
        $logourl = $this->page->theme->setting_file_url('logo', 'logo');
        $navigation = $this->get_navigation();
        $footer = $this->get_footer_navigation();

        $props = [
            'collapsed' => self::is_collapsed(),
            'preference' => self::PREFERENCE,
            'brand' => [
                'name' => $sitename,
                'url' => (new url('/'))->out(false),
                'logourl' => $logourl ? (new url($logourl))->out(false) : null,
            ],
            'categories' => $this->get_categories(),
            'course' => $this->get_course(),
            'navigation' => $navigation,
            'footernavigation' => $footer,
            'user' => $this->get_user($output),
            'strings' => [
                'collapse' => get_string('leftbar:collapse', 'theme_retani_studio'),
                'expand' => get_string('leftbar:expand', 'theme_retani_studio'),
                'navigation' => get_string('leftbar:navigation', 'theme_retani_studio'),
                'switchcategory' => get_string('leftbar:switchcategory', 'theme_retani_studio'),
                'categories' => get_string('categories'),
                'coursecount' => get_string('leftbar:coursecount', 'theme_retani_studio'),
                'usermenu' => get_string('usermenu'),
                'currentcourse' => get_string('leftbar:currentcourse', 'theme_retani_studio'),
                'courseoutline' => get_string('leftbar:courseoutline', 'theme_retani_studio'),
            ],
        ];

        // Flattened links for the static fallback rendered before (or without) JavaScript.
        $fallbacklinks = array_map(
            fn(array $item): array => ['label' => $item['label'], 'url' => $item['url'], 'active' => $item['active']],
            array_merge($navigation, $footer),
        );

        // The same bar inside the mobile primary drawer: never collapsed, and without the course outline, since on
        // small screens the course index stays in its own drawer.
        $mobileprops = array_merge($props, ['collapsed' => false, 'mobile' => true, 'course' => null]);

        return [
            'reactprops' => json_encode($props, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
            'collapsed' => $props['collapsed'],
            'brand' => $props['brand'],
            'hascourseoutline' => $props['course'] !== null,
            'fallbacklinks' => $fallbacklinks,
            'mobile' => [
                'ismobile' => true,
                'reactprops' => json_encode($mobileprops, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
                'collapsed' => false,
                'brand' => $props['brand'],
                'hascourseoutline' => false,
                'fallbacklinks' => $fallbacklinks,
            ],
        ];
    }

    /**
     * Top-level course categories the user can see, with the one for the current page selected.
     *
     * @return array{items: array, selected: ?int, manageurl: ?string}
     */
    protected function get_categories(): array {
        $top = core_course_category::top();
        $children = $top->get_children(['limit' => self::MAX_CATEGORIES]);

        $current = null;
        if ($this->page->context->contextlevel >= CONTEXT_COURSECAT) {
            $category = $this->page->category;
            if ($category && !empty($category->path)) {
                // The path is "/<top-level id>/<child id>/...", so its first id is the top-level category.
                $current = (int) explode('/', trim($category->path, '/'))[0];
            }
        }

        $items = [];
        foreach (array_values($children) as $category) {
            $items[] = [
                'id' => (int) $category->id,
                'name' => $category->get_formatted_name(),
                'code' => (string) $category->idnumber,
                'coursecount' => (int) $category->get_courses_count(),
                'url' => (new url('/course/index.php', ['categoryid' => $category->id]))->out(false),
            ];
        }

        $systemcontext = context_system::instance();
        $canmanage = has_capability('moodle/category:manage', $systemcontext)
            || has_capability('moodle/course:create', $systemcontext);

        return [
            'items' => $items,
            'selected' => $current ?? ($items[0]['id'] ?? null),
            'manageurl' => $canmanage ? (new url('/course/management.php'))->out(false) : null,
            'managelabel' => $canmanage ? get_string('coursemgmt', 'admin') : null,
        ];
    }

    /**
     * The course the page belongs to, shown under the category selector as the toggle for the course outline.
     *
     * @return array|null Null when the page has no course index to show.
     */
    protected function get_course(): ?array {
        $course = $this->page->course;
        if (!$this->hascourseoutline || !$course || $course->id == SITEID) {
            return null;
        }
        return [
            'id' => (int) $course->id,
            'name' => format_string($course->fullname, true, ['context' => \core\context\course::instance($course->id)]),
            'url' => (new url('/course/view.php', ['id' => $course->id]))->out(false),
            'outlineopen' => (bool) get_user_preferences(self::OUTLINE_PREFERENCE, true),
            'preference' => self::OUTLINE_PREFERENCE,
        ];
    }

    /**
     * The main navigation menu.
     *
     * @return array
     */
    protected function get_navigation(): array {
        global $CFG, $SITE;

        $system = context_system::instance();
        $items = [];

        $items[] = $this->item('dashboard', get_string('myhome'), 'dashboard', new url('/my/'));
        $items[] = $this->item('calendar', get_string('calendar', 'calendar'), 'calendar',
            new url('/calendar/view.php', ['view' => 'month']));

        $courses = [];
        foreach (enrol_get_my_courses(['fullname'], 'visible DESC, sortorder ASC', self::MAX_COURSES) as $course) {
            $courses[] = $this->child(
                format_string($course->fullname, true, ['context' => \core\context\course::instance($course->id)]),
                new url('/course/view.php', ['id' => $course->id]),
            );
        }
        $courses[] = $this->child(get_string('viewallcourses'), new url('/my/courses.php'));
        $items[] = $this->item('mycourses', get_string('mycourses'), 'courses', new url('/my/courses.php'), $courses);

        if (has_capability('moodle/category:manage', $system) || has_capability('moodle/course:create', $system)) {
            $children = [
                $this->child(get_string('coursemgmt', 'admin'), new url('/course/management.php')),
            ];
            if (has_capability('moodle/course:create', $system)) {
                $children[] = $this->child(get_string('addnewcourse'),
                    new url('/course/edit.php', ['category' => core_course_category::get_default()->id]));
            }
            if (!empty($CFG->enablecourserequests) && has_capability('moodle/site:approvecourse', $system)) {
                $children[] = $this->child(get_string('coursespending'), new url('/course/pending.php'));
            }
            if (has_capability('moodle/restore:restorecourse', $system)) {
                $children[] = $this->child(get_string('restorecourse', 'admin'),
                    new url('/backup/restorefile.php', ['contextid' => $system->id]));
            }
            $items[] = $this->item('coursemanagement', get_string('leftbar:coursemanagement', 'theme_retani_studio'),
                'management', new url('/course/management.php'), $children);
        }

        if (has_any_capability(['moodle/user:update', 'moodle/user:create', 'moodle/user:delete'], $system)) {
            $children = [
                $this->child(get_string('userlist', 'admin'), new url('/admin/user.php')),
            ];
            if (has_capability('moodle/user:create', $system)) {
                $children[] = $this->child(get_string('addnewuser'), new url('/user/editadvanced.php', ['id' => -1]));
                $children[] = $this->child(get_string('uploadusers', 'tool_uploaduser'),
                    new url('/admin/tool/uploaduser/index.php'));
            }
            if (has_capability('moodle/user:update', $system)) {
                $children[] = $this->child(get_string('userbulk', 'admin'), new url('/admin/user/user_bulk.php'));
            }
            if (has_any_capability(['moodle/cohort:manage', 'moodle/cohort:view'], $system)) {
                $children[] = $this->child(get_string('cohorts', 'cohort'), new url('/cohort/index.php'));
            }
            if (has_capability('moodle/role:manage', $system)) {
                $children[] = $this->child(get_string('defineroles', 'role'), new url('/admin/roles/manage.php'));
            }
            $items[] = $this->item('users', get_string('users'), 'users', new url('/admin/user.php'), $children);
        }

        $items[] = $this->item('grades', get_string('grades'), 'grades', new url('/grade/report/overview/index.php'));

        if (has_capability('moodle/site:viewreports', $system)) {
            $children = [
                $this->child(get_string('pluginname', 'report_log'), new url('/report/log/index.php', ['id' => $SITE->id])),
                $this->child(get_string('pluginname', 'report_loglive'),
                    new url('/report/loglive/index.php', ['id' => $SITE->id])),
            ];
            if (!empty($CFG->enablecustomreports) && has_capability('moodle/reportbuilder:view', $system)) {
                $children[] = $this->child(get_string('customreports', 'core_reportbuilder'), new url('/reportbuilder/index.php'));
            }
            $items[] = $this->item('reports', get_string('reports'), 'reports',
                new url('/report/log/index.php', ['id' => $SITE->id]), $children);
        }

        if (!empty($CFG->enablebadges)) {
            $children = [
                $this->child(get_string('leftbar:mybadges', 'theme_retani_studio'), new url('/badges/mybadges.php')),
            ];
            if (has_capability('moodle/badges:configurecriteria', $system)) {
                $children[] = $this->child(get_string('managebadges', 'badges'), new url('/badges/index.php'));
            }
            $items[] = $this->item('badges', get_string('badges'), 'badges', new url('/badges/mybadges.php'), $children);
        }

        if (get_config('core_competency', 'enabled') && has_capability('moodle/competency:competencymanage', $system)) {
            $params = ['pagecontextid' => $system->id];
            $items[] = $this->item('competencies', get_string('competencies', 'core_competency'), 'competencies',
                new url('/admin/tool/lp/competencyframeworks.php', $params), [
                    $this->child(get_string('competencyframeworks', 'tool_lp'),
                        new url('/admin/tool/lp/competencyframeworks.php', $params)),
                    $this->child(get_string('templates', 'tool_lp'), new url('/admin/tool/lp/learningplans.php', $params)),
                ]);
        }

        return $items;
    }

    /**
     * Links pinned to the bottom of the bar: site administration and help.
     *
     * @return array
     */
    protected function get_footer_navigation(): array {
        $items = [];

        if (has_capability('moodle/site:config', context_system::instance())) {
            $categories = [
                'users' => get_string('users', 'admin'),
                'courses' => get_string('courses', 'admin'),
                'grades' => get_string('grades'),
                'modules' => get_string('plugins', 'admin'),
                'appearance' => get_string('appearance', 'admin'),
                'server' => get_string('server', 'admin'),
                'reports' => get_string('reports'),
                'development' => get_string('development', 'admin'),
            ];
            $children = [
                $this->child(get_string('notifications'), new url('/admin/index.php')),
                $this->child(get_string('registration', 'admin'), new url('/admin/registration/index.php')),
                $this->child(get_string('advancedfeatures', 'admin'),
                    new url('/admin/settings.php', ['section' => 'optionalsubsystems'])),
            ];

            // Declare the children to be null so we can pass the general link first

            $children = [];
            $children[] = $this->child('General', new url('/admin/search.php', ['#' => 'linkroot']));
            foreach ($categories as $category => $label) {
                $children[] = $this->child($label, new url('/admin/category.php', ['category' => $category]));
            }
            $items[] = $this->item('siteadmin', get_string('administrationsite'), 'admin', new url('/admin/search.php'),
                $children);
        }

        $items[] = $this->item('help', get_string('leftbar:help', 'theme_retani_studio'), 'help',
            new url(get_docs_url('')), [], true);

        return $items;
    }

    /**
     * The signed-in user and their user menu.
     *
     * @param renderer_base $output
     * @return array
     */
    protected function get_user(renderer_base $output): array {
        global $USER;

        $info = \core\user::get_user_navigation_info($USER, $this->page);

        $picture = new \user_picture($USER);
        $picture->size = 64;

        $items = [];
        $divider = false;
        foreach ($info->navitems ?? [] as $navitem) {
            if ($navitem->itemtype === 'divider') {
                $divider = true;
                continue;
            }
            if ($navitem->itemtype !== 'link' || empty($navitem->url)) {
                continue;
            }
            $identifier = (string) ($navitem->titleidentifier ?? '');
            $items[] = [
                'key' => $identifier ?: (string) count($items),
                'label' => $navitem->title,
                'url' => $navitem->url instanceof url ? $navitem->url->out(false) : (string) $navitem->url,
                'divider' => $divider || !empty($navitem->divider),
                'danger' => str_starts_with($identifier, 'logout'),
            ];
            $divider = false;
        }

        // As in the core user menu, separate the last two items (switch role / log out) from the rest.
        if (count($items) > 2) {
            $items[count($items) - 2]['divider'] = true;
        }

        $fullname = $info->metadata['realuserfullname'] ?? $info->metadata['userfullname'] ?? fullname($USER);

        return [
            'fullname' => $fullname,
            'email' => $USER->email ?? '',
            'role' => is_siteadmin() ? get_string('administrator') : '',
            'initials' => \core_text::strtoupper(
                \core_text::substr($USER->firstname ?? '', 0, 1) . \core_text::substr($USER->lastname ?? '', 0, 1)
            ),
            'avatarurl' => $picture->get_url($this->page, $output)->out(false),
            'hasavatar' => !empty($USER->picture),
            'items' => $items,
        ];
    }

    /**
     * Build a top-level navigation item.
     *
     * @param string $key Unique key.
     * @param string $label Visible label.
     * @param string $icon Icon name understood by the LeftBar component.
     * @param url $url Link target.
     * @param array $children Child links from {@see child()}.
     * @param bool $external Whether the link opens in a new tab.
     * @return array
     */
    protected function item(string $key, string $label, string $icon, url $url, array $children = [],
            bool $external = false): array {
        $childactive = in_array(true, array_column($children, 'active'), true);
        return [
            'key' => $key,
            'label' => $label,
            'icon' => $icon,
            'url' => $url->out(false),
            'active' => $childactive || $this->is_active($url),
            'external' => $external,
            'children' => $children,
        ];
    }

    /**
     * Build a child navigation link.
     *
     * @param string $label Visible label.
     * @param url $url Link target.
     * @return array
     */
    protected function child(string $label, url $url): array {
        return [
            'label' => $label,
            'url' => $url->out(false),
            'active' => $this->is_active($url, URL_MATCH_PARAMS),
        ];
    }

    /**
     * Whether the given URL points at the current page.
     *
     * @param url $url
     * @param int $match One of the URL_MATCH_* constants.
     * @return bool
     */
    protected function is_active(url $url, int $match = URL_MATCH_BASE): bool {
        if (!$this->page->has_set_url()) {
            return false;
        }
        if ($this->page->url->compare($url, $match)) {
            return true;
        }
        // Directory links such as /my/ are served by their index.php, which is what pages set as their URL.
        $path = $url->get_path(false);
        return str_ends_with($path, '/')
            && $this->page->url->compare(new url($path . 'index.php', $url->params()), $match);
    }
}
