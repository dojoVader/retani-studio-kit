var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * "Add a block" dialog: a searchable list of the blocks that can be added to the bar.
 *
 * Replaces core_block/add_modal for the bar's region and works the same way: the list comes from
 * core_block_fetch_addable_blocks; a block is added by loading the page with bui_addblock=<name>, or, for blocks
 * that ask for settings first, through their add form in a core_form/modalform.
 *
 * @module     theme_retani_studio/blocksidebar/AddBlockDialog
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { fetchOne } from "@moodle/lms/core/ajax";
import { requireAsync } from "@moodle/lms/core/amd";
import { Icon, blockIconPath } from "./icons";
const showAddForm = /* @__PURE__ */ __name(async (block, config, title, returnFocus) => {
  const ModalForm = await requireAsync("core_form/modalform");
  const form = new ModalForm({
    modalConfig: { title },
    args: { blockname: block.name, pagehash: config.pagehash, blockregion: config.region },
    formClass: block.blockform,
    returnFocus
  });
  form.addEventListener(form.events.FORM_SUBMITTED, () => window.location.reload());
  await form.show();
}, "showAddForm");
function AddBlockDialog({ config, strings, onClose }) {
  const [blocks, setBlocks] = useState(null);
  const [failed, setFailed] = useState(false);
  const [query, setQuery] = useState("");
  const search = useRef(null);
  const titleid = useId();
  useEffect(() => {
    let current = true;
    fetchOne({
      methodname: "core_block_fetch_addable_blocks",
      args: { pagecontextid: 0, pagetype: "", pagelayout: "", subpage: "", pagehash: config.pagehash }
    }).then((list) => {
      if (current) {
        setBlocks(list);
      }
      return list;
    }).catch(() => {
      if (current) {
        setFailed(true);
      }
    });
    return () => {
      current = false;
    };
  }, [config.pagehash]);
  useEffect(() => {
    const opener = document.activeElement;
    search.current?.focus();
    const onKey = /* @__PURE__ */ __name((e) => {
      if (e.key === "Escape") {
        onClose();
      }
    }, "onKey");
    document.addEventListener("keydown", onKey);
    document.body.classList.add("retani-addblock-open");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("retani-addblock-open");
      opener?.focus();
    };
  }, [onClose]);
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (blocks ?? []).filter((b) => !q || `${b.title} ${b.name}`.toLowerCase().includes(q));
  }, [blocks, query]);
  const add = /* @__PURE__ */ __name((block, row) => {
    if (block.blockform) {
      onClose();
      showAddForm(block, config, `${strings.addblock}: ${block.title}`, row).catch(() => void 0);
      return;
    }
    const url = new URL(config.url, window.location.href);
    url.searchParams.set("bui_addblock", block.name);
    window.location.href = url.toString();
  }, "add");
  let body;
  if (failed || blocks && !blocks.length) {
    body = /* @__PURE__ */ jsxDEV("p", { className: "retani-addblock-empty", children: strings.noblocks }, void 0, false, {
      fileName: "public/theme/retani_studio/js/esm/src/blocksidebar/AddBlockDialog.tsx",
      lineNumber: 137,
      columnNumber: 16
    }, this);
  } else if (!blocks) {
    body = /* @__PURE__ */ jsxDEV("p", { className: "retani-addblock-empty", role: "status", children: strings.loading }, void 0, false, {
      fileName: "public/theme/retani_studio/js/esm/src/blocksidebar/AddBlockDialog.tsx",
      lineNumber: 139,
      columnNumber: 16
    }, this);
  } else if (!shown.length) {
    body = /* @__PURE__ */ jsxDEV("p", { className: "retani-addblock-empty", role: "status", children: strings.nomatch.replace("{$a}", query.trim()) }, void 0, false, {
      fileName: "public/theme/retani_studio/js/esm/src/blocksidebar/AddBlockDialog.tsx",
      lineNumber: 141,
      columnNumber: 16
    }, this);
  } else {
    body = /* @__PURE__ */ jsxDEV("ul", { className: "retani-addblock-list", children: shown.map((block) => /* @__PURE__ */ jsxDEV("li", { children: /* @__PURE__ */ jsxDEV(
      "button",
      {
        type: "button",
        className: "retani-addblock-item",
        onClick: (e) => add(block, e.currentTarget),
        children: [
          /* @__PURE__ */ jsxDEV("span", { className: "retani-addblock-icon", children: /* @__PURE__ */ jsxDEV(Icon, { path: blockIconPath(block.name), size: 14, strokeWidth: 2.1 }, void 0, false, {
            fileName: "public/theme/retani_studio/js/esm/src/blocksidebar/AddBlockDialog.tsx",
            lineNumber: 153,
            columnNumber: 33
          }, this) }, void 0, false, {
            fileName: "public/theme/retani_studio/js/esm/src/blocksidebar/AddBlockDialog.tsx",
            lineNumber: 152,
            columnNumber: 29
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "retani-addblock-name", children: block.title }, void 0, false, {
            fileName: "public/theme/retani_studio/js/esm/src/blocksidebar/AddBlockDialog.tsx",
            lineNumber: 155,
            columnNumber: 29
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "retani-addblock-action", children: strings.add }, void 0, false, {
            fileName: "public/theme/retani_studio/js/esm/src/blocksidebar/AddBlockDialog.tsx",
            lineNumber: 156,
            columnNumber: 29
          }, this)
        ]
      },
      void 0,
      true,
      {
        fileName: "public/theme/retani_studio/js/esm/src/blocksidebar/AddBlockDialog.tsx",
        lineNumber: 147,
        columnNumber: 25
      },
      this
    ) }, block.name, false, {
      fileName: "public/theme/retani_studio/js/esm/src/blocksidebar/AddBlockDialog.tsx",
      lineNumber: 146,
      columnNumber: 21
    }, this)) }, void 0, false, {
      fileName: "public/theme/retani_studio/js/esm/src/blocksidebar/AddBlockDialog.tsx",
      lineNumber: 144,
      columnNumber: 13
    }, this);
  }
  return createPortal(
    /* @__PURE__ */ jsxDEV("div", { className: "retani-addblock-backdrop", onMouseDown: (e) => e.target === e.currentTarget && onClose(), children: /* @__PURE__ */ jsxDEV("div", { className: "retani-addblock", role: "dialog", "aria-modal": "true", "aria-labelledby": titleid, children: [
      /* @__PURE__ */ jsxDEV("div", { className: "retani-addblock-header", children: [
        /* @__PURE__ */ jsxDEV("span", { className: "retani-addblock-badge", "aria-hidden": "true", children: /* @__PURE__ */ jsxDEV(Icon, { name: "plus", size: 16, strokeWidth: 2.2 }, void 0, false, {
          fileName: "public/theme/retani_studio/js/esm/src/blocksidebar/AddBlockDialog.tsx",
          lineNumber: 168,
          columnNumber: 80
        }, this) }, void 0, false, {
          fileName: "public/theme/retani_studio/js/esm/src/blocksidebar/AddBlockDialog.tsx",
          lineNumber: 168,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV("h2", { className: "retani-addblock-title", id: titleid, children: strings.addblock }, void 0, false, {
          fileName: "public/theme/retani_studio/js/esm/src/blocksidebar/AddBlockDialog.tsx",
          lineNumber: 169,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV("button", { type: "button", className: "retani-addblock-close", title: strings.closebuttontitle, onClick: onClose, children: [
          /* @__PURE__ */ jsxDEV(Icon, { name: "close", size: 12, strokeWidth: 2.2 }, void 0, false, {
            fileName: "public/theme/retani_studio/js/esm/src/blocksidebar/AddBlockDialog.tsx",
            lineNumber: 171,
            columnNumber: 25
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "visually-hidden", children: strings.closebuttontitle }, void 0, false, {
            fileName: "public/theme/retani_studio/js/esm/src/blocksidebar/AddBlockDialog.tsx",
            lineNumber: 172,
            columnNumber: 25
          }, this)
        ] }, void 0, true, {
          fileName: "public/theme/retani_studio/js/esm/src/blocksidebar/AddBlockDialog.tsx",
          lineNumber: 170,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "public/theme/retani_studio/js/esm/src/blocksidebar/AddBlockDialog.tsx",
        lineNumber: 167,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "retani-addblock-search", children: [
        /* @__PURE__ */ jsxDEV(Icon, { name: "search", size: 13 }, void 0, false, {
          fileName: "public/theme/retani_studio/js/esm/src/blocksidebar/AddBlockDialog.tsx",
          lineNumber: 176,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV(
          "input",
          {
            ref: search,
            type: "search",
            value: query,
            placeholder: strings.search,
            "aria-label": strings.search,
            onChange: (e) => setQuery(e.target.value)
          },
          void 0,
          false,
          {
            fileName: "public/theme/retani_studio/js/esm/src/blocksidebar/AddBlockDialog.tsx",
            lineNumber: 177,
            columnNumber: 21
          },
          this
        )
      ] }, void 0, true, {
        fileName: "public/theme/retani_studio/js/esm/src/blocksidebar/AddBlockDialog.tsx",
        lineNumber: 175,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "retani-addblock-body", children: body }, void 0, false, {
        fileName: "public/theme/retani_studio/js/esm/src/blocksidebar/AddBlockDialog.tsx",
        lineNumber: 186,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "retani-addblock-footer", children: /* @__PURE__ */ jsxDEV("button", { type: "button", className: "btn btn-secondary", onClick: onClose, children: strings.cancel }, void 0, false, {
        fileName: "public/theme/retani_studio/js/esm/src/blocksidebar/AddBlockDialog.tsx",
        lineNumber: 188,
        columnNumber: 21
      }, this) }, void 0, false, {
        fileName: "public/theme/retani_studio/js/esm/src/blocksidebar/AddBlockDialog.tsx",
        lineNumber: 187,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "public/theme/retani_studio/js/esm/src/blocksidebar/AddBlockDialog.tsx",
      lineNumber: 166,
      columnNumber: 13
    }, this) }, void 0, false, {
      fileName: "public/theme/retani_studio/js/esm/src/blocksidebar/AddBlockDialog.tsx",
      lineNumber: 165,
      columnNumber: 9
    }, this),
    document.body
  );
}
__name(AddBlockDialog, "AddBlockDialog");
export {
  AddBlockDialog as default
};
//# sourceMappingURL=AddBlockDialog.dev.js.map
