var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
/**
 * Web service calls behind the course overview table.
 *
 * Components never call fetchOne directly: they go through these functions, so the request shapes live in
 * one place and can be mocked in tests.
 *
 * @module     theme_retani_studio/courseoverview/services/courses
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { fetchOne } from "@moodle/lms/core/ajax";
const REQUIRED_FIELDS = ["id", "fullname", "shortname", "showcoursecategory", "showshortname", "visible", "enddate"];
const getCoursePage = /* @__PURE__ */ __name(({ filter, search, sort, limit, offset }) => {
  const searching = search.trim() !== "";
  return fetchOne({
    methodname: "core_course_get_enrolled_courses_by_timeline_classification",
    args: {
      classification: searching ? "search" : filter.grouping,
      limit,
      offset,
      sort,
      customfieldname: filter.customfieldname ?? "",
      customfieldvalue: filter.customfieldvalue ?? "",
      searchvalue: search.trim(),
      requiredfields: REQUIRED_FIELDS
    }
  });
}, "getCoursePage");
const getCourseDetails = /* @__PURE__ */ __name((courseids) => {
  if (courseids.length === 0) {
    return Promise.resolve([]);
  }
  return fetchOne({
    methodname: "theme_retani_studio_get_course_overview_details",
    args: { courseids }
  });
}, "getCourseDetails");
const saveFilterPreference = /* @__PURE__ */ __name((filter) => {
  const preferences = [{ type: "block_myoverview_user_grouping_preference", value: filter.grouping }];
  if (filter.grouping === "customfield") {
    preferences.push({
      type: "block_myoverview_user_grouping_customfieldvalue_preference",
      value: filter.customfieldvalue ?? ""
    });
  }
  fetchOne({ methodname: "core_user_update_user_preferences", args: { preferences } }).catch(() => void 0);
}, "saveFilterPreference");
const saveViewPreference = /* @__PURE__ */ __name((view) => {
  fetchOne({
    methodname: "core_user_update_user_preferences",
    args: { preferences: [{ type: "block_myoverview_user_view_preference", value: view }] }
  }).catch(() => void 0);
}, "saveViewPreference");
export {
  getCourseDetails,
  getCoursePage,
  saveFilterPreference,
  saveViewPreference
};
//# sourceMappingURL=courses.dev.js.map
