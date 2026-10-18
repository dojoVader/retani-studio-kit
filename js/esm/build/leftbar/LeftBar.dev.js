var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
/**
 * Retractable left bar: brand, course category selector, current course and its outline, navigation menu and
 * user menu.
 *
 * Mounted automatically via data-react-component="@moodle/lms/theme_retani_studio/leftbar/LeftBar"
 * by core/react_autoinit, from the {{#react}} helper in theme_retani_studio/retani/left_bar.
 *
 * @module     theme_retani_studio/leftbar/LeftBar
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { useCallback, useEffect, useId, useState } from "react";
import { fetchOne } from "@moodle/lms/core/ajax";
import CategorySelector from "./CategorySelector";
import { CourseOutline, CourseRow } from "./CourseOutline";
import NavigationMenu from "./NavigationMenu";
import UserMenu from "./UserMenu";
import { Icon } from "./icons";
const COLLAPSED_CLASS = "retani-leftbar-collapsed";
const savePreference = /* @__PURE__ */ __name((preference, value) => {
  fetchOne({
    methodname: "core_user_update_user_preferences",
    args: { preferences: [{ type: preference, value: value ? "1" : "0" }] }
  }).catch(() => void 0);
}, "savePreference");
function LeftBar({
  collapsed: initiallycollapsed,
  preference,
  brand,
  categories,
  course,
  navigation,
  footernavigation,
  user,
  strings
}) {
  const [collapsed, setCollapsed] = useState(initiallycollapsed);
  const [openmenu, setOpenmenu] = useState(null);
  const [outlineopen, setOutlineopen] = useState(course?.outlineopen ?? false);
  const outlineid = useId();
  useEffect(() => {
    document.body.classList.toggle(COLLAPSED_CLASS, collapsed);
  }, [collapsed]);
  const setAndSave = useCallback((value) => {
    setCollapsed(value);
    setOpenmenu(null);
    savePreference(preference, value);
  }, [preference]);
  const toggleCollapsed = useCallback(() => setAndSave(!collapsed), [collapsed, setAndSave]);
  const expand = useCallback(() => setAndSave(false), [setAndSave]);
  const closeMenus = useCallback(() => setOpenmenu(null), []);
  const toggleMenu = /* @__PURE__ */ __name((menu) => () => setOpenmenu((current) => current === menu ? null : menu), "toggleMenu");
  const toggleOutline = useCallback(() => {
    if (!course) {
      return;
    }
    const value = collapsed ? true : !outlineopen;
    if (collapsed) {
      setAndSave(false);
    }
    setOutlineopen(value);
    savePreference(course.preference, value);
  }, [course, collapsed, outlineopen, setAndSave]);
  const outlineshown = Boolean(course) && !collapsed && outlineopen;
  const togglelabel = collapsed ? strings.expand : strings.collapse;
  return /* @__PURE__ */ jsxDEV("div", { className: `retani-leftbar-inner${collapsed ? " is-collapsed" : ""}`, children: [
    /* @__PURE__ */ jsxDEV("div", { className: "retani-leftbar-header", children: [
      !collapsed && /* @__PURE__ */ jsxDEV("a", { className: "retani-leftbar-brand", href: brand.url, children: brand.logourl ? /* @__PURE__ */ jsxDEV("img", { className: "retani-leftbar-logo", src: brand.logourl, alt: brand.name }, void 0, false, {
        fileName: "public/theme/retani_studio/js/esm/src/leftbar/LeftBar.tsx",
        lineNumber: 116,
        columnNumber: 29
      }, this) : /* @__PURE__ */ jsxDEV("span", { className: "retani-leftbar-sitename", children: [
        brand.name,
        /* @__PURE__ */ jsxDEV("span", { className: "retani-leftbar-sitename-dot", "aria-hidden": "true", children: "." }, void 0, false, {
          fileName: "public/theme/retani_studio/js/esm/src/leftbar/LeftBar.tsx",
          lineNumber: 119,
          columnNumber: 45
        }, this)
      ] }, void 0, true, {
        fileName: "public/theme/retani_studio/js/esm/src/leftbar/LeftBar.tsx",
        lineNumber: 118,
        columnNumber: 29
      }, this) }, void 0, false, {
        fileName: "public/theme/retani_studio/js/esm/src/leftbar/LeftBar.tsx",
        lineNumber: 114,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          type: "button",
          className: "retani-leftbar-collapse",
          "aria-expanded": !collapsed,
          "aria-label": togglelabel,
          title: togglelabel,
          onClick: toggleCollapsed,
          children: /* @__PURE__ */ jsxDEV(Icon, { name: "sidebar", size: 16, strokeWidth: 1.6 }, void 0, false, {
            fileName: "public/theme/retani_studio/js/esm/src/leftbar/LeftBar.tsx",
            lineNumber: 132,
            columnNumber: 21
          }, this)
        },
        void 0,
        false,
        {
          fileName: "public/theme/retani_studio/js/esm/src/leftbar/LeftBar.tsx",
          lineNumber: 124,
          columnNumber: 17
        },
        this
      )
    ] }, void 0, true, {
      fileName: "public/theme/retani_studio/js/esm/src/leftbar/LeftBar.tsx",
      lineNumber: 112,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV(
      CategorySelector,
      {
        data: categories,
        collapsed,
        open: openmenu === "category",
        onToggle: toggleMenu("category"),
        onClose: closeMenus,
        strings
      },
      void 0,
      false,
      {
        fileName: "public/theme/retani_studio/js/esm/src/leftbar/LeftBar.tsx",
        lineNumber: 136,
        columnNumber: 13
      },
      this
    ),
    course && /* @__PURE__ */ jsxDEV(Fragment, { children: [
      /* @__PURE__ */ jsxDEV(
        CourseRow,
        {
          course,
          collapsed,
          open: outlineshown,
          onToggle: toggleOutline,
          strings,
          panelid: outlineid
        },
        void 0,
        false,
        {
          fileName: "public/theme/retani_studio/js/esm/src/leftbar/LeftBar.tsx",
          lineNumber: 147,
          columnNumber: 21
        },
        this
      ),
      /* @__PURE__ */ jsxDEV(CourseOutline, { visible: outlineshown, id: outlineid, label: strings.courseoutline }, void 0, false, {
        fileName: "public/theme/retani_studio/js/esm/src/leftbar/LeftBar.tsx",
        lineNumber: 155,
        columnNumber: 21
      }, this)
    ] }, void 0, true, {
      fileName: "public/theme/retani_studio/js/esm/src/leftbar/LeftBar.tsx",
      lineNumber: 146,
      columnNumber: 17
    }, this),
    /* @__PURE__ */ jsxDEV("nav", { className: "retani-leftbar-nav", "aria-label": strings.navigation, hidden: outlineshown, children: /* @__PURE__ */ jsxDEV(NavigationMenu, { items: navigation, collapsed, onExpand: expand }, void 0, false, {
      fileName: "public/theme/retani_studio/js/esm/src/leftbar/LeftBar.tsx",
      lineNumber: 160,
      columnNumber: 17
    }, this) }, void 0, false, {
      fileName: "public/theme/retani_studio/js/esm/src/leftbar/LeftBar.tsx",
      lineNumber: 159,
      columnNumber: 13
    }, this),
    footernavigation.length > 0 && /* @__PURE__ */ jsxDEV("div", { className: "retani-leftbar-footer", children: /* @__PURE__ */ jsxDEV(
      NavigationMenu,
      {
        items: footernavigation,
        collapsed,
        onExpand: expand,
        className: "is-footer"
      },
      void 0,
      false,
      {
        fileName: "public/theme/retani_studio/js/esm/src/leftbar/LeftBar.tsx",
        lineNumber: 165,
        columnNumber: 21
      },
      this
    ) }, void 0, false, {
      fileName: "public/theme/retani_studio/js/esm/src/leftbar/LeftBar.tsx",
      lineNumber: 164,
      columnNumber: 17
    }, this),
    /* @__PURE__ */ jsxDEV(
      UserMenu,
      {
        user,
        collapsed,
        open: openmenu === "user",
        onToggle: toggleMenu("user"),
        onClose: closeMenus,
        label: strings.usermenu
      },
      void 0,
      false,
      {
        fileName: "public/theme/retani_studio/js/esm/src/leftbar/LeftBar.tsx",
        lineNumber: 170,
        columnNumber: 13
      },
      this
    )
  ] }, void 0, true, {
    fileName: "public/theme/retani_studio/js/esm/src/leftbar/LeftBar.tsx",
    lineNumber: 111,
    columnNumber: 9
  }, this);
}
__name(LeftBar, "LeftBar");
export {
  COLLAPSED_CLASS,
  LeftBar as default
};
//# sourceMappingURL=LeftBar.dev.js.map
