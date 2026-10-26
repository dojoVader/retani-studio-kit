import{fetchOne as o}from"@moodle/lms/core/ajax";/**
 * Web service calls behind the course overview table.
 *
 * Components never call fetchOne directly: they go through these functions, so the request shapes live in
 * one place and can be mocked in tests.
 *
 * @module     theme_retani_studio/courseoverview/services/courses
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */const n=["id","fullname","shortname","showcoursecategory","showshortname","visible","enddate"],c=({filter:e,search:r,sort:s,limit:t,offset:u})=>{const i=r.trim()!=="";return o({methodname:"core_course_get_enrolled_courses_by_timeline_classification",args:{classification:i?"search":e.grouping,limit:t,offset:u,sort:s,customfieldname:e.customfieldname??"",customfieldvalue:e.customfieldvalue??"",searchvalue:r.trim(),requiredfields:n}})},l=e=>e.length===0?Promise.resolve([]):o({methodname:"theme_retani_studio_get_course_overview_details",args:{courseids:e}}),m=e=>{const r=[{type:"block_myoverview_user_grouping_preference",value:e.grouping}];e.grouping==="customfield"&&r.push({type:"block_myoverview_user_grouping_customfieldvalue_preference",value:e.customfieldvalue??""}),o({methodname:"core_user_update_user_preferences",args:{preferences:r}}).catch(()=>{})},_=e=>{o({methodname:"core_user_update_user_preferences",args:{preferences:[{type:"block_myoverview_user_view_preference",value:e}]}}).catch(()=>{})};export{l as getCourseDetails,c as getCoursePage,m as saveFilterPreference,_ as saveViewPreference};
