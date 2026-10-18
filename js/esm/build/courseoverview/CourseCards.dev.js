var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * The course card grid, from the "Course overview" card view in mockup/Retani Home.dc.html.
 *
 * @module     theme_retani_studio/courseoverview/CourseCards
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { Icon, PATHS } from "./icons";
import { isSet } from "./types";
const SEGMENTS = 30;
const SKELETON_CARDS = 4;
function SegmentBar({ progress }) {
  const filled = progress === null ? 0 : Math.round(progress / 100 * SEGMENTS);
  return /* @__PURE__ */ jsxDEV("div", { className: "retani-courseoverview-segments", "aria-hidden": "true", children: Array.from({ length: SEGMENTS }, (_, i) => /* @__PURE__ */ jsxDEV("span", { className: i < filled ? "is-filled" : void 0 }, i, false, {
    fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseCards.tsx",
    lineNumber: 45,
    columnNumber: 55
  }, this)) }, void 0, false, {
    fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseCards.tsx",
    lineNumber: 44,
    columnNumber: 9
  }, this);
}
__name(SegmentBar, "SegmentBar");
function CourseCard({ course, strings }) {
  const progress = course.hasprogress && isSet(course.progress) ? Math.round(course.progress) : null;
  const teacher = course.details?.teachers[0]?.fullname;
  const meta = [course.coursecategory, teacher].filter(Boolean).join(" \xB7 ");
  const progresslabel = progress === null ? strings.noprogress : strings.completepercent.replace("{$a}", String(progress));
  return /* @__PURE__ */ jsxDEV("article", { className: `retani-courseoverview-card${course.visible ? "" : " is-dimmed"}`, children: [
    /* @__PURE__ */ jsxDEV(
      "a",
      {
        className: "retani-courseoverview-cardimage",
        href: course.viewurl,
        tabIndex: -1,
        "aria-hidden": "true",
        style: { backgroundImage: `url("${course.courseimage}")` },
        children: /* @__PURE__ */ jsxDEV("span", { className: "retani-courseoverview-badge", children: course.shortname }, void 0, false, {
          fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseCards.tsx",
          lineNumber: 68,
          columnNumber: 17
        }, this)
      },
      void 0,
      false,
      {
        fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseCards.tsx",
        lineNumber: 66,
        columnNumber: 13
      },
      this
    ),
    /* @__PURE__ */ jsxDEV("div", { className: "retani-courseoverview-cardbody", children: [
      /* @__PURE__ */ jsxDEV("h3", { className: "retani-courseoverview-cardtitle", children: /* @__PURE__ */ jsxDEV("a", { href: course.viewurl, children: course.fullname }, void 0, false, {
        fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseCards.tsx",
        lineNumber: 72,
        columnNumber: 21
      }, this) }, void 0, false, {
        fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseCards.tsx",
        lineNumber: 71,
        columnNumber: 17
      }, this),
      meta && /* @__PURE__ */ jsxDEV("span", { className: "retani-courseoverview-cardmeta", children: [
        /* @__PURE__ */ jsxDEV(Icon, { path: PATHS.folder, size: 12, strokeWidth: 2 }, void 0, false, {
          fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseCards.tsx",
          lineNumber: 76,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ jsxDEV("span", { children: meta }, void 0, false, {
          fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseCards.tsx",
          lineNumber: 77,
          columnNumber: 25
        }, this)
      ] }, void 0, true, {
        fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseCards.tsx",
        lineNumber: 75,
        columnNumber: 21
      }, this),
      !course.visible && /* @__PURE__ */ jsxDEV("span", { className: "retani-courseoverview-hidden", children: strings.hidden }, void 0, false, {
        fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseCards.tsx",
        lineNumber: 80,
        columnNumber: 37
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "retani-courseoverview-cardprogress", children: [
        /* @__PURE__ */ jsxDEV("span", { children: progresslabel }, void 0, false, {
          fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseCards.tsx",
          lineNumber: 82,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV(SegmentBar, { progress }, void 0, false, {
          fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseCards.tsx",
          lineNumber: 83,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseCards.tsx",
        lineNumber: 81,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("a", { className: "retani-courseoverview-enter", href: course.viewurl, children: [
        strings.entercourse,
        /* @__PURE__ */ jsxDEV("span", { className: "visually-hidden", children: [
          ": ",
          course.fullname
        ] }, void 0, true, {
          fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseCards.tsx",
          lineNumber: 87,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseCards.tsx",
        lineNumber: 85,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseCards.tsx",
      lineNumber: 70,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseCards.tsx",
    lineNumber: 65,
    columnNumber: 9
  }, this);
}
__name(CourseCard, "CourseCard");
function CourseCards({ courses, loading, failed, search, strings }) {
  if (loading && courses.length === 0) {
    return /* @__PURE__ */ jsxDEV("div", { className: "retani-courseoverview-cards", "aria-busy": "true", children: Array.from({ length: SKELETON_CARDS }, (_, i) => /* @__PURE__ */ jsxDEV("div", { className: "retani-courseoverview-card is-skeleton", "aria-hidden": "true", children: [
      /* @__PURE__ */ jsxDEV("span", { className: "retani-courseoverview-cardimage" }, void 0, false, {
        fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseCards.tsx",
        lineNumber: 114,
        columnNumber: 25
      }, this),
      /* @__PURE__ */ jsxDEV("span", { className: "retani-courseoverview-cardbody", children: [
        /* @__PURE__ */ jsxDEV("span", {}, void 0, false, {
          fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseCards.tsx",
          lineNumber: 115,
          columnNumber: 74
        }, this),
        /* @__PURE__ */ jsxDEV("span", {}, void 0, false, {
          fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseCards.tsx",
          lineNumber: 115,
          columnNumber: 82
        }, this),
        /* @__PURE__ */ jsxDEV("span", {}, void 0, false, {
          fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseCards.tsx",
          lineNumber: 115,
          columnNumber: 90
        }, this)
      ] }, void 0, true, {
        fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseCards.tsx",
        lineNumber: 115,
        columnNumber: 25
      }, this)
    ] }, i, true, {
      fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseCards.tsx",
      lineNumber: 113,
      columnNumber: 21
    }, this)) }, void 0, false, {
      fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseCards.tsx",
      lineNumber: 111,
      columnNumber: 13
    }, this);
  }
  if (failed) {
    return /* @__PURE__ */ jsxDEV("div", { className: "retani-courseoverview-empty is-standalone", role: "alert", children: strings.loadfailed }, void 0, false, {
      fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseCards.tsx",
      lineNumber: 122,
      columnNumber: 16
    }, this);
  }
  if (courses.length === 0) {
    return /* @__PURE__ */ jsxDEV("div", { className: "retani-courseoverview-empty is-standalone", children: search.trim() ? strings.nomatch.replace("{$a}", search.trim()) : strings.nocourses }, void 0, false, {
      fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseCards.tsx",
      lineNumber: 126,
      columnNumber: 13
    }, this);
  }
  return /* @__PURE__ */ jsxDEV("div", { className: `retani-courseoverview-cards${loading ? " is-loading" : ""}`, "aria-busy": loading, children: courses.map((course) => /* @__PURE__ */ jsxDEV(CourseCard, { course, strings }, course.id, false, {
    fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseCards.tsx",
    lineNumber: 133,
    columnNumber: 38
  }, this)) }, void 0, false, {
    fileName: "public/theme/retani_studio/js/esm/src/courseoverview/CourseCards.tsx",
    lineNumber: 132,
    columnNumber: 9
  }, this);
}
__name(CourseCards, "CourseCards");
export {
  CourseCards as default
};
//# sourceMappingURL=CourseCards.dev.js.map
