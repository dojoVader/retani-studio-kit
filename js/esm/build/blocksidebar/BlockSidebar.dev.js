var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
/**
 * The right-hand block bar, from mockup/Moodle Dashboard Implementation /Retani Home.dc.html.
 *
 * A 300px bar docked on the right with a "Blocks" header and a collapse button. When collapsed, a vertical
 * "Blocks" tab on the right edge expands it again. In edit mode an "Add a block" card opens AddBlockDialog.
 * On wide screens the page makes room for the open bar (body class retani-blocksidebar-open); on narrow screens
 * the bar slides over the page with a backdrop.
 *
 * The blocks are Moodle's own (rendered in theme_retani_studio/retani/block_sidebar) and are moved into the
 * bar's body here, so every block keeps its markup and JavaScript.
 *
 * Mounted by core/react_autoinit from the {{#react}} helper in theme_retani_studio/retani/block_sidebar.
 *
 * @module     theme_retani_studio/blocksidebar/BlockSidebar
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { fetchOne } from "@moodle/lms/core/ajax";
import AddBlockDialog from "./AddBlockDialog";
import { Icon } from "./icons";
const OPEN_CLASS = "retani-blocksidebar-open";
const BLOCKS_SELECTOR = '[data-region="retani-blocksidebar-blocks"]';
const DOCKED_QUERY = "(min-width: 1200px)";
const savePreference = /* @__PURE__ */ __name((preference, value) => {
  fetchOne({
    methodname: "core_user_update_user_preferences",
    args: { preferences: [{ type: preference, value: value ? "1" : "0" }] }
  }).catch(() => void 0);
}, "savePreference");
function BlockSidebar({ open: initiallyopen, preference, editing, addblock, strings }) {
  const [docked, setDocked] = useState(() => window.matchMedia(DOCKED_QUERY).matches);
  const [open, setOpen] = useState(() => initiallyopen && window.matchMedia(DOCKED_QUERY).matches);
  const [adding, setAdding] = useState(false);
  const slot = useRef(null);
  const tab = useRef(null);
  const closebutton = useRef(null);
  useEffect(() => {
    const media = window.matchMedia(DOCKED_QUERY);
    const update = /* @__PURE__ */ __name(() => {
      setDocked(media.matches);
      if (!media.matches) {
        setOpen(false);
      }
    }, "update");
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    document.body.classList.toggle(OPEN_CLASS, open);
    document.getElementById("retani-blocksidebar")?.classList.toggle("is-open", open);
  }, [open]);
  useEffect(() => {
    const target = slot.current;
    const blocks = document.querySelector(BLOCKS_SELECTOR);
    const home = blocks?.parentElement;
    if (!target || !blocks || !home) {
      return void 0;
    }
    const marker = document.createComment("retani-blocksidebar-blocks");
    home.insertBefore(marker, blocks);
    target.appendChild(blocks);
    return () => {
      marker.parentNode?.insertBefore(blocks, marker.nextSibling);
      marker.remove();
    };
  }, []);
  const toggle = useCallback((value) => {
    setOpen(value);
    if (docked) {
      savePreference(preference, value);
    }
    window.requestAnimationFrame(() => (value ? closebutton.current : tab.current)?.focus());
  }, [docked, preference]);
  useEffect(() => {
    if (!open || docked || adding) {
      return void 0;
    }
    const onKey = /* @__PURE__ */ __name((e) => {
      if (e.key === "Escape") {
        toggle(false);
      }
    }, "onKey");
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, docked, adding, toggle]);
  const closeDialog = useCallback(() => setAdding(false), []);
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    open && !docked && /* @__PURE__ */ jsxDEV("div", { className: "retani-blocksidebar-scrim", onClick: () => toggle(false), "aria-hidden": "true" }, void 0, false, {
      fileName: "public/theme/retani_studio/js/esm/src/blocksidebar/BlockSidebar.tsx",
      lineNumber: 140,
      columnNumber: 17
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "retani-blocksidebar-panel", inert: !open || void 0, children: [
      /* @__PURE__ */ jsxDEV("div", { className: "retani-blocksidebar-header", children: [
        /* @__PURE__ */ jsxDEV("h2", { className: "retani-blocksidebar-title", children: strings.blocks }, void 0, false, {
          fileName: "public/theme/retani_studio/js/esm/src/blocksidebar/BlockSidebar.tsx",
          lineNumber: 144,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            ref: closebutton,
            type: "button",
            className: "retani-blocksidebar-close",
            title: strings.close,
            "aria-expanded": open,
            "aria-controls": "retani-blocksidebar",
            onClick: () => toggle(false),
            children: [
              /* @__PURE__ */ jsxDEV(Icon, { name: "sidebar", size: 16, strokeWidth: 1.6 }, void 0, false, {
                fileName: "public/theme/retani_studio/js/esm/src/blocksidebar/BlockSidebar.tsx",
                lineNumber: 154,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "visually-hidden", children: strings.close }, void 0, false, {
                fileName: "public/theme/retani_studio/js/esm/src/blocksidebar/BlockSidebar.tsx",
                lineNumber: 155,
                columnNumber: 25
              }, this)
            ]
          },
          void 0,
          true,
          {
            fileName: "public/theme/retani_studio/js/esm/src/blocksidebar/BlockSidebar.tsx",
            lineNumber: 145,
            columnNumber: 21
          },
          this
        )
      ] }, void 0, true, {
        fileName: "public/theme/retani_studio/js/esm/src/blocksidebar/BlockSidebar.tsx",
        lineNumber: 143,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "retani-blocksidebar-body", children: [
        editing && addblock && /* @__PURE__ */ jsxDEV("button", { type: "button", className: "retani-blocksidebar-add", onClick: () => setAdding(true), children: [
          /* @__PURE__ */ jsxDEV("span", { className: "retani-blocksidebar-addicon", "aria-hidden": "true", children: /* @__PURE__ */ jsxDEV(Icon, { name: "plus", size: 14, strokeWidth: 2.2 }, void 0, false, {
            fileName: "public/theme/retani_studio/js/esm/src/blocksidebar/BlockSidebar.tsx",
            lineNumber: 162,
            columnNumber: 33
          }, this) }, void 0, false, {
            fileName: "public/theme/retani_studio/js/esm/src/blocksidebar/BlockSidebar.tsx",
            lineNumber: 161,
            columnNumber: 29
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "retani-blocksidebar-addtitle", children: strings.addblock }, void 0, false, {
            fileName: "public/theme/retani_studio/js/esm/src/blocksidebar/BlockSidebar.tsx",
            lineNumber: 164,
            columnNumber: 29
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "retani-blocksidebar-addhint", children: strings.addblockhint }, void 0, false, {
            fileName: "public/theme/retani_studio/js/esm/src/blocksidebar/BlockSidebar.tsx",
            lineNumber: 165,
            columnNumber: 29
          }, this)
        ] }, void 0, true, {
          fileName: "public/theme/retani_studio/js/esm/src/blocksidebar/BlockSidebar.tsx",
          lineNumber: 160,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "retani-blocksidebar-slot", ref: slot }, void 0, false, {
          fileName: "public/theme/retani_studio/js/esm/src/blocksidebar/BlockSidebar.tsx",
          lineNumber: 168,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "public/theme/retani_studio/js/esm/src/blocksidebar/BlockSidebar.tsx",
        lineNumber: 158,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "public/theme/retani_studio/js/esm/src/blocksidebar/BlockSidebar.tsx",
      lineNumber: 142,
      columnNumber: 13
    }, this),
    !open && /* @__PURE__ */ jsxDEV(
      "button",
      {
        ref: tab,
        type: "button",
        className: "retani-blocksidebar-tab",
        title: strings.open,
        "aria-expanded": false,
        "aria-controls": "retani-blocksidebar",
        onClick: () => toggle(true),
        children: [
          /* @__PURE__ */ jsxDEV(Icon, { name: "chevronleft", size: 12, strokeWidth: 2.4 }, void 0, false, {
            fileName: "public/theme/retani_studio/js/esm/src/blocksidebar/BlockSidebar.tsx",
            lineNumber: 181,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "retani-blocksidebar-tablabel", children: strings.blocks }, void 0, false, {
            fileName: "public/theme/retani_studio/js/esm/src/blocksidebar/BlockSidebar.tsx",
            lineNumber: 182,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "retani-blocksidebar-tabdot", "aria-hidden": "true" }, void 0, false, {
            fileName: "public/theme/retani_studio/js/esm/src/blocksidebar/BlockSidebar.tsx",
            lineNumber: 183,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "visually-hidden", children: strings.open }, void 0, false, {
            fileName: "public/theme/retani_studio/js/esm/src/blocksidebar/BlockSidebar.tsx",
            lineNumber: 184,
            columnNumber: 21
          }, this)
        ]
      },
      void 0,
      true,
      {
        fileName: "public/theme/retani_studio/js/esm/src/blocksidebar/BlockSidebar.tsx",
        lineNumber: 172,
        columnNumber: 17
      },
      this
    ),
    adding && addblock && /* @__PURE__ */ jsxDEV(AddBlockDialog, { config: addblock, strings, onClose: closeDialog }, void 0, false, {
      fileName: "public/theme/retani_studio/js/esm/src/blocksidebar/BlockSidebar.tsx",
      lineNumber: 187,
      columnNumber: 36
    }, this)
  ] }, void 0, true, {
    fileName: "public/theme/retani_studio/js/esm/src/blocksidebar/BlockSidebar.tsx",
    lineNumber: 138,
    columnNumber: 9
  }, this);
}
__name(BlockSidebar, "BlockSidebar");
export {
  OPEN_CLASS,
  BlockSidebar as default
};
//# sourceMappingURL=BlockSidebar.dev.js.map
