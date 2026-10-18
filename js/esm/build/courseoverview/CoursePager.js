import{Icon as n,PATHS as s}from"./icons";import{jsx as o,jsxs as v}from"react/jsx-runtime";/**
 * Previous / next paging under the course table.
 *
 * @module     theme_retani_studio/courseoverview/CoursePager
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */function u({page:a,hasprevious:r,hasnext:t,disabled:i,onPrevious:l,onNext:p,strings:e}){return!r&&!t?null:v("nav",{className:"retani-courseoverview-pager","aria-label":e.page.replace("{$a}",String(a+1)),children:[o("span",{className:"retani-courseoverview-pagestatus","aria-live":"polite",children:e.page.replace("{$a}",String(a+1))}),o("button",{type:"button",className:"retani-courseoverview-iconbtn","aria-label":e.previous,title:e.previous,disabled:i||!r,onClick:l,children:o(n,{path:s.previous,size:13,strokeWidth:2.2})}),o("button",{type:"button",className:"retani-courseoverview-iconbtn","aria-label":e.next,title:e.next,disabled:i||!t,onClick:p,children:o(n,{path:s.next,size:13,strokeWidth:2.2})})]})}export{u as default};
