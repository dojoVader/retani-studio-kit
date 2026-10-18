var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
/**
 * Load a page of courses, then their extra details, for the course overview table.
 *
 * @module     theme_retani_studio/courseoverview/useCourses
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { useEffect, useRef, useState } from "react";
import { getCourseDetails, getCoursePage } from "./services/courses";
const INITIAL = { rows: [], loading: true, failed: false, hasnext: false, nextoffset: 0 };
function useCourses({ filter, search, sort, limit, offset }) {
  const [state, setState] = useState(INITIAL);
  const latest = useRef(0);
  useEffect(() => {
    const request = ++latest.current;
    const current = /* @__PURE__ */ __name(() => request === latest.current, "current");
    setState((previous) => ({ ...previous, loading: true, failed: false }));
    const load = /* @__PURE__ */ __name(async () => {
      let page;
      try {
        page = await getCoursePage({ filter, search, sort, limit, offset });
      } catch {
        if (current()) {
          setState({ ...INITIAL, loading: false, failed: true });
        }
        return;
      }
      if (!current()) {
        return;
      }
      const { courses, nextoffset } = page;
      setState({
        rows: courses.map((course) => ({ ...course, details: null })),
        loading: false,
        failed: false,
        // A full page means there may be more; the service skips hidden courses, so check nextoffset too.
        hasnext: limit > 0 && courses.length >= limit && nextoffset > offset,
        nextoffset
      });
      let details;
      try {
        details = await getCourseDetails(courses.map((course) => course.id));
      } catch {
        return;
      }
      if (!current()) {
        return;
      }
      const byid = new Map(details.map((d) => [d.id, d]));
      setState((previous) => ({
        ...previous,
        rows: previous.rows.map((row) => ({ ...row, details: byid.get(row.id) ?? null }))
      }));
    }, "load");
    load();
  }, [filter, search, sort, limit, offset]);
  return state;
}
__name(useCourses, "useCourses");
export {
  useCourses as default
};
//# sourceMappingURL=useCourses.dev.js.map
