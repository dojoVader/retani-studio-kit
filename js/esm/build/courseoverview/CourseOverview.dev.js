var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * Course overview block content, drawn as the "Top Performance Courses" table from mockup/Retani Dashboard.dc.html.
 *
 * Mounted automatically via data-react-component="@moodle/lms/theme_retani_studio/courseoverview/CourseOverview"
 * by core/react_autoinit, from the {{#react}} helper in the theme's block_myoverview/main override.
 *
 * @module     theme_retani_studio/courseoverview/CourseOverview
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import CourseCards from "./CourseCards";
import CoursePager from "./CoursePager";
import CourseTable from "./CourseTable";
import CourseToolbar from "./CourseToolbar";
import { getColumns, sortRows } from "./columns";
import { saveFilterPreference, saveViewPreference } from "./services/courses";
import useCourses from "./useCourses";
const SEARCH_DELAY = 300;
const FALLBACK_FILTER = { key: "all", grouping: "all", label: "" };
function CourseOverview({
  filters,
  filter: initialfilter,
  view: initialview,
  views,
  sort: serversort,
  paging,
  showcategory,
  actions,
  strings
}) {
  const [filter, setFilter] = useState(
    () => filters.find((f) => f.key === initialfilter) ?? filters[0] ?? FALLBACK_FILTER
  );
  const [view, setView] = useState(initialview);
  const [searchtext, setSearchtext] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState(null);
  const [offsets, setOffsets] = useState([0]);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(searchtext);
      setOffsets([0]);
    }, SEARCH_DELAY);
    return () => window.clearTimeout(timer);
  }, [searchtext]);
  const offset = offsets[offsets.length - 1];
  const { rows, loading, failed, hasnext, nextoffset } = useCourses({
    filter,
    search,
    sort: serversort,
    limit: paging,
    offset
  });
  const columns = useMemo(() => getColumns(rows, showcategory, strings), [rows, showcategory, strings]);
  const sorted = useMemo(() => sortRows(rows, columns, sort), [rows, columns, sort]);
  const onFilter = useCallback((option) => {
    setFilter(option);
    setOffsets([0]);
    saveFilterPreference(option);
  }, []);
  const onView = useCallback((option) => {
    setView(option);
    saveViewPreference(option);
  }, []);
  const onSort = useCallback((key) => {
    setSort((current) => {
      if (current?.key !== key) {
        return { key, dir: -1 };
      }
      return { key, dir: current.dir === 1 ? -1 : 1 };
    });
  }, []);
  return /* @__PURE__ */ jsxDEV("div", { className: "retani-courseoverview", children: [
    /* @__PURE__ */ jsxDEV(
      CourseToolbar,
      {
        filters,
        filter,
        onFilter,
        search: searchtext,
        onSearch: setSearchtext,
        view,
        views,
        onView,
        actions,
        strings
      },
      void 0,
      false,
      {
        fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseOverview.tsx",
        lineNumber: 98,
        columnNumber: 13
      },
      this
    ),
    view === "card" ? /* @__PURE__ */ jsxDEV(CourseCards, { courses: rows, loading, failed, search, strings }, void 0, false, {
      fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseOverview.tsx",
      lineNumber: 111,
      columnNumber: 17
    }, this) : /* @__PURE__ */ jsxDEV(
      CourseTable,
      {
        rows: sorted,
        columns,
        loading,
        failed,
        search,
        sort,
        onSort,
        strings
      },
      void 0,
      false,
      {
        fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseOverview.tsx",
        lineNumber: 113,
        columnNumber: 17
      },
      this
    ),
    /* @__PURE__ */ jsxDEV(
      CoursePager,
      {
        page: offsets.length - 1,
        hasprevious: offsets.length > 1,
        hasnext,
        disabled: loading,
        onPrevious: () => setOffsets((o) => o.slice(0, -1)),
        onNext: () => setOffsets((o) => [...o, nextoffset]),
        strings
      },
      void 0,
      false,
      {
        fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseOverview.tsx",
        lineNumber: 124,
        columnNumber: 13
      },
      this
    )
  ] }, void 0, true, {
    fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseOverview.tsx",
    lineNumber: 97,
    columnNumber: 9
  }, this);
}
__name(CourseOverview, "CourseOverview");
export {
  CourseOverview as default
};
//# sourceMappingURL=CourseOverview.dev.js.map
