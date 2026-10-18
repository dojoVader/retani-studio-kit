var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
/**
 * Which columns the course overview table shows, and how it sorts them.
 *
 * The mockup's columns are Code, Course name, Level, Teacher, Enrolled and Completion rate. Some of these depend
 * on what the site has and what the user may see, so they adapt:
 * - Level shows the "level" course custom field, or the course category when no course has a level.
 * - Enrolled is left out when the user cannot see participant counts for any course on the page.
 * - Completion rate shows the class completion rate where the user may see it, otherwise their own progress.
 *
 * @module     theme_retani_studio/courseoverview/columns
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { isSet } from "./types";
const LEVEL_ORDER = { beginner: 0, intermediate: 1, advanced: 2 };
const getColumns = /* @__PURE__ */ __name((rows, showcategory, strings) => {
  const haslevel = rows.some((r) => r.details?.level);
  const hasenrolled = rows.some((r) => isSet(r.details?.enrolledcount));
  const hasrate = rows.some((r) => isSet(r.details?.completionrate));
  const columns = [
    { key: "code", label: strings.code, weight: 72 },
    { key: "name", label: strings.coursename, weight: 216 }
  ];
  if (haslevel || showcategory) {
    columns.push({
      key: "level",
      label: haslevel ? strings.level : strings.category,
      weight: 118,
      sort: "level",
      source: haslevel ? "level" : "category"
    });
  }
  columns.push({ key: "teacher", label: strings.teacher, weight: 144 });
  if (hasenrolled) {
    columns.push({ key: "enrolled", label: strings.enrolled, weight: 80, numeric: true, sort: "enrolled" });
  }
  columns.push({
    key: "rate",
    label: hasrate ? strings.completionrate : strings.progress,
    weight: 122,
    numeric: true,
    sort: "rate",
    source: hasrate ? "completionrate" : "progress"
  });
  return columns;
}, "getColumns");
const gridTemplate = /* @__PURE__ */ __name((columns) => columns.map((c) => `minmax(0, ${c.weight}fr)`).join(" "), "gridTemplate");
const sortValue = /* @__PURE__ */ __name((row, column) => {
  switch (column.sort) {
    case "level": {
      const text = (column.source === "level" ? row.details?.level : row.coursecategory) ?? "";
      if (!text) {
        return null;
      }
      const rank = LEVEL_ORDER[text.trim().toLowerCase()];
      return rank === void 0 ? `~${text.toLowerCase()}` : `${rank}`;
    }
    case "enrolled":
      return row.details?.enrolledcount ?? null;
    case "rate":
      if (column.source === "completionrate") {
        return row.details?.completionrate ?? null;
      }
      return row.hasprogress ? row.progress : null;
    default:
      return null;
  }
}, "sortValue");
const sortRows = /* @__PURE__ */ __name((rows, columns, sort) => {
  const column = sort && columns.find((c) => c.sort === sort.key);
  if (!sort || !column) {
    return rows;
  }
  return [...rows].sort((a, b) => {
    const va = sortValue(a, column);
    const vb = sortValue(b, column);
    if (va === null) {
      return vb === null ? 0 : 1;
    }
    if (vb === null) {
      return -1;
    }
    const order = typeof va === "number" && typeof vb === "number" ? va - vb : String(va).localeCompare(String(vb));
    return order * sort.dir;
  });
}, "sortRows");
export {
  getColumns,
  gridTemplate,
  sortRows
};
//# sourceMappingURL=columns.dev.js.map
