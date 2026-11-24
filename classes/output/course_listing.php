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
use core\url;
use core_course_category;
use core_course_list_element;
use moodle_page;
use renderer_base;

/**
 * The list of courses at /course/index.php (layout/coursecategory.php).
 *
 * Lists the courses of the category being browsed and its subcategories, with a search by course name or teacher,
 * filters by teacher and by whether the course awards a certificate, a choice of sort order and pages of results.
 * Everything is read from the query string, so the page works without JavaScript.
 *
 * @package    theme_retani_studio
 * @copyright  2026 Okeowo Aderemi
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class course_listing {
    /** @var int Courses on each page. */
    const PER_PAGE = 10;

    /** @var string[] The sort orders. */
    const SORTS = ['name', 'newest', 'lastaccess'];

    /** @var string[] Activity modules which award a certificate. */
    const CERTIFICATE_MODULES = ['customcert', 'coursecertificate', 'certificate', 'simplecertificate', 'iomadcertificate'];

    /** @var int Pages linked on each side of the current one. */
    const PAGE_WINDOW = 2;

    /** @var core_course_category|null The category being browsed, or null for all courses. */
    protected ?core_course_category $category = null;

    /** @var string The search. */
    protected string $search;

    /** @var int[] The teachers to filter by. */
    protected array $teachers;

    /** @var string 'any', 'yes' or 'no'. */
    protected string $certificate;

    /** @var string One of self::SORTS. */
    protected string $sort;

    /** @var int The page, from 0. */
    protected int $pagenum;

    /**
     * Constructor. Reads the search, filters, sort and page from the query string.
     *
     * @param moodle_page $page The course listing page.
     */
    public function __construct(
        /** @var moodle_page The course listing page. */
        protected moodle_page $page,
    ) {
        $categoryid = optional_param('categoryid', 0, PARAM_INT);
        if ($categoryid && !core_course_category::is_simple_site()) {
            $this->category = core_course_category::get($categoryid, IGNORE_MISSING);
        }
        $this->search = trim(optional_param('q', '', PARAM_NOTAGS));
        $this->teachers = array_values(array_filter(optional_param_array('teacher', [], PARAM_INT)));
        $this->certificate = optional_param('cert', 'any', PARAM_ALPHA);
        if (!in_array($this->certificate, ['any', 'yes', 'no'])) {
            $this->certificate = 'any';
        }
        $this->sort = optional_param('sort', 'name', PARAM_ALPHA);
        if (!in_array($this->sort, self::SORTS) || ($this->sort === 'lastaccess' && !self::is_signed_in())) {
            $this->sort = 'name';
        }
        $this->pagenum = max(0, optional_param('page', 0, PARAM_INT));
    }

    /**
     * Whether this page is the course listing, which this class replaces.
     *
     * @param moodle_page $page
     * @return bool
     */
    public static function applies_to(moodle_page $page): bool {
        return $page->has_set_url() && $page->url->get_path(false) === '/course/index.php';
    }

    /**
     * Whether the user is signed in to an account of their own.
     *
     * @return bool
     */
    protected static function is_signed_in(): bool {
        return isloggedin() && !isguestuser();
    }

    /**
     * Context for theme_retani_studio/course_listing, without the shared header and footer.
     *
     * @param renderer_base $output
     * @return array
     */
    public function export_for_template(renderer_base $output): array {
        $all = $this->load_courses();
        $certificates = $this->certificate_courses(array_keys($all));

        // The teachers of all the courses, for the filter.
        $teachers = [];
        foreach ($all as $course) {
            foreach ($this->contacts($course) as $id => $name) {
                $teachers[$id] = $name;
            }
        }
        \core_collator::asort($teachers);

        $courses = array_filter($all, fn(core_course_list_element $course) => $this->matches($course, $certificates));
        $courses = $this->sorted($courses);

        $total = count($courses);
        $pages = max(1, (int) ceil($total / self::PER_PAGE));
        $this->pagenum = min($this->pagenum, $pages - 1);
        $shown = array_slice($courses, $this->pagenum * self::PER_PAGE, self::PER_PAGE);

        $cards = [];
        foreach ($shown as $course) {
            $cards[] = $this->card($course, isset($certificates[$course->id]), $output);
        }

        $title = $this->category ? $this->category->get_formatted_name()
            : get_string('cl:allcourses', 'theme_retani_studio');

        return [
            'title' => $title,
            'intro' => $this->intro(),
            'breadcrumbs' => $this->breadcrumbs(),
            'actionurl' => (new url('/course/index.php'))->out(false),
            'categoryid' => $this->category?->id ?: false,
            'search' => $this->search,
            'teachers' => array_map(fn($id, $name) => [
                'id' => $id,
                'name' => $name,
                'checked' => in_array($id, $this->teachers),
            ], array_keys($teachers), $teachers),
            'hasteachers' => count($teachers) > 0,
            'selectedteachers' => array_map(fn($id) => ['id' => $id], $this->teachers),
            'certificate' => [
                ['value' => 'any', 'label' => get_string('cl:any', 'theme_retani_studio'), 'checked' => $this->certificate === 'any'],
                ['value' => 'yes', 'label' => get_string('yes'), 'checked' => $this->certificate === 'yes'],
                ['value' => 'no', 'label' => get_string('no'), 'checked' => $this->certificate === 'no'],
            ],
            'certificatevalue' => $this->certificate,
            'sorts' => array_values(array_map(fn($sort) => [
                'value' => $sort,
                'label' => get_string("cl:sort{$sort}", 'theme_retani_studio'),
                'selected' => $this->sort === $sort,
            ], array_filter(self::SORTS, fn($sort) => $sort !== 'lastaccess' || self::is_signed_in()))),
            'sortvalue' => $this->sort,
            'count' => get_string($total == 1 ? 'cl:countone' : 'cl:count', 'theme_retani_studio', $total),
            'courses' => $cards,
            'hascourses' => !empty($cards),
            'isfiltered' => $this->search !== '' || $this->teachers || $this->certificate !== 'any',
            'clearurl' => $this->url([], true)->out(false),
            'pagination' => $this->pagination($pages),
            'manageurl' => $this->manage_url(),
        ];
    }

    /**
     * The text under the title.
     *
     * @return string
     */
    protected function intro(): string {
        global $SITE;
        if ($this->category && trim((string) $this->category->description) !== '') {
            $context = $this->category->get_context();
            $description = file_rewrite_pluginfile_urls($this->category->description, 'pluginfile.php', $context->id,
                'coursecat', 'description', null);
            return shorten_text(html_to_text(format_text($description, $this->category->descriptionformat,
                ['context' => $context]), 0, false), 240);
        }
        return get_string('cl:intro', 'theme_retani_studio',
            format_string($SITE->shortname, true, ['context' => context_course::instance(SITEID), 'escape' => false]));
    }

    /**
     * The breadcrumb trail: home, courses and the categories down to the one being browsed.
     *
     * @return array[] Each with text and url; the last has no url.
     */
    protected function breadcrumbs(): array {
        $crumbs = [
            ['text' => \core_text::strtolower(get_string('home')), 'url' => (new url('/', ['redirect' => 0]))->out(false)],
        ];
        $crumbs[] = ['text' => \core_text::strtolower(get_string('courses')),
            'url' => $this->category ? (new url('/course/index.php'))->out(false) : null];
        if ($this->category) {
            foreach ($this->category->get_parents() as $parentid) {
                if (!$parent = core_course_category::get($parentid, IGNORE_MISSING)) {
                    continue;
                }
                $crumbs[] = [
                    'text' => $parent->get_formatted_name(),
                    'url' => (new url('/course/index.php', ['categoryid' => $parent->id]))->out(false),
                ];
            }
            $crumbs[] = ['text' => $this->category->get_formatted_name(), 'url' => null];
        }
        $last = count($crumbs) - 1;
        foreach ($crumbs as $i => &$crumb) {
            $crumb['last'] = $i === $last;
        }
        return $crumbs;
    }

    /**
     * The courses of the category being browsed and its subcategories, which the user can see.
     *
     * @return core_course_list_element[] Indexed by course id.
     */
    protected function load_courses(): array {
        $category = $this->category ?? core_course_category::top();
        $courses = [];
        foreach ($category->get_courses(['recursive' => true, 'coursecontacts' => true, 'summary' => true]) as $course) {
            $courses[$course->id] = $course;
        }
        return $courses;
    }

    /**
     * The courses, among the given ones, with a visible activity which awards a certificate.
     *
     * @param int[] $courseids
     * @return array Course id => true.
     */
    protected function certificate_courses(array $courseids): array {
        global $DB;
        if (!$courseids) {
            return [];
        }
        [$modsql, $modparams] = $DB->get_in_or_equal(self::CERTIFICATE_MODULES, SQL_PARAMS_NAMED, 'mod');
        [$coursesql, $courseparams] = $DB->get_in_or_equal($courseids, SQL_PARAMS_NAMED, 'course');
        $ids = $DB->get_fieldset_sql("
            SELECT DISTINCT cm.course
              FROM {course_modules} cm
              JOIN {modules} m ON m.id = cm.module
             WHERE m.name $modsql AND m.visible = 1 AND cm.visible = 1 AND cm.deletioninprogress = 0
                   AND cm.course $coursesql", $modparams + $courseparams);
        return array_fill_keys($ids, true);
    }

    /**
     * The teachers (course contacts) of a course.
     *
     * @param core_course_list_element $course
     * @return string[] User id => full name.
     */
    protected function contacts(core_course_list_element $course): array {
        $contacts = [];
        foreach ($course->get_course_contacts() as $id => $contact) {
            $contacts[$id] = $contact['username'];
        }
        return $contacts;
    }

    /**
     * Whether a course matches the search and the filters.
     *
     * @param core_course_list_element $course
     * @param array $certificates Course id => true, for the courses which award a certificate.
     * @return bool
     */
    protected function matches(core_course_list_element $course, array $certificates): bool {
        $contacts = $this->contacts($course);
        if ($this->teachers && !array_intersect($this->teachers, array_keys($contacts))) {
            return false;
        }
        $hascertificate = isset($certificates[$course->id]);
        if (($this->certificate === 'yes' && !$hascertificate) || ($this->certificate === 'no' && $hascertificate)) {
            return false;
        }
        if ($this->search === '') {
            return true;
        }
        $haystack = implode("\n", array_merge([$course->get_formatted_name(), $course->shortname, $course->idnumber],
            array_values($contacts)));
        return \core_text::strpos(\core_text::strtolower($haystack), \core_text::strtolower($this->search)) !== false;
    }

    /**
     * The courses in the chosen order.
     *
     * @param core_course_list_element[] $courses
     * @return core_course_list_element[]
     */
    protected function sorted(array $courses): array {
        global $DB, $USER;

        $courses = array_values($courses);
        switch ($this->sort) {
            case 'newest':
                // The newest courses have the highest IDs.
                usort($courses, fn($a, $b) => $b->id <=> $a->id);
                break;
            case 'lastaccess':
                $access = $DB->get_records_menu('user_lastaccess', ['userid' => $USER->id], '', 'courseid, timeaccess');
                usort($courses, fn($a, $b) => (($access[$b->id] ?? 0) <=> ($access[$a->id] ?? 0))
                    ?: strcmp($a->get_formatted_name(), $b->get_formatted_name()));
                break;
            default:
                $names = [];
                foreach ($courses as $i => $course) {
                    $names[$i] = $course->get_formatted_name();
                }
                \core_collator::asort($names);
                $courses = array_map(fn($i) => $courses[$i], array_keys($names));
        }
        return $courses;
    }

    /**
     * One course card.
     *
     * @param core_course_list_element $course
     * @param bool $hascertificate
     * @param renderer_base $output
     * @return array
     */
    protected function card(core_course_list_element $course, bool $hascertificate, renderer_base $output): array {
        $context = context_course::instance($course->id);
        $image = \core_course\external\course_summary_exporter::get_course_image($course)
            ?: $output->get_generated_image_for_id($course->id);

        $summary = '';
        if ($course->has_summary()) {
            $text = file_rewrite_pluginfile_urls($course->summary, 'pluginfile.php', $context->id, 'course', 'summary',
                null);
            $summary = trim(shorten_text(html_to_text(format_text($text, $course->summaryformat,
                ['context' => $context]), 0, false), 220));
        }

        return [
            'id' => $course->id,
            'code' => format_string($course->shortname, true, ['context' => $context, 'escape' => false]),
            'name' => $course->get_formatted_name(),
            'url' => (new url('/course/view.php', ['id' => $course->id]))->out(false),
            'image' => $image,
            'summary' => $summary,
            'teachers' => implode(', ', $this->contacts($course)),
            'certificate' => get_string($hascertificate ? 'cl:certificateyes' : 'cl:certificateno', 'theme_retani_studio'),
            'hidden' => !$course->visible,
        ];
    }

    /**
     * The address of this listing with the current search, filters and sort.
     *
     * @param array $params Parameters to change.
     * @param bool $clear Leave out the search and filters, keeping the category and the sort.
     * @return url
     */
    protected function url(array $params = [], bool $clear = false): url {
        $url = new url('/course/index.php');
        if ($this->category) {
            $url->param('categoryid', $this->category->id);
        }
        if (!$clear) {
            if ($this->search !== '') {
                $url->param('q', $this->search);
            }
            foreach ($this->teachers as $i => $teacher) {
                $url->param("teacher[{$i}]", $teacher);
            }
            if ($this->certificate !== 'any') {
                $url->param('cert', $this->certificate);
            }
        }
        if ($this->sort !== 'name') {
            $url->param('sort', $this->sort);
        }
        foreach ($params as $name => $value) {
            $url->param($name, $value);
        }
        return $url;
    }

    /**
     * The page links.
     *
     * @param int $pages The number of pages.
     * @return array|false False when there is a single page.
     */
    protected function pagination(int $pages): array|false {
        if ($pages <= 1) {
            return false;
        }
        $links = [];
        $previous = null;
        for ($i = 0; $i < $pages; $i++) {
            $near = abs($i - $this->pagenum) <= self::PAGE_WINDOW;
            if ($i !== 0 && $i !== $pages - 1 && !$near) {
                continue;
            }
            if ($previous !== null && $i - $previous > 1) {
                $links[] = ['gap' => true];
            }
            $links[] = [
                'number' => $i + 1,
                'url' => $this->url(['page' => $i])->out(false),
                'current' => $i === $this->pagenum,
            ];
            $previous = $i;
        }
        return [
            'links' => $links,
            'previousurl' => $this->pagenum > 0 ? $this->url(['page' => $this->pagenum - 1])->out(false) : false,
            'nexturl' => $this->pagenum < $pages - 1 ? $this->url(['page' => $this->pagenum + 1])->out(false) : false,
        ];
    }

    /**
     * The course management page, for users who can manage courses or categories here.
     *
     * @return string|false
     */
    protected function manage_url(): string|false {
        $context = $this->category ? $this->category->get_context() : \context_system::instance();
        if (!has_any_capability(['moodle/category:manage', 'moodle/course:create'], $context)) {
            return false;
        }
        $params = $this->category ? ['categoryid' => $this->category->id] : [];
        return (new url('/course/management.php', $params))->out(false);
    }
}
