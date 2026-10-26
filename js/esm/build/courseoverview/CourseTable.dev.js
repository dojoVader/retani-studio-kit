var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * The course table: sortable header, course rows, and the loading, empty and error states.
 *
 * @module     theme_retani_studio/courseoverview/CourseTable
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import CourseRow from "./CourseRow";
import { gridTemplate } from "./columns";
import { SortArrows } from "./icons";
const SKELETON_ROWS = 4;
function CourseTable({ rows, columns, loading, failed, search, sort, onSort, strings }) {
  const template = gridTemplate(columns);
  let body;
  if (loading && rows.length === 0) {
    body = Array.from({ length: SKELETON_ROWS }, (_, i) => /* @__PURE__ */ jsxDEV(
      "div",
      {
        className: "retani-courseoverview-row is-skeleton",
        "aria-hidden": "true",
        style: { gridTemplateColumns: template },
        children: columns.map((c) => /* @__PURE__ */ jsxDEV("span", {}, c.key, false, {
          fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseTable.tsx",
          lineNumber: 56,
          columnNumber: 37
        }, this))
      },
      i,
      false,
      {
        fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseTable.tsx",
        lineNumber: 54,
        columnNumber: 13
      },
      this
    ));
  } else if (failed) {
    body = /* @__PURE__ */ jsxDEV("div", { className: "retani-courseoverview-empty", role: "alert", children: strings.loadfailed }, void 0, false, {
      fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseTable.tsx",
      lineNumber: 60,
      columnNumber: 16
    }, this);
  } else if (rows.length === 0) {
    body = /* @__PURE__ */ jsxDEV("div", { className: "retani-courseoverview-empty", children: search.trim() ? strings.nomatch.replace("{$a}", search.trim()) : strings.nocourses }, void 0, false, {
      fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseTable.tsx",
      lineNumber: 63,
      columnNumber: 13
    }, this);
  } else {
    body = rows.map((row) => /* @__PURE__ */ jsxDEV(CourseRow, { row, columns, template, hiddenlabel: strings.hidden }, row.id, false, {
      fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseTable.tsx",
      lineNumber: 69,
      columnNumber: 13
    }, this));
  }
  return /* @__PURE__ */ jsxDEV(
    "div",
    {
      className: `retani-courseoverview-table${loading ? " is-loading" : ""}`,
      role: "table",
      "aria-busy": loading,
      children: [
        /* @__PURE__ */ jsxDEV("div", { className: "retani-courseoverview-row is-head", role: "row", style: { gridTemplateColumns: template }, children: columns.map((column) => {
          const direction = sort?.dir === 1 ? "asc" : "desc";
          const active = sort?.key === column.sort;
          const ariasort = direction === "asc" ? "ascending" : "descending";
          return /* @__PURE__ */ jsxDEV(
            "div",
            {
              role: "columnheader",
              "aria-sort": active ? ariasort : void 0,
              className: `retani-courseoverview-cell is-${column.key}${column.numeric ? " is-numeric" : ""}`,
              children: column.sort ? /* @__PURE__ */ jsxDEV(
                "button",
                {
                  type: "button",
                  className: `retani-courseoverview-sort${active ? ` is-${direction}` : ""}`,
                  title: strings.sortby.replace("{$a}", column.label),
                  onClick: () => onSort(column.sort),
                  children: [
                    column.label,
                    /* @__PURE__ */ jsxDEV(SortArrows, {}, void 0, false, {
                      fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseTable.tsx",
                      lineNumber: 92,
                      columnNumber: 37
                    }, this)
                  ]
                },
                void 0,
                true,
                {
                  fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseTable.tsx",
                  lineNumber: 85,
                  columnNumber: 33
                },
                this
              ) : column.label
            },
            column.key,
            false,
            {
              fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseTable.tsx",
              lineNumber: 82,
              columnNumber: 25
            },
            this
          );
        }) }, void 0, false, {
          fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseTable.tsx",
          lineNumber: 76,
          columnNumber: 13
        }, this),
        body
      ]
    },
    void 0,
    true,
    {
      fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseTable.tsx",
      lineNumber: 74,
      columnNumber: 9
    },
    this
  );
}
__name(CourseTable, "CourseTable");
export {
  CourseTable as default
};
//# sourceMappingURL=CourseTable.dev.js.map
