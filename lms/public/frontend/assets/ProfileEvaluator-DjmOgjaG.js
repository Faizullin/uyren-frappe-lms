import{i as N,n as j,g as S,X as D,L as c,R as i,z as L,c as p,o as v,d as n,t as d,p as l,b as s,aL as R,h as U,k as W,F as I,f as O,j as y,I as m,a4 as X,bA as Y,w as h,e as w,P as q,H as $,bN as G,aW as H}from"./index-RevCnO16.js";const J={class:"mt-7 mb-20"},K={class:"mb-4 text-lg font-semibold text-ink-gray-9"},Q={key:0,class:"flex items-center space-x-2 text-sm text-ink-gray-7 bg-surface-gray-1 px-3 py-2 rounded-md w-full text-center"},Z={key:1},ee={class:"grid grid-cols-3 md:grid-cols-4 gap-4 text-sm text-ink-gray-7 mb-4"},ae={class:"grid grid-cols-3 md:grid-cols-4 gap-4 mb-4 group"},te={class:"grid grid-cols-3 md:grid-cols-4 gap-4 mb-4"},le={class:"my-10"},se={class:"mb-4 text-lg font-semibold text-ink-gray-9"},oe={class:"grid grid-cols-2 md:grid-cols-4 gap-4"},ne={class:"mb-4 text-lg font-semibold text-ink-gray-9"},de={key:0,class:"flex items-center bg-surface-green-2 text-green-900 text-sm p-1 rounded-md mb-4 w-fit"},re={__name:"ProfileEvaluator",props:{profile:{type:Object,required:!0}},setup(x){const E=N("$user"),T=window.read_only_mode,g=x;j(()=>{E.data?.name!==g.profile.data?.name&&(window.location.href=`/user/${g.profile.data?.username}`)});const b=S(0),_=S(null),f=S(null),o=D({day:"",start_time:"",end_time:""}),u=c({url:"lms.lms.api.get_evaluator_details",params:{evaluator:g.profile.data?.name},auto:!0,onSuccess(e){e.slots.unavailable_from&&(_.value=e.slots.unavailable_from),e.slots.unavailable_to&&(f.value=e.slots.unavailable_to)}}),P=c({url:"frappe.client.insert",makeParams(e){return{doc:{doctype:"Evaluator Schedule",parent:u.data?.slots.name,parentfield:"schedule",parenttype:"Course Evaluator",...o}}},onSuccess(){i.success(__("Slot added successfully")),u.reload(),b.value=0,o.day="",o.start_time="",o.end_time=""},onError(e){i.error(e.messages?.[0]||e)}}),z=c({url:"frappe.client.set_value",makeParams(e){return{doctype:"Evaluator Schedule",name:e.name,fieldname:e.field,value:e.value}},onSuccess(){i.success(__("Availability updated successfully"))},onError(e){i.error(e.messages?.[0]||e)}}),M=c({url:"frappe.client.delete",makeParams(e){return{doctype:"Evaluator Schedule",name:e.name}},onSuccess(){i.success(__("Slot deleted successfully")),u.reload()},onError(e){i.error(e.messages?.[0]||e)}}),F=c({url:"frappe.client.set_value",makeParams(e){return{doctype:"Course Evaluator",name:u.data?.slots.name,fieldname:e.field,value:e.value}},onSuccess(){i.success(__("Unavailability updated successfully"))},onError(e){i.error(e.messages?.[0]||e)}}),V=(e,t,a)=>{z.submit({name:e,field:t,value:a},{validate(){if(!a)return`Please enter a value for ${H(t)}`}})},k=()=>{!o.day||!o.start_time||!o.end_time||P.submit()},A=e=>{M.submit({name:e})},B=c({url:"frappe.integrations.doctype.google_calendar.google_calendar.authorize_access",makeParams(){return{g_calendar:u.data?.calendar,reauthorize:1}},onSuccess(e){window.open(e.url)}}),C=L(()=>[{label:"Monday",value:"Monday"},{label:"Tuesday",value:"Tuesday"},{label:"Wednesday",value:"Wednesday"},{label:"Thursday",value:"Thursday"},{label:"Friday",value:"Friday"},{label:"Saturday",value:"Saturday"},{label:"Sunday",value:"Sunday"}]);return(e,t)=>(v(),p("div",J,[n("h2",K,d(e.__("My availability")),1),l(T)?(v(),p("div",Q,[s(l(R),{class:"size-4 stroke-1.5"}),n("span",null,d(e.__("You cannot change the availability when the site is being updated.")),1)])):(v(),p("div",Z,[n("div",null,[n("div",ee,[n("div",null,d(e.__("Day")),1),n("div",null,d(e.__("Start Time")),1),n("div",null,d(e.__("End Time")),1)]),l(u).data?(v(!0),p(I,{key:0},O(l(u).data.slots.schedule,a=>(v(),p("div",ae,[s(l(m),{type:"select",options:C.value,modelValue:a.day,"onUpdate:modelValue":r=>a.day=r,onFocusout:y(r=>V(a.name,"day",a.day),["stop"])},null,8,["options","modelValue","onUpdate:modelValue","onFocusout"]),s(l(m),{type:"time",modelValue:a.start_time,"onUpdate:modelValue":r=>a.start_time=r,onFocusout:y(r=>V(a.name,"start_time",a.start_time),["stop"])},null,8,["modelValue","onUpdate:modelValue","onFocusout"]),s(l(m),{type:"time",modelValue:a.end_time,"onUpdate:modelValue":r=>a.end_time=r,onFocusout:y(r=>V(a.name,"end_time",a.end_time),["stop"])},null,8,["modelValue","onUpdate:modelValue","onFocusout"]),s(l(X),{onClick:r=>A(a.name),class:"w-6 h-auto stroke-1.5 text-red-900 rounded-md cursor-pointer p-1 bg-surface-red-2 hidden group-hover:block"},null,8,["onClick"])]))),256)):U("",!0),W(n("div",te,[s(l(m),{type:"select",options:C.value,modelValue:o.day,"onUpdate:modelValue":t[0]||(t[0]=a=>o.day=a),onFocusout:t[1]||(t[1]=y(a=>k(),["stop"]))},null,8,["options","modelValue"]),s(l(m),{type:"time",modelValue:o.start_time,"onUpdate:modelValue":t[2]||(t[2]=a=>o.start_time=a),onFocusout:t[3]||(t[3]=y(a=>k(),["stop"]))},null,8,["modelValue"]),s(l(m),{type:"time",modelValue:o.end_time,"onUpdate:modelValue":t[4]||(t[4]=a=>o.end_time=a),onFocusout:t[5]||(t[5]=y(a=>k(),["stop"]))},null,8,["modelValue"])],512),[[Y,b.value]]),s(l($),{onClick:t[6]||(t[6]=a=>b.value=1)},{prefix:h(()=>[s(l(q),{class:"w-4 h-4 stroke-1.5 text-ink-gray-7"})]),default:h(()=>[w(" "+d(e.__("Add Slot")),1)]),_:1})]),n("div",le,[n("h2",se,d(e.__("I am unavailable")),1),n("div",oe,[s(l(m),{type:"date",label:e.__("From"),modelValue:_.value,"onUpdate:modelValue":t[7]||(t[7]=a=>_.value=a),onBlur:t[8]||(t[8]=()=>{l(F).submit({field:"unavailable_from",value:_.value})})},null,8,["label","modelValue"]),s(l(m),{type:"date",label:e.__("To"),modelValue:f.value,"onUpdate:modelValue":t[9]||(t[9]=a=>f.value=a),onBlur:t[10]||(t[10]=()=>{l(F).submit({field:"unavailable_to",value:f.value})})},null,8,["label","modelValue"])])]),n("div",null,[n("h2",ne,d(e.__("My calendar")),1),l(u).data?.calendar&&l(u).data?.is_authorized?(v(),p("div",de,[s(l(G),{class:"h-4 w-4 stroke-1.5 mr-2"}),w(" "+d(e.__("Your calendar is set.")),1)])):U("",!0),s(l($),{onClick:t[11]||(t[11]=()=>l(B).submit())},{default:h(()=>[w(d(e.__("Authorize Google Calendar Access")),1)]),_:1})])]))]))}};export{re as default};
//# sourceMappingURL=ProfileEvaluator-DjmOgjaG.js.map
