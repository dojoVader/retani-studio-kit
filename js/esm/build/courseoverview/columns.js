import{isSet as s}from"./types";/**
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
 */const i={beginner:0,intermediate:1,advanced:2},d=(t,n,e)=>{const o=t.some(r=>r.details?.level),a=t.some(r=>s(r.details?.enrolledcount)),u=t.some(r=>s(r.details?.completionrate)),l=[{key:"code",label:e.code,weight:72},{key:"name",label:e.coursename,weight:216}];return(o||n)&&l.push({key:"level",label:o?e.level:e.category,weight:118,sort:"level",source:o?"level":"category"}),l.push({key:"teacher",label:e.teacher,weight:144}),a&&l.push({key:"enrolled",label:e.enrolled,weight:80,numeric:!0,sort:"enrolled"}),l.push({key:"rate",label:u?e.completionrate:e.progress,weight:122,numeric:!0,sort:"rate",source:u?"completionrate":"progress"}),l},y=t=>t.map(n=>`minmax(0, ${n.weight}fr)`).join(" "),c=(t,n)=>{switch(n.sort){case"level":{const e=(n.source==="level"?t.details?.level:t.coursecategory)??"";if(!e)return null;const o=i[e.trim().toLowerCase()];return o===void 0?`~${e.toLowerCase()}`:`${o}`}case"enrolled":return t.details?.enrolledcount??null;case"rate":return n.source==="completionrate"?t.details?.completionrate??null:t.hasprogress?t.progress:null;default:return null}},g=(t,n,e)=>{const o=e&&n.find(a=>a.sort===e.key);return!e||!o?t:[...t].sort((a,u)=>{const l=c(a,o),r=c(u,o);return l===null?r===null?0:1:r===null?-1:(typeof l=="number"&&typeof r=="number"?l-r:String(l).localeCompare(String(r)))*e.dir})};export{d as getColumns,y as gridTemplate,g as sortRows};
