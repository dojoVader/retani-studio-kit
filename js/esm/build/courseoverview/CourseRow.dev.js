var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
/**
 * One course in the course overview table.
 *
 * @module     theme_retani_studio/courseoverview/CourseRow
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { isSet } from "./types";
const NONE = "\u2013";
const initials = /* @__PURE__ */ __name((fullname) => {
  const words = fullname.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return "";
  }
  const first = words[0][0];
  const last = words.length > 1 ? words[words.length - 1][0] : "";
  return (first + last).toUpperCase();
}, "initials");
const percent = /* @__PURE__ */ __name((value) => `${Math.round(value * 10) / 10}%`, "percent");
function LevelPill({ text }) {
  const accent = text.trim().toLowerCase() === "beginner";
  return /* @__PURE__ */ jsxDEV("span", { className: `retani-courseoverview-pill${accent ? " is-accent" : ""}`, children: [
    /* @__PURE__ */ jsxDEV("span", { className: "retani-courseoverview-pilldot", "aria-hidden": "true" }, void 0, false, {
      fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseRow.tsx",
      lineNumber: 64,
      columnNumber: 13
    }, this),
    text
  ] }, void 0, true, {
    fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseRow.tsx",
    lineNumber: 63,
    columnNumber: 9
  }, this);
}
__name(LevelPill, "LevelPill");
const cell = /* @__PURE__ */ __name((column, row, hiddenlabel) => {
  const details = row.details;
  switch (column.key) {
    case "code":
      return row.shortname;
    case "name":
      return /* @__PURE__ */ jsxDEV(Fragment, { children: [
        /* @__PURE__ */ jsxDEV("a", { className: "retani-courseoverview-name", href: row.viewurl, title: row.fullname, children: row.fullname }, void 0, false, {
          fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseRow.tsx",
          lineNumber: 86,
          columnNumber: 21
        }),
        !row.visible && /* @__PURE__ */ jsxDEV("span", { className: "retani-courseoverview-hidden", children: hiddenlabel }, void 0, false, {
          fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseRow.tsx",
          lineNumber: 87,
          columnNumber: 38
        })
      ] }, void 0, true, {
        fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseRow.tsx",
        lineNumber: 85,
        columnNumber: 17
      });
    case "level": {
      const text = column.source === "level" ? details?.level : row.coursecategory;
      return text ? /* @__PURE__ */ jsxDEV(LevelPill, { text }, void 0, false, {
        fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseRow.tsx",
        lineNumber: 92,
        columnNumber: 27
      }) : NONE;
    }
    case "teacher": {
      const teachers = details?.teachers ?? [];
      if (teachers.length === 0) {
        return NONE;
      }
      const [first] = teachers;
      const more = teachers.length - 1;
      return /* @__PURE__ */ jsxDEV("span", { className: "retani-courseoverview-teacher", title: teachers.map((t) => t.fullname).join(", "), children: [
        /* @__PURE__ */ jsxDEV("span", { className: "retani-courseoverview-avatar", "aria-hidden": "true", children: initials(first.fullname) }, void 0, false, {
          fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseRow.tsx",
          lineNumber: 103,
          columnNumber: 21
        }),
        /* @__PURE__ */ jsxDEV("span", { className: "retani-courseoverview-teachername", children: first.fullname }, void 0, false, {
          fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseRow.tsx",
          lineNumber: 104,
          columnNumber: 21
        }),
        more > 0 && /* @__PURE__ */ jsxDEV("span", { className: "retani-courseoverview-more", children: [
          "+",
          more
        ] }, void 0, true, {
          fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseRow.tsx",
          lineNumber: 105,
          columnNumber: 34
        })
      ] }, void 0, true, {
        fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseRow.tsx",
        lineNumber: 102,
        columnNumber: 17
      });
    }
    case "enrolled":
      return details?.enrolledcount ?? NONE;
    case "rate": {
      if (column.source === "completionrate") {
        const rate = details?.completionrate;
        return isSet(rate) ? percent(rate) : NONE;
      }
      return row.hasprogress && isSet(row.progress) ? percent(row.progress) : NONE;
    }
    default:
      return NONE;
  }
}, "cell");
function CourseRow({ row, columns, template, hiddenlabel }) {
  return /* @__PURE__ */ jsxDEV(
    "div",
    {
      className: `retani-courseoverview-row${row.visible ? "" : " is-dimmed"}`,
      role: "row",
      style: { gridTemplateColumns: template },
      children: columns.map((column) => /* @__PURE__ */ jsxDEV("div", { role: "cell", className: `retani-courseoverview-cell is-${column.key}${column.numeric ? " is-numeric" : ""}`, children: cell(column, row, hiddenlabel) }, column.key, false, {
        fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseRow.tsx",
        lineNumber: 141,
        columnNumber: 17
      }, this))
    },
    void 0,
    false,
    {
      fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseRow.tsx",
      lineNumber: 138,
      columnNumber: 9
    },
    this
  );
}
__name(CourseRow, "CourseRow");
export {
  CourseRow as default,
  initials
};
//# sourceMappingURL=CourseRow.dev.js.map
