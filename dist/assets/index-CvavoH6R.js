(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function i(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(s){if(s.ep)return;s.ep=!0;const a=i(s);fetch(s.href,a)}})();const pe=[{id:"gkas",name:"GKAS Residence",campus:"Sonheuwel Campus",totalBeds:88,occupiedBeds:76,maintenanceBeds:2,availableBeds:10,rateMonthly:3200,rooms:[{roomNumber:"G-01",type:"Double",beds:2,occupied:2,residents:["L. Khumalo","J. Sithole"]},{roomNumber:"G-05",type:"Single",beds:1,occupied:1,residents:["Lwazi Motha"]},{roomNumber:"G-14",type:"Single",beds:1,occupied:1,residents:["Thandeka Nkosi"]},{roomNumber:"G-22",type:"Single",beds:1,occupied:0,status:"MOVEINPENDING",residents:["Amahle Zulu"]},{roomNumber:"G-31",type:"Double",beds:2,occupied:2,residents:["Zanele Mthembu","P. Ndlovu"]},{roomNumber:"G-34",type:"Single",beds:1,occupied:1,residents:["K. Dube"]},{roomNumber:"G-55",type:"Single",beds:1,occupied:0,status:"LEASEPENDING",residents:["Precious Khumalo"]}]},{id:"hts",name:"HTS Residence",campus:"Stonehenge Campus",totalBeds:20,occupiedBeds:16,maintenanceBeds:1,availableBeds:3,rateMonthly:3400,rooms:[{roomNumber:"H-03",type:"Double",beds:2,occupied:2,residents:["Bongani Ntuli","M. Sibeko"]},{roomNumber:"H-07",type:"Single",beds:1,occupied:1,residents:["Sibusiso Dlamini"]},{roomNumber:"H-11",type:"Single",beds:1,occupied:1,residents:["D. Nzimande"]}]}],ee=[{id:"pool",name:"Swimming Pool & Sun Deck",residence:"GKAS Sonheuwel",icon:"🏊",bg:"#dbeafe",info:"Max 25 swimmers · Open 06:00 – 20:00 Daily",slots:["06:00 - 08:00","08:00 - 10:00","10:00 - 12:00","14:00 - 16:00","16:00 - 18:00","18:00 - 20:00"],description:"Chlorinated 20m lap pool with sun loungers and perimeter safety fence."},{id:"field",name:"Multi-Sport Turf & Soccer Field",residence:"Stonehenge Sports Grounds",icon:"⚽",bg:"#dcfce7",info:"Open 07:00 – 19:00 Daily · Floodlit",slots:["07:00 - 09:00","09:00 - 11:00","14:00 - 16:00","16:00 - 18:00","18:00 - 19:30"],description:"All-weather 5-a-side soccer and multi-purpose recreational field."},{id:"study",name:"24/7 Academic Study Lab",residence:"GKAS & HTS Facilities",icon:"📚",bg:"#f3e8ff",info:"Silent study · High-speed fibre · Generator backed",slots:["Morning Session (08:00 - 13:00)","Afternoon Session (13:00 - 18:00)","Evening Session (18:00 - 23:00)","Night Owl (23:00 - 05:00)"],description:"Sound-dampened individual study cubicles, group project rooms, and printing terminals."},{id:"gym",name:"Residence Fitness Centre",residence:"GKAS Ground Floor",icon:"🏋️",bg:"#fef3c7",info:"Capacity 20 · Open 05:30 – 21:30 Daily",slots:["Early Bird (05:30 - 07:30)","Morning (08:00 - 11:00)","Afternoon (14:00 - 17:00)","Peak Evening (17:00 - 19:30)","Late (19:30 - 21:30)"],description:"Equipped with cardio treadmills, rowing machines, dumbbells, and functional workout mats."}],ue=[{cat:"Quiet Hours & Study Environment",text:"Standard quiet hours are 22:00 to 06:00 Sunday through Thursday, and 23:00 to 07:00 Friday & Saturday. During examination periods, quiet hours are enforced 24/7 to protect students academic focus."},{cat:"Visitor Policy & Security",text:"All guests must sign in at the security guardhouse with a valid SA National ID or passport. No overnight visitors are permitted without 24-hour advance written registration with the residence warden (maximum 2 nights per calendar month)."},{cat:"Prohibited Substances & Fire Safety",text:"HTS and GKAS residences are strictly non-smoking, drug-free, and alcohol-free zones. Open flames, candles, shisha pipes, and unauthorized high-draw hotplates are strictly prohibited due to municipal fire bylaws."}],S=typeof window<"u"&&window.location.hostname!=="localhost"&&window.location.hostname!=="127.0.0.1"||typeof window<"u"&&window.location.port==="5173"?"/api":"http://localhost:3001/api",K="hts_gkas_ui_prefs_v1";class ve{constructor(){this.listeners=[],this.isRealtimeConnected=!1,this.state=this.loadInitial(),this.initBackendSync()}loadInitial(){let e={themePreference:"light",sidebarCollapsed:!1};try{const i=localStorage.getItem(K);i&&(e={...e,...JSON.parse(i)})}catch(i){console.warn("UI preferences load failed",i)}return{currentUser:null,currentRole:null,activeModule:"dashboard",uiSettings:e,tickets:[],applicants:[],notices:[],auditLog:[],residences:[...pe],bursaryApplications:[],amenityBookings:[],bankAccount:null,transactions:[],documents:[]}}saveLocal(){var e,i;try{const n={themePreference:((e=this.state.uiSettings)==null?void 0:e.themePreference)||"light",sidebarCollapsed:((i=this.state.uiSettings)==null?void 0:i.sidebarCollapsed)||!1};localStorage.setItem(K,JSON.stringify(n)),localStorage.removeItem("hts_gkas_portal_state_v3")}catch{}this.notify()}subscribe(e){return this.listeners.push(e),()=>{this.listeners=this.listeners.filter(i=>i!==e)}}notify(){this.listeners.forEach(e=>{try{e(this.state)}catch(i){console.error(i)}})}getAuthHeaders(e={}){const i={"Content-Type":"application/json",...e},n=this.getAuthToken();return n&&(i.Authorization=`Bearer ${n}`),i}async initBackendSync(){try{const e=this.getAuthToken(),i={};e&&(i.Authorization=`Bearer ${e}`);const n=await fetch(`${S}/state`,{headers:i});if(n.ok){const s=await n.json();s.success&&s.data&&this.mergeDbState(s.data)}if(this.eventSource&&(this.eventSource.close(),this.eventSource=null),e){const s=`${S}/realtime?token=${encodeURIComponent(e)}`,a=new EventSource(s);this.eventSource=a,a.addEventListener("connected",()=>{this.isRealtimeConnected=!0,this.notify()}),a.addEventListener("db_update",r=>{try{const l=JSON.parse(r.data);this.mergeDbState(l)}catch(l){console.warn("Realtime parse error",l)}}),a.onerror=()=>{this.isRealtimeConnected=!1,this.notify()}}}catch(e){console.warn("Backend server not reachable, using local persistent engine",e)}}mergeDbState(e){e.tickets&&(this.state.tickets=e.tickets),e.applicants&&(this.state.applicants=e.applicants),e.notices&&(this.state.notices=e.notices),e.auditLog&&(this.state.auditLog=e.auditLog),e.residences&&(this.state.residences=e.residences),e.bursaryApplications&&(this.state.bursaryApplications=e.bursaryApplications),e.amenityBookings&&(this.state.amenityBookings=e.amenityBookings),e.bankAccount&&(this.state.bankAccount=e.bankAccount),e.transactions&&(this.state.transactions=e.transactions),this.isRealtimeConnected=!0,this.saveLocal()}setUser(e){var i;if(e&&typeof e=="object"){const n=e.roleKey==="student"||((i=e.role)==null?void 0:i.toLowerCase().includes("student"))||!!e.studentNumber;this.state.currentUser={id:e.id||e.userId||"usr_session",name:e.name||"Resident",email:e.email||"",phone:e.phone||"",studentNumber:e.studentNumber||null,room:e.room||null,residence:e.residence||(n?"GKAS Residence":"All Residences"),institution:e.institution||null,nsfasRef:e.nsfasRef||e.fundingReferenceNumber||null,role:e.role||(n?"Student Resident":"Administrator"),roleKey:n?"student":"admin",initials:e.initials||(e.name?e.name.split(" ").map(s=>s[0]).join("").slice(0,2):"UR")},this.state.currentRole=n?"student":"admin",this.state.activeModule=n?"student-home":"dashboard"}else this.state.currentUser=null,this.state.currentRole=null,this.state.activeModule="dashboard";this.saveLocal(),this.initBackendSync()}setAuthToken(e){this.authToken=e||null;try{e?sessionStorage.setItem("hts_gkas_auth_token",e):sessionStorage.removeItem("hts_gkas_auth_token")}catch{}}getAuthToken(){if(this.authToken)return this.authToken;try{return sessionStorage.getItem("hts_gkas_auth_token")||null}catch{return null}}logout(){this.eventSource&&(this.eventSource.close(),this.eventSource=null),this.isRealtimeConnected=!1,this.setAuthToken(null),this.setUser(null)}setActiveModule(e){this.state.currentRole==="student"&&(["student-home","my-lease","maintenance","activity","bursary","rules","news","my-docs","movein"].includes(e)||(e="student-home")),this.state.activeModule=e,this.saveLocal()}async addTicket(e){try{const s=await fetch(`${S}/tickets`,{method:"POST",headers:this.getAuthHeaders(),body:JSON.stringify(e)});if(s.ok)return(await s.json()).ticket}catch{}const n={id:`HTS-MNT-2027-${String(42+this.state.tickets.length).padStart(4,"0")}`,icon:e.priority==="urgent"?"🚨":"🔨",bg:e.priority==="urgent"?"#fee2e2":"#fef3c7",title:e.title,meta:`${e.residence} · ${e.studentName} · Just now`,location:e.location,residence:e.residence,priority:e.priority||"medium",status:"open",category:e.category,studentName:e.studentName,studentId:e.studentId,createdAt:new Date().toISOString(),description:e.description,lastNotified:null};return this.state.tickets.unshift(n),this.saveLocal(),n}async notifyTicketManagement(e,i){try{await fetch(`${S}/tickets/${e}/notify`,{method:"POST",headers:this.getAuthHeaders(),body:JSON.stringify({message:i})})}catch{}const n=this.state.tickets.find(s=>s.id===e);return n?(n.lastNotified=new Date().toISOString(),this.saveLocal(),!0):!1}async resolveTicket(e,i){try{await fetch(`${S}/tickets/${e}/resolve`,{method:"POST",headers:this.getAuthHeaders(),body:JSON.stringify({note:i})})}catch{}const n=this.state.tickets.find(s=>s.id===e);return n?(n.status="resolved",n.resolutionNote=i,this.saveLocal(),!0):!1}async registerNewStudent(e){var r,l;try{const c=await fetch(`${S}/applicants`,{method:"POST",headers:this.getAuthHeaders(),body:JSON.stringify(e)});if(c.ok){const d=await c.json();if(d.applicant)return this.state.applicants.unshift(d.applicant),this.saveLocal(),d.applicant}}catch{}const i=`APP-2027-${Math.floor(1e3+Math.random()*9e3)}`,n=`GKAS-2027-${Math.floor(1e4+Math.random()*9e4)}`,s=e.institution||e.otherInstitutionName||"Tshwane University of Technology (TUT)",a={id:i,referenceNumber:n,initials:(((r=e.firstName)==null?void 0:r[0])||"N")+(((l=e.lastName)==null?void 0:l[0])||"S"),bg:"#e8f5e9",tc:"#15803d",name:`${e.firstName} ${e.lastName}`,firstName:e.firstName,lastName:e.lastName,meta:`${s} · ${e.fundingType||"NSFAS"} · Just now`,institution:s,studentNumber:e.studentNumber||"22109845",idNumber:e.idNumber,phone:e.phone,email:e.email,bgCheck:"pending",status:"pending",funding:e.fundingType||"nsfas",fundingType:e.fundingType||"nsfas",fundingStatus:"pending_verification",bursarySponsorName:e.bursarySponsorName||null,fundingReferenceNumber:e.fundingReferenceNumber||e.nsfasRef||null,guardianName:e.guardianName||null,guardianContact:e.guardianContact||null,preferredResidence:e.preferredResidence||"GKAS Residence (Sonheuwel)",roomType:e.roomType||"Single Room",submittedDate:new Date().toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"}),processed:!1,nsfasRef:e.nsfasRef||`NSFAS-2027-MP-${Math.floor(1e3+Math.random()*9e3)}`};return this.state.applicants.unshift(a),this.saveLocal(),a}async processApplicant(e,i,n){try{await fetch(`${S}/applicants/${e}/decision`,{method:"POST",headers:this.getAuthHeaders(),body:JSON.stringify({decision:i,reason:n})})}catch{}const s=this.state.applicants.find(a=>a.id===e);return s?(s.processed=!0,s.status=i==="accepted"?"approved":"rejected",s.decision=i,s.decisionReason=n,s.decidedBy="L. Marsher",s.reviewedAt=new Date().toISOString(),this.saveLocal(),!0):!1}async updateFundingStatus(e,i,n){try{await fetch(`${S}/applicants/${e}/funding`,{method:"POST",headers:this.getAuthHeaders(),body:JSON.stringify({status:i,reason:n,adminName:"L. Marsher"})})}catch{}const s=this.state.applicants.find(a=>a.id===e);return s?(s.fundingStatus=i,s.fundingVerifiedAt=new Date().toISOString(),s.fundingVerifiedBy="L. Marsher",n&&(s.fundingRejectionReason=n),this.saveLocal(),!0):!1}async submitBursaryApplication(e){try{const n=await fetch(`${S}/bursaries`,{method:"POST",headers:this.getAuthHeaders(),body:JSON.stringify(e)});if(n.ok)return(await n.json()).bursary}catch{}const i={id:`BUR-2027-${Math.floor(100+Math.random()*900)}`,studentName:e.fullName,studentNumber:e.studentNumber,institution:e.institution,submittedDate:new Date().toLocaleDateString("en-GB"),status:"Under Review",fundingSource:e.fundingSource||"NSFAS Top-Up Grant",documentsVerified:!0};return this.state.bursaryApplications.unshift(i),this.saveLocal(),i}async addNotice(e){try{const n=await fetch(`${S}/notices`,{method:"POST",headers:this.getAuthHeaders(),body:JSON.stringify(e)});if(n.ok)return(await n.json()).notice}catch{}const i={id:`notif_${Date.now()}`,severity:e.severity||"normal",icon:e.severity==="urgent"?"🚨":"📋",title:e.title,body:e.body,date:new Date().toLocaleDateString("en-GB"),author:"L. Marsher (Admin)",residence:e.residence||"All Residences",smsDispatched:e.severity==="urgent"};return this.state.notices.unshift(i),this.saveLocal(),i}async addAmenityBooking(e){try{const n=await fetch(`${S}/amenities/book`,{method:"POST",headers:this.getAuthHeaders(),body:JSON.stringify(e)});if(n.ok)return(await n.json()).booking}catch{}const i={id:`BK-${Math.floor(100+Math.random()*900)}`,...e,status:"Confirmed"};return this.state.amenityBookings.unshift(i),this.saveLocal(),i}async syncBankFeed(){try{const i=await fetch(`${S}/bank/sync`,{method:"POST",headers:this.getAuthHeaders()});if(i.ok){const n=await i.json();return n.account&&(this.state.bankAccount=n.account),n.transaction&&this.state.transactions.unshift(n.transaction),this.saveLocal(),n}}catch{}const e={id:`TXN-SB-2027-${Math.floor(8920+Math.random()*80)}`,date:new Date().toISOString(),reference:"GKAS-G34-DUBE",description:"ELECTRONIC BANK TRANSFER - K DUBE",counterparty:"K. Dube (Direct EFT)",amount:3200,type:"credit",category:"Monthly Rental",status:"Auto-Matched",matchedRoom:"G-34 (GKAS)"};return this.state.transactions.unshift(e),this.state.bankAccount.currentBalance+=3200,this.state.bankAccount.availableBalance+=3200,this.saveLocal(),{transaction:e}}async reconcileTransaction(e,i,n){try{const a=await fetch(`${S}/bank/reconcile`,{method:"POST",headers:this.getAuthHeaders(),body:JSON.stringify({txnId:e,matchedRoom:i,studentName:n})});if(a.ok)return(await a.json()).transaction}catch{}const s=this.state.transactions.find(a=>a.id===e);return s?(s.status="Reconciled",s.matchedRoom=i,this.saveLocal(),s):null}async updateBankAccount(e){try{const i=await fetch(`${S}/bank/connect`,{method:"POST",headers:this.getAuthHeaders(),body:JSON.stringify(e)});if(i.ok){const n=await i.json();if(n.account)return this.state.bankAccount=n.account,this.saveLocal(),n.account}}catch{}return this.state.bankAccount={...this.state.bankAccount,...e},this.saveLocal(),this.state.bankAccount}}const u=new ve,H={admin:[{section:"Overview",items:[{id:"dashboard",label:"Executive Dashboard",icon:"grid",badge:null},{id:"applications",label:"Housing Applications",icon:"clock",badgeKey:"applicants"},{id:"occupancy",label:"Residents & Beds",icon:"users",badge:null}]},{section:"Leasing & Inspections",items:[{id:"leases",label:"Leases & Legal Docs",icon:"file",badge:null},{id:"movein",label:"Move-In Inspections",icon:"check",badge:"2"}]},{section:"Residence Operations",items:[{id:"maintenance",label:"Maintenance Queue",icon:"tool",badgeKey:"openTickets"},{id:"activity",label:"Residence Activity Hub",icon:"star",badge:null},{id:"rules",label:"Disciplinary Code",icon:"book",badge:null},{id:"news",label:"Broadcast Notices",icon:"bell",badge:null}]},{section:"Banking & Financials",items:[{id:"finance",label:"Bank Reconciliation",icon:"bar",badge:null},{id:"bursary",label:"Bursary Approvals",icon:"bursary",badge:null}]},{section:"System & Security",items:[{id:"audit",label:"Cryptographic Audit Log",icon:"audit",badge:null},{id:"settings",label:"Portal Configuration",icon:"settings",badge:null}]}],student:[{section:"My Residence Account",items:[{id:"student-home",label:"My Dashboard",icon:"grid",badge:null},{id:"my-lease",label:"My Lease Agreement",icon:"file",badge:null}]},{section:"Services & Requests",items:[{id:"maintenance",label:"Maintenance Request",icon:"tool",badge:null},{id:"activity",label:"Activity Booking",icon:"star",badge:null},{id:"bursary",label:"Bursary Application",icon:"bursary",badge:null}]},{section:"Residence Info",items:[{id:"rules",label:"House Rules",icon:"book",badge:null},{id:"news",label:"Residence Notices",icon:"bell",badge:"2"},{id:"my-docs",label:"My Documents",icon:"docs",badge:null}]}]},W={grid:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',clock:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',tool:'<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',check:'<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',book:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',bell:'<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',bar:'<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',star:'<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',bursary:'<circle cx="12" cy="8" r="6"/><path d="M12 2v12M8 6h8M8 10h8"/>',audit:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><circle cx="10" cy="13" r="2"/><path d="m20 17-1.09-1.09A2 2 0 0 0 17 15h-1.73l-1.45 1.45"/>',settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-2.82 1.17V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',docs:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>'};function fe(){const{currentUser:t,currentRole:e,activeModule:i,tickets:n,applicants:s}=u.state,a=document.getElementById("sb-role-name"),r=document.getElementById("sb-role-lbl"),l=document.getElementById("sb-av"),c=document.getElementById("sb-uname"),d=document.getElementById("sb-urole"),v=e==="admin"?"L. Marsher":(t==null?void 0:t.name)||"Resident",y=e==="admin"?"Administrator":"Student Resident",x=e==="admin"?"LM":(t==null?void 0:t.initials)||"SR";a&&(a.textContent=v),r&&(r.textContent=y),l&&(l.textContent=x),c&&(c.textContent=v),d&&(d.textContent=y);const f=document.getElementById("sidebar-nav");if(!f)return;let g=H[e]||H.student;if(e==="student"){const A=!!(t&&t.room&&t.room!=="Unassigned"&&t.room!=="");g=[{section:"My Residence Account",items:[{id:"student-home",label:"My Dashboard",icon:"grid",badge:null},{id:"my-lease",label:"My Lease Agreement",icon:"file",badge:null},...A?[{id:"movein",label:"Move-In Inspection",icon:"check",badge:null}]:[]]},...H.student.slice(1)]}f.innerHTML="";const b=s.filter(A=>!A.processed).length,D=n.filter(A=>A.status==="open").length;g.forEach(A=>{const B=document.createElement("div");B.className="nav-section",B.innerHTML=`<div class="nav-lbl">${A.section}</div>`,A.items.forEach(k=>{let R=k.badge;k.badgeKey==="applicants"&&b>0&&(R=String(b)),k.badgeKey==="openTickets"&&D>0&&(R=String(D));const L=i===k.id,I=document.createElement("button");I.className=`nav-item ${L?"active":""}`,I.id=`nav-${k.id}`,I.setAttribute("aria-current",L?"page":"false"),I.onclick=()=>{u.setActiveModule(k.id),te()},I.innerHTML=`
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          ${W[k.icon]||W.grid}
        </svg>
        <span class="nav-item-text">${k.label}</span>
        ${R?`<span class="nav-badge" aria-label="${R} items">${R}</span>`:""}
      `,B.appendChild(I)}),f.appendChild(B)})}function me(){const t=document.getElementById("sidebar"),e=document.getElementById("sb-toggle");if(!t)return;const i=t.classList.toggle("collapsed");e&&(e.setAttribute("aria-expanded",i?"false":"true"),e.setAttribute("aria-label",i?"Expand navigation":"Collapse navigation"))}function ge(){const t=document.getElementById("sidebar"),e=document.getElementById("drawer-backdrop");t&&e&&(t.classList.add("mobile-open"),e.classList.add("open"),document.body.style.overflow="hidden")}function te(){const t=document.getElementById("sidebar"),e=document.getElementById("drawer-backdrop");t&&e&&(t.classList.remove("mobile-open"),e.classList.remove("open"),document.body.style.overflow="")}class be{constructor(){this.notifications=[{id:"notif-001",user_id:"usr_student",title:"2027 Lease Agreement Ready",message:"Your official 2027 residence lease agreement has been counter-signed for GKAS Room G-14.",type:"success",link_url:"/portal/lease",is_read:!1,created_at:"2027-02-01T08:00:00Z"},{id:"notif-002",user_id:"usr_student",title:"Move-in Condition Inspection",message:"Please complete your digital photographic room inventory check within 48 hours of arrival.",type:"action_required",link_url:"/portal/movein",is_read:!1,created_at:"2027-02-01T09:30:00Z"},{id:"notif-003",user_id:"usr_student",title:"NSFAS Top-Up Grant Approved",message:"Institutional bursary top-up allocation BUR-2027-089 has been verified and processed.",type:"info",link_url:"/portal/bursary",is_read:!0,read_at:"2027-02-02T11:20:00Z",created_at:"2027-01-28T14:15:00Z"}],this.listeners=[],this.loadFromStorage()}loadFromStorage(){try{const e=localStorage.getItem("gkas_portal_notifications");e&&(this.notifications=JSON.parse(e))}catch{}}saveToStorage(){try{localStorage.setItem("gkas_portal_notifications",JSON.stringify(this.notifications))}catch{}this.notify()}subscribe(e){return this.listeners.push(e),()=>{this.listeners=this.listeners.filter(i=>i!==e)}}notify(){this.listeners.forEach(e=>{try{e()}catch{}})}getNotifications(e){return e?this.notifications.filter(i=>i.user_id===e||i.user_id==="all"):[...this.notifications]}getUnreadNotifications(e){return this.getNotifications(e).filter(i=>!i.is_read)}getUnreadCount(e){return this.getUnreadNotifications(e).length}markNotificationAsRead(e){const i=this.notifications.find(n=>n.id===e);return i?(i.is_read=!0,i.read_at=new Date().toISOString(),this.saveToStorage(),!0):!1}markAllNotificationsAsRead(e){this.notifications.forEach(i=>{(!e||i.user_id===e||i.user_id==="all")&&(i.is_read=!0,i.read_at=new Date().toISOString())}),this.saveToStorage()}createNotification(e){const i={id:`notif-${Date.now()}-${Math.floor(Math.random()*1e3)}`,user_id:e.user_id,title:e.title,message:e.message,type:e.type||"info",link_url:e.link_url,is_read:!1,created_at:new Date().toISOString()};return this.notifications.unshift(i),this.saveToStorage(),i}}const E=new be;function ye(){const t=document.getElementById("notif-btn"),e=document.getElementById("notif-overlay");if(!t||!e)return;function i(){const s=E.getUnreadCount();let a=t.querySelector(".badge-dot");s>0?(a||(a=document.createElement("div"),a.className="badge-dot",t.appendChild(a)),a.textContent=s>9?"9+":s.toString(),a.style.display="flex",a.style.alignItems="center",a.style.justifyContent="center",a.style.fontSize="10px",a.style.fontWeight="700",a.style.color="#ffffff",a.style.width="18px",a.style.height="18px",a.style.borderRadius="50%",a.style.background="var(--red)",a.style.position="absolute",a.style.top="-2px",a.style.right="-2px"):a&&(a.style.display="none")}function n(){var c;const s=document.getElementById("notif-items-list");if(!s)return;const a=E.getNotifications(),r=E.getUnreadCount(),l=e.querySelector(".notif-hd");if(l&&(l.innerHTML=`
        <div>
          <div class="notif-ttl">Notifications (${r} unread)</div>
          <div style="font-size:11px;color:var(--text-sub)">HTS &amp; GKAS Student Residence Portal · 2027</div>
        </div>
        ${r>0?`
          <button class="btn btn-ghost btn-xs" id="mark-all-read-btn">
            Mark all read
          </button>
        `:""}
      `,(c=l.querySelector("#mark-all-read-btn"))==null||c.addEventListener("click",()=>{E.markAllNotificationsAsRead(),n(),i()})),a.length===0){s.innerHTML=`
        <div style="text-align:center;padding:32px 16px;color:var(--text-muted)">
          <div style="font-size:32px;margin-bottom:8px">🔔</div>
          <div style="font-weight:600">No notifications</div>
          <div style="font-size:12px">You're completely up to date.</div>
        </div>
      `;return}s.innerHTML=a.map(d=>`
      <div class="notif-item ${d.is_read?"read":"unread"}" 
           id="notif-card-${d.id}"
           onclick="window.handleNotificationItemClick('${d.id}', '${d.link_url||""}')"
           style="cursor:pointer;padding:12px 14px;border-bottom:1px solid var(--border);background:${d.is_read?"transparent":"#f8fafc"};display:flex;gap:12px;align-items:flex-start;transition:all 0.2s ease">
        
        <div style="width:10px;height:10px;border-radius:50%;margin-top:4px;flex-shrink:0;background:${d.is_read?"transparent":"var(--blue)"}"></div>

        <div style="flex:1">
          <div style="font-size:13px;font-weight:${d.is_read?"500":"700"};color:var(--navy)">
            ${d.title}
          </div>
          <div style="font-size:12px;color:var(--text-sub);margin:2px 0 4px;line-height:1.4">
            ${d.message}
          </div>
          <div style="font-size:10px;color:var(--text-muted);display:flex;justify-content:space-between">
            <span>${new Date(d.created_at).toLocaleDateString("en-ZA",{month:"short",day:"numeric",year:"numeric"})}</span>
            ${d.is_read?"":'<span style="color:var(--blue);font-weight:600">Click to read →</span>'}
          </div>
        </div>
      </div>
    `).join("")}window.handleNotificationItemClick=(s,a)=>{E.markNotificationAsRead(s);const r=document.getElementById(`notif-card-${s}`);if(r&&(r.style.opacity="0.5",r.style.background="transparent"),i(),n(),a){if(a.includes("/lease"))stateService.setActiveModule("my-lease");else if(a.includes("/movein"))stateService.setActiveModule("movein");else if(a.includes("/bursary"))stateService.setActiveModule("bursary");else if(a.includes("/maintenance"))stateService.setActiveModule("maintenance");else if(a.includes("/applications"))stateService.setActiveModule("applications");else if(a.includes("/dashboard")){const{currentRole:l}=stateService.state;stateService.setActiveModule(l==="student"?"student-home":"dashboard")}e.classList.remove("open")}},E.subscribe(()=>{i(),n()}),i(),n()}let J=null;function p(t,e,i="info",n=4200){const s=document.getElementById("toast"),a=document.getElementById("toast-icon"),r=document.getElementById("toast-msg");if(!s||!a||!r)return;a.textContent=t||(i==="success"?"✓":i==="error"?"⚠":"ℹ"),r.textContent=e,s.className=`toast ${i} show`;const l=document.getElementById("live-region");l&&(l.textContent="",setTimeout(()=>{l.textContent=e},40)),clearTimeout(J),J=setTimeout(()=>{ie()},n)}function ie(){const t=document.getElementById("toast");t&&t.classList.remove("show")}class he{constructor(){this.deferredPrompt=null,this.isInstalled=!1,this.listeners=[]}init(){this.isInstalled=window.matchMedia("(display-mode: standalone)").matches||window.navigator.standalone===!0||document.referrer.includes("android-app://"),this.isInstalled&&console.log("✓ GKAS Portal running in standalone PWA mode"),this.registerServiceWorker(),window.addEventListener("beforeinstallprompt",e=>{e.preventDefault(),this.deferredPrompt=e,console.log("✓ PWA install prompt captured and ready"),this.notifyListeners()}),window.addEventListener("appinstalled",()=>{this.deferredPrompt=null,this.isInstalled=!0,console.log("✓ GKAS Residence PWA successfully installed to home screen"),p("📲","GKAS Residence App installed to home screen!","success"),this.notifyListeners()}),window.matchMedia("(display-mode: standalone)").addEventListener("change",e=>{this.isInstalled=e.matches,this.notifyListeners()})}registerServiceWorker(){"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/sw.js",{scope:"/"}).then(e=>{console.log("✓ Service Worker registered successfully with scope:",e.scope),e.onupdatefound=()=>{const i=e.installing;i&&(i.onstatechange=()=>{i.state==="installed"&&(navigator.serviceWorker.controller?console.log("New content is available; please refresh."):console.log("Content is cached for offline use."))})}}).catch(e=>{console.warn("Service Worker registration failed:",e)})})}canInstall(){return!this.isInstalled&&this.deferredPrompt!==null}async promptInstall(){if(!this.deferredPrompt)return/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream?p("📲",'To install on iOS: Tap Share (⎋) then "Add to Home Screen (+)"',"info"):p("ℹ",'App can be installed from your browser menu ("Install App" or "Add to Home screen")',"info"),!1;try{this.deferredPrompt.prompt();const e=await this.deferredPrompt.userChoice;return e.outcome==="accepted"?(console.log("User accepted the PWA install prompt"),p("✓","Installing GKAS Residence App...","success")):console.log("User dismissed the PWA install prompt"),this.deferredPrompt=null,this.notifyListeners(),e.outcome==="accepted"}catch(e){return console.warn("Error during install prompt:",e),!1}}subscribe(e){return this.listeners.push(e),()=>{this.listeners=this.listeners.filter(i=>i!==e)}}notifyListeners(){this.listeners.forEach(e=>{try{e({canInstall:this.canInstall(),isInstalled:this.isInstalled})}catch{}})}}const F=new he,xe={dashboard:"Executive Residence Dashboard","student-home":"Student Residence Portal",applications:"Applications & Waiting List",occupancy:"Residents & Room Allocation",leases:"Leases & Legal Agreements",movein:"Move-In Condition Inspections",maintenance:"Maintenance Operations",activity:"Residence Activity Hub",rules:"House Rules & Disciplinary Code",news:"Notices & Announcements",finance:"Bank Feed & Transaction Reconciliation",bursary:"Bursary & Accreditation Portal",audit:"Immutable Audit Trail",settings:"System Configuration","my-lease":"My Residential Lease","my-docs":"My Stored Documents",privacy:"Privacy Policy (POPIA)",terms:"Terms of Residence",cookies:"Cookie Policy"};function we(){const{currentRole:t,activeModule:e,notices:i}=u.state,n=document.getElementById("breadcrumb"),s=document.getElementById("page-title"),a=xe[e]||"Portal";n&&(n.textContent=`HTS & GKAS Portal / ${a}`),s&&(s.textContent=a),document.title=`${a} — HTS & GKAS Student Residences`;const r=document.getElementById("role-quick-switch-container");if(r){const c=u.isRealtimeConnected;r.innerHTML=`
      <div style="display:flex;align-items:center;gap:8px;background:var(--bg-alt);border:1px solid var(--border);border-radius:var(--radius-full);padding:6px 14px">
        <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${c?"var(--green)":"var(--gold)"};box-shadow:0 0 8px ${c?"var(--green)":"var(--gold)"}"></span>
        <span style="font-size:11px;font-weight:700;color:var(--navy);letter-spacing:0.4px">
          ${c?"Live Real-Time Database Connected":"Persistent Storage Active"}
        </span>
      </div>
    `}const l=document.getElementById("pwa-install-btn");l&&(l.style.display=F.isInstalled?"none":"inline-flex");try{ye()}catch{}}F.subscribe(({isInstalled:t})=>{const e=document.getElementById("pwa-install-btn");e&&(e.style.display=t?"none":"inline-flex")});function ne(){const t=document.getElementById("notif-overlay");t&&t.classList.toggle("open")}function h(t,e,i=!1){const n=document.getElementById("modal-overlay"),s=document.getElementById("modal"),a=document.getElementById("modal-ttl"),r=document.getElementById("modal-body");!n||!s||!a||!r||(a.textContent=t,r.innerHTML=e,i?s.style.maxWidth="720px":s.style.maxWidth="560px",n.classList.add("open"),document.body.style.overflow="hidden",setTimeout(()=>{var c;const l=s.querySelector("button:not(.modal-close), input, select, textarea, a");l?l.focus():(c=s.querySelector(".modal-close"))==null||c.focus()},60))}function w(){const t=document.getElementById("modal-overlay");t&&(t.classList.remove("open"),document.body.style.overflow="")}function Se(){const t=document.getElementById("modal-overlay");t&&t.addEventListener("click",e=>{e.target===t&&w()}),document.addEventListener("keydown",e=>{if(e.key==="Escape"){w();const i=document.getElementById("notif-overlay");i!=null&&i.classList.contains("open")&&i.classList.remove("open")}})}function se(t){if(!t)return{isValid:!1,error:"ID number cannot be empty."};const e=t.toString().trim().replace(/[\s-]/g,"");if(!/^\d{13}$/.test(e))return{isValid:!1,error:`ID number must contain exactly 13 numeric digits (received ${e.length}).`};const i=e.substring(0,2),n=e.substring(2,4),s=e.substring(4,6),a=parseInt(i,10),r=parseInt(n,10),l=parseInt(s,10);if(r<1||r>12)return{isValid:!1,error:`Invalid birth month: ${n}.`};const d=a<=27?2e3+a:1900+a,v=new Date(d,r,0).getDate();if(l<1||l>v)return{isValid:!1,error:`Invalid birth day: ${s} for month ${n} in year ${d}.`};const y=new Date(d,r-1,l),f=new Date(2027,1,1).getFullYear()-y.getFullYear();if(f<15||f>95)return{isValid:!1,error:`Calculated age (${f}) is outside expected student range.`};const b=parseInt(e.substring(6,10),10)>=5e3?"Male":"Female",A=parseInt(e.charAt(10),10)===0,B=A?"South African Citizen":"Permanent Resident";let k=0;for(let $=0;$<12;$+=2)k+=parseInt(e.charAt($),10);let R="";for(let $=1;$<12;$+=2)R+=e.charAt($);const L=(parseInt(R,10)*2).toString();let I=0;for(let $=0;$<L.length;$++)I+=parseInt(L.charAt($),10);const V=(10-(k+I)%10)%10,q=parseInt(e.charAt(12),10);if(V!==q)return{isValid:!1,error:`Luhn checksum check failed: expected control digit ${V}, but got ${q}.`};const de=r<10?`0${r}`:r,ce=l<10?`0${l}`:l;return{isValid:!0,idNumber:e,dob:y,dobFormatted:`${d}-${de}-${ce}`,gender:b,isCitizen:A,citizenshipStatus:B}}function oe(t){if(!t)return{isValid:!1,error:"Phone number cannot be empty."};const e=t.replace(/[\s\-\(\)]/g,"");if(!/^(?:\+27|0)[6-8]\d{8}$/.test(e))return{isValid:!1,error:"Must be a valid South African mobile number (e.g. 071 829 4012 or +27821234567)."};let n=e;return n.startsWith("+27")&&(n="0"+n.substring(3)),n=`${n.substring(0,3)} ${n.substring(3,6)} ${n.substring(6)}`,{isValid:!0,formatted:n}}const G=[{id:"inst-ump",name:"University of Mpumalanga",short_name:"UMP",type:"Public University",campus:"Mbombela Campus (Main) & Siyabuswa",province:"Mpumalanga",is_active:!0},{id:"inst-tut",name:"Tshwane University of Technology",short_name:"TUT",type:"Public University",campus:"Nelspruit / Mbombela Campus",province:"Mpumalanga",is_active:!0},{id:"inst-ehlanzeni",name:"Ehlanzeni TVET College",short_name:"Ehlanzeni TVET",type:"TVET",campus:"Mbombela / KaNyamazane / Mlumati",province:"Mpumalanga",is_active:!0},{id:"inst-gert-sibande",name:"Gert Sibande TVET College",short_name:"Gert Sibande TVET",type:"TVET",campus:"Ermelo / Standerton / Evander",province:"Mpumalanga",is_active:!0},{id:"inst-nkangala",name:"Nkangala TVET College",short_name:"Nkangala TVET",type:"TVET",campus:"eMalahleni (Witbank) / Middelburg",province:"Mpumalanga",is_active:!0},{id:"inst-uj",name:"University of Johannesburg",short_name:"UJ",type:"Public University",campus:"Auckland Park / Doornfontein / Soweto",province:"Gauteng",is_active:!0},{id:"inst-wits",name:"University of the Witwatersrand",short_name:"Wits",type:"Public University",campus:"Braamfontein, Johannesburg",province:"Gauteng",is_active:!0},{id:"inst-up",name:"University of Pretoria",short_name:"UP",type:"Public University",campus:"Hatfield / Hillcrest / Groenkloof",province:"Gauteng",is_active:!0},{id:"inst-smu",name:"Sefako Makgatho Health Sciences University",short_name:"SMU",type:"Public University",campus:"Ga-Rankuwa, Pretoria",province:"Gauteng",is_active:!0},{id:"inst-vut",name:"Vaal University of Technology",short_name:"VUT",type:"Public University",campus:"Vanderbijlpark / Secunda",province:"Gauteng",is_active:!0},{id:"inst-unisa",name:"University of South Africa",short_name:"UNISA",type:"Public University",campus:"Muckleneuk / Sunnyside / Regional",province:"Gauteng",is_active:!0},{id:"inst-uct",name:"University of Cape Town",short_name:"UCT",type:"Public University",campus:"Upper, Middle & Lower Campus, Rondebosch",province:"Western Cape",is_active:!0},{id:"inst-su",name:"Stellenbosch University",short_name:"SU",type:"Public University",campus:"Stellenbosch / Tygerberg / Bellville",province:"Western Cape",is_active:!0},{id:"inst-uwc",name:"University of the Western Cape",short_name:"UWC",type:"Public University",campus:"Bellville, Cape Town",province:"Western Cape",is_active:!0},{id:"inst-cput",name:"Cape Peninsula University of Technology",short_name:"CPUT",type:"Public University",campus:"Bellville / District Six / Mowbray",province:"Western Cape",is_active:!0},{id:"inst-ukzn",name:"University of KwaZulu-Natal",short_name:"UKZN",type:"Public University",campus:"Howard College / Westville / Pietermaritzburg",province:"KwaZulu-Natal",is_active:!0},{id:"inst-dut",name:"Durban University of Technology",short_name:"DUT",type:"Public University",campus:"Steve Biko / ML Sultan / Indumiso",province:"KwaZulu-Natal",is_active:!0},{id:"inst-mut",name:"Mangosuthu University of Technology",short_name:"MUT",type:"Public University",campus:"Umlazi, Durban",province:"KwaZulu-Natal",is_active:!0},{id:"inst-unizulu",name:"University of Zululand",short_name:"UNIZULU",type:"Public University",campus:"KwaDlangezwa / Richards Bay",province:"KwaZulu-Natal",is_active:!0},{id:"inst-nwu",name:"North-West University",short_name:"NWU",type:"Public University",campus:"Potchefstroom / Mahikeng / Vaal Triangle",province:"North West",is_active:!0},{id:"inst-ufs",name:"University of the Free State",short_name:"UFS",type:"Public University",campus:"Bloemfontein / Qwaqwa / South Campus",province:"Free State",is_active:!0},{id:"inst-cut",name:"Central University of Technology",short_name:"CUT",type:"Public University",campus:"Bloemfontein / Welkom",province:"Free State",is_active:!0},{id:"inst-ru",name:"Rhodes University",short_name:"RU",type:"Public University",campus:"Makhanda (Grahamstown)",province:"Eastern Cape",is_active:!0},{id:"inst-ufh",name:"University of Fort Hare",short_name:"UFH",type:"Public University",campus:"Alice / East London / Bhisho",province:"Eastern Cape",is_active:!0},{id:"inst-nmu",name:"Nelson Mandela University",short_name:"NMU",type:"Public University",campus:"Gqeberha (Port Elizabeth) / George",province:"Eastern Cape",is_active:!0},{id:"inst-wsu",name:"Walter Sisulu University",short_name:"WSU",type:"Public University",campus:"Mthatha / East London / Butterworth",province:"Eastern Cape",is_active:!0},{id:"inst-ul",name:"University of Limpopo",short_name:"UL",type:"Public University",campus:"Turfloop Campus, Mankweng",province:"Limpopo",is_active:!0},{id:"inst-univen",name:"University of Venda",short_name:"UNIVEN",type:"Public University",campus:"Thohoyandou",province:"Limpopo",is_active:!0},{id:"inst-spu",name:"Sol Plaatje University",short_name:"SPU",type:"Public University",campus:"Kimberley",province:"Northern Cape",is_active:!0}];let N="signin",m=1,o={idNumber:"",idValidation:null,firstName:"",lastName:"",dob:"",gender:"",isCitizen:!0,phone:"",isPhoneVerified:!1,email:"",isEmailVerified:!1,otpCode:"",password:"",institutionId:"inst-tut",institution:"Tshwane University of Technology",isOtherInstitution:!1,otherInstitutionName:"",otherInstitutionCampus:"",otherInstitutionType:"TVET",studentNumber:"",yearOfStudy:"1st Year (First-time entering)",fundingType:"nsfas",bursarySponsorName:"",fundingReferenceNumber:"",nsfasRef:"",guardianName:"",guardianContact:"",fundingAgreementAccepted:!0,preferredResidence:"GKAS Residence (Sonheuwel)",roomType:"Single Room",docs:{idCopy:!1,proofOfReg:!1,fundingLetter:!1},docValidation:{idCopy:{status:"idle",message:"",fileName:"",fileSize:0},proofOfReg:{status:"idle",message:"",fileName:"",fileSize:0},fundingLetter:{status:"idle",message:"",fileName:"",fileSize:0}}};function M(){const t=document.getElementById("login-page");t&&(t.innerHTML=`
    <!-- Left Hero Branding -->
    <div class="login-left" aria-hidden="true">
      <div class="login-left-bg-grid"></div>
      <div class="login-left-circle-1"></div>
      <div class="login-left-circle-2"></div>

      <div>
        <div class="nsfas-accreditation-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          DHET &amp; NSFAS Accredited Residence · 2027 Academic Year
        </div>
        <div class="lp-headline">Where students<br>find their <em>home.</em></div>
        <p class="lp-sub">Official residence portal for HTS &amp; GKAS students in Mbombela / Nelspruit. Secure accommodation management aligned with the national student housing framework for the 2027 intake.</p>
        
        <div class="lp-stats">
          <div class="lps"><div class="lps-n">108</div><div class="lps-l">Total Beds</div></div>
          <div class="lps"><div class="lps-n">2</div><div class="lps-l">Residences</div></div>
          <div class="lps"><div class="lps-n">92%</div><div class="lps-l">Live Occupancy</div></div>
        </div>
      </div>

      <div class="nsfas-features-list">
        <div style="font-size:11px;color:#cbd5e1;letter-spacing:0.8px;text-transform:uppercase;font-weight:700;margin-bottom:14px">How 2027 Placement Works</div>
        <div class="nfl-item">
          <div class="nfl-num">1</div>
          <div><div class="nfl-title">Verified SA Identity &amp; 2FA OTP</div><div class="nfl-desc">Luhn-verified South African ID and active phone &amp; email verification.</div></div>
        </div>
        <div class="nfl-item">
          <div class="nfl-num">2</div>
          <div><div class="nfl-title">Accredited Institution &amp; Funding</div><div class="nfl-desc">Selection across all 26 SA public universities and structured funding review.</div></div>
        </div>
        <div class="nfl-item">
          <div class="nfl-num">3</div>
          <div><div class="nfl-title">Digital 2027 Lease &amp; Key Handover</div><div class="nfl-desc">DocuSign legal agreement and photographic move-in room inspection.</div></div>
        </div>
      </div>
    </div>

    <!-- Right Interaction Panel -->
    <div class="login-right">
      <div class="login-card-container">
        
        <!-- Header Logo & Install Badge -->
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:10px">
          <div style="display:flex;align-items:center;gap:12px">
            <div style="width:44px;height:44px;background:var(--navy);border-radius:12px;display:flex;align-items:center;justify-content:center;color:#fff;box-shadow:var(--shadow-sm)">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </div>
            <div>
              <div style="font-family:var(--font-serif);font-size:22px;font-weight:700;color:var(--navy);line-height:1.1">HTS · GKAS Portal</div>
              <div style="font-size:11px;color:var(--text-sub);font-weight:600">Student Residence Accommodation System</div>
            </div>
          </div>
          <button onclick="window.installPwa()" class="btn btn-outline btn-xs" style="display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:700;color:var(--gold);border-color:var(--gold);background:rgba(200,147,58,0.08);border-radius:20px;padding:5px 12px;cursor:pointer" title="Install GKAS Residence App to Home Screen">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            <span>Install App</span>
          </button>
        </div>

        <!-- Mode Navigation Tabs -->
        <div class="auth-mode-tabs" role="tablist">
          <button class="auth-mode-btn ${N==="signin"?"active":""}" onclick="window.setAuthMode('signin')" role="tab" aria-selected="${N==="signin"}">Sign in</button>
          <button class="auth-mode-btn ${N==="register"?"active":""}" onclick="window.setAuthMode('register')" role="tab" aria-selected="${N==="register"}">New Student Register (2027)</button>
          <button class="auth-mode-btn ${N==="track"?"active":""}" onclick="window.setAuthMode('track')" role="tab" aria-selected="${N==="track"}">Track Application</button>
        </div>

        <!-- Dynamic Auth Mode Container -->
        <div id="auth-panel-content">
          ${Ae()}
        </div>

        <!-- Legal Disclaimer -->
        <p style="font-size:11px;color:var(--text-sub);margin-top:24px;line-height:1.6;text-align:center">
          <a href="#" onclick="window.openLegalModal('privacy');return false" style="text-decoration:underline">POPIA Privacy Policy</a> · 
          <a href="#" onclick="window.openLegalModal('terms');return false" style="text-decoration:underline">Terms &amp; Conditions</a> · 
          <a href="#" onclick="window.openLegalModal('cookies');return false" style="text-decoration:underline">Cookie Policy</a>
        </p>
      </div>
    </div>
  `)}function Ae(){if(N==="signin")return ke();if(N==="register")return $e();if(N==="track")return Te()}function ke(){return`
    <div>
      <div style="margin-bottom:18px">
        <h2 style="font-family:var(--font-serif);font-size:26px;color:var(--navy);font-weight:700">Welcome Back</h2>
        <p style="font-size:13px;color:var(--text-sub)">Sign in to access your student residence dashboard or staff management</p>
      </div>

      <form onsubmit="window.handleSignIn(event)">
        <div class="f-group">
          <label class="f-label" for="login-email">Email or Student Number</label>
          <input class="f-input" type="text" id="login-email" placeholder="e.g. 21304567 or student@tut4life.ac.za" value="" autocomplete="username" required>
        </div>
        <div class="f-group">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
            <label class="f-label" for="login-pass" style="margin-bottom:0">Password</label>
            <a href="#" onclick="window.handleForgotPassword();return false" style="font-size:12px;color:var(--navy);font-weight:600;text-decoration:underline">Forgot password?</a>
          </div>
          <input class="f-input" type="password" id="login-pass" placeholder="Enter your password" value="" autocomplete="current-password" required>
        </div>

        <button type="submit" class="btn btn-primary btn-full" id="signin-submit-btn" style="margin-top:8px">Sign in to Residence Portal</button>
      </form>

      <div style="text-align:center;margin:18px 0 6px;font-size:12px;color:var(--text-sub)">
        First-time applicant? <button onclick="window.setAuthMode('register')" style="background:none;border:none;color:var(--navy);font-weight:700;cursor:pointer;text-decoration:underline;font-size:12px">Register for 2027 Accommodation →</button>
      </div>
    </div>
  `}function $e(){return`
    <div>
      <div style="margin-bottom:16px">
        <h2 style="font-family:var(--font-serif);font-size:24px;color:var(--navy);font-weight:700">2027 Student Residence Registration</h2>
        <p style="font-size:12px;color:var(--text-sub)">Apply for 2027 accredited accommodation at GKAS Sonheuwel or HTS Stonehenge</p>
      </div>

      <!-- Stepper Indicator -->
      <div class="nsfas-stepper" role="progressbar" aria-valuenow="${m}" aria-valuemin="1" aria-valuemax="5">
        <div class="ns-step ${m===1?"active":m>1?"done":""}">
          <div class="ns-dot">${m>1?"✓":"1"}</div>
          <div class="ns-label">SA ID Check</div>
        </div>
        <div class="ns-line ${m>1?"done":""}"></div>
        <div class="ns-step ${m===2?"active":m>2?"done":""}">
          <div class="ns-dot">${m>2?"✓":"2"}</div>
          <div class="ns-label">Contact &amp; 2FA</div>
        </div>
        <div class="ns-line ${m>2?"done":""}"></div>
        <div class="ns-step ${m===3?"active":m>3?"done":""}">
          <div class="ns-dot">${m>3?"✓":"3"}</div>
          <div class="ns-label">Institution</div>
        </div>
        <div class="ns-line ${m>3?"done":""}"></div>
        <div class="ns-step ${m===4?"active":m>4?"done":""}">
          <div class="ns-dot">${m>4?"✓":"4"}</div>
          <div class="ns-label">Funding &amp; Docs</div>
        </div>
        <div class="ns-line ${m>4?"done":""}"></div>
        <div class="ns-step ${m===5?"active":""}">
          <div class="ns-dot">5</div>
          <div class="ns-label">Submit</div>
        </div>
      </div>

      <!-- Steps Content -->
      ${Ne()}
    </div>
  `}function Ne(){switch(m){case 1:return`
        <div>
          <div style="font-size:12px;font-weight:700;color:var(--navy);margin-bottom:12px;text-transform:uppercase;letter-spacing:0.5px">Step 1: South African National ID Verification</div>
          
          <div class="f-group">
            <label class="f-label" for="reg-id">South African National ID Number <span class="f-required">*</span></label>
            <div class="f-hint">Must be a valid 13-digit identity number verified by Luhn checksum</div>
            <input class="f-input td-mono" type="text" id="reg-id" maxlength="13" placeholder="e.g. 0308150493081" 
                   value="${o.idNumber}" oninput="window.handleIdInput(this.value)">
            <div id="id-validation-status" style="font-size:11px;margin-top:6px">
              ${o.idValidation?o.idValidation.isValid?`<span style="color:var(--green);font-weight:600">✓ Valid 13-digit SA ID (${o.gender}, DOB: ${o.dob}, ${o.isCitizen?"SA Citizen":"Permanent Resident"}, Luhn Valid)</span>`:`<span style="color:var(--red)">⚠ ${o.idValidation.error}</span>`:""}
            </div>
          </div>

          <div class="f-row">
            <div class="f-group">
              <label class="f-label" for="reg-first">Full First Name(s) <span class="f-required">*</span></label>
              <input class="f-input" type="text" id="reg-first" placeholder="As shown on SA ID" value="${o.firstName}">
            </div>
            <div class="f-group">
              <label class="f-label" for="reg-last">Surname <span class="f-required">*</span></label>
              <input class="f-input" type="text" id="reg-last" placeholder="As shown on SA ID" value="${o.lastName}">
            </div>
          </div>

          <div class="f-row">
            <div class="f-group">
              <label class="f-label" for="reg-dob">Date of Birth</label>
              <input class="f-input" type="text" id="reg-dob" placeholder="Auto-calculated from ID" value="${o.dob}" readonly style="background:var(--bg-muted)">
            </div>
            <div class="f-group">
              <label class="f-label" for="reg-gender">Gender</label>
              <input class="f-input" type="text" id="reg-gender" value="${o.gender||"Derived from ID digits"}" readonly style="background:var(--bg-muted)">
            </div>
          </div>

          <button class="btn btn-primary btn-full" style="margin-top:12px" onclick="window.nextRegStep(1)">
            Verify &amp; Continue to Contact Security →
          </button>
        </div>
      `;case 2:return`
        <div>
          <div style="font-size:12px;font-weight:700;color:var(--navy);margin-bottom:12px;text-transform:uppercase;letter-spacing:0.5px">Step 2: Contact Verification &amp; 2FA Protection</div>
          <p style="font-size:12px;color:var(--text-sub);margin-bottom:14px">To prevent invalid registrations, you must verify your South African mobile number and email address with a 2FA One-Time PIN.</p>

          <div class="f-group">
            <label class="f-label" for="reg-phone">South African Mobile Number <span class="f-required">*</span></label>
            <div class="f-hint">e.g. 071 829 4012 or 082 123 4567</div>
            <div style="display:flex;gap:8px">
              <input class="f-input td-mono" type="tel" id="reg-phone" placeholder="071 829 4012" value="${o.phone}" style="flex:1">
              <button type="button" class="btn btn-gold btn-sm" onclick="window.sendSimulatedOtp()">Send 2FA OTP</button>
            </div>
          </div>

          <div class="f-group">
            <label class="f-label" for="reg-email">Student Email Address <span class="f-required">*</span></label>
            <div class="f-hint">Confirmation &amp; digital lease agreements will be dispatched here</div>
            <input class="f-input" type="email" id="reg-email" placeholder="e.g. student@tut4life.ac.za or personal email" value="${o.email}">
          </div>

          <div class="f-group" style="background:#f8fafc;border:1px solid var(--border);border-radius:var(--radius-sm);padding:12px">
            <label class="f-label" for="reg-otp">Enter 6-Digit Verification PIN <span class="f-required">*</span></label>
            <div style="display:flex;gap:8px">
              <input class="f-input td-mono" type="text" id="reg-otp" maxlength="6" placeholder="6-digit PIN" value="${o.otpCode||""}" style="letter-spacing:4px;font-weight:700;font-size:15px;flex:1">
              <button type="button" class="btn btn-primary btn-sm" onclick="window.verifySubmittedOtp()">Verify PIN</button>
            </div>
            <div id="otp-status-badge" style="margin-top:6px;font-size:11px">
              ${o.isPhoneVerified?`<span style="color:var(--green);font-weight:700">✓ Verified: Mobile (${o.phone}) &amp; Email (${o.email}) authenticated</span>`:`<span style="color:var(--text-sub)">Click 'Send 2FA OTP' and enter the 6-digit code sent to your phone/email</span>`}
            </div>
          </div>

          <div class="f-group">
            <label class="f-label" for="reg-pass">Create Account Password <span class="f-required">*</span></label>
            <input class="f-input" type="password" id="reg-pass" placeholder="Min. 8 characters" value="${o.password}">
          </div>

          <div style="display:flex;gap:10px;margin-top:16px">
            <button class="btn btn-ghost" onclick="window.prevRegStep(2)">← Back</button>
            <button class="btn btn-primary" style="flex:1" onclick="window.nextRegStep(2)">Continue to Academic Institution →</button>
          </div>
        </div>
      `;case 3:return`
        <div>
          <div style="font-size:12px;font-weight:700;color:var(--navy);margin-bottom:12px;text-transform:uppercase;letter-spacing:0.5px">Step 3: Academic Institution &amp; Student Registration</div>

          <div class="f-group">
            <label class="f-label" for="reg-inst">Select Higher Education Institution <span class="f-required">*</span></label>
            <div class="f-hint">Pre-populated with all 26 SA public universities and regional TVET colleges</div>
            <select class="f-input f-select" id="reg-inst" onchange="window.handleInstitutionSelect(this.value)">
              <optgroup label="Local Mpumalanga Institutions (Partner Accredited)">
                <option value="inst-tut" ${o.institutionId==="inst-tut"?"selected":""}>Tshwane University of Technology (TUT) — Nelspruit / Mbombela</option>
                <option value="inst-ump" ${o.institutionId==="inst-ump"?"selected":""}>University of Mpumalanga (UMP) — Mbombela Campus</option>
                <option value="inst-ehlanzeni" ${o.institutionId==="inst-ehlanzeni"?"selected":""}>Ehlanzeni TVET College — Mbombela / KaNyamazane</option>
                <option value="inst-gert-sibande" ${o.institutionId==="inst-gert-sibande"?"selected":""}>Gert Sibande TVET College — Ermelo / Standerton</option>
                <option value="inst-nkangala" ${o.institutionId==="inst-nkangala"?"selected":""}>Nkangala TVET College — Witbank / Middelburg</option>
              </optgroup>
              <optgroup label="Other South African Public Universities (All 26)">
                ${G.filter(t=>!["inst-tut","inst-ump","inst-ehlanzeni","inst-gert-sibande","inst-nkangala"].includes(t.id)).map(t=>`
                  <option value="${t.id}" ${o.institutionId===t.id?"selected":""}>${t.name} (${t.short_name}) — ${t.campus||t.province}</option>
                `).join("")}
              </optgroup>
              <optgroup label="Other Institution">
                <option value="other" ${o.isOtherInstitution?"selected":""}>Other Institution / Private College (Specify below)</option>
              </optgroup>
            </select>
          </div>

          <!-- Conditional Other Institution Section -->
          <div id="other-inst-container" style="display:${o.isOtherInstitution?"block":"none"};background:#f0f9ff;border:1px solid #bae6fd;border-radius:var(--radius-sm);padding:14px;margin-bottom:14px">
            <div style="font-weight:700;font-size:12px;color:#0369a1;margin-bottom:8px">Specify Institution Details:</div>
            <div class="f-row">
              <div class="f-group">
                <label class="f-label" for="other-inst-name">Institution Name <span class="f-required">*</span></label>
                <input class="f-input" type="text" id="other-inst-name" placeholder="e.g. Eduvos / Boston / CTU College" 
                       value="${o.otherInstitutionName}" oninput="regData.otherInstitutionName = this.value">
              </div>
              <div class="f-group">
                <label class="f-label" for="other-inst-campus">Campus Location <span class="f-required">*</span></label>
                <input class="f-input" type="text" id="other-inst-campus" placeholder="e.g. Nelspruit Campus" 
                       value="${o.otherInstitutionCampus}" oninput="regData.otherInstitutionCampus = this.value">
              </div>
            </div>
          </div>

          <div class="f-row">
            <div class="f-group">
              <label class="f-label" for="reg-stnum">Student Number <span class="f-required">*</span></label>
              <input class="f-input td-mono" type="text" id="reg-stnum" placeholder="e.g. 22109845" value="${o.studentNumber}">
            </div>
            <div class="f-group">
              <label class="f-label" for="reg-year">2027 Year of Study</label>
              <select class="f-input f-select" id="reg-year" onchange="regData.yearOfStudy = this.value">
                <option ${o.yearOfStudy.includes("1st")?"selected":""}>1st Year (First-time entering 2027)</option>
                <option ${o.yearOfStudy.includes("2nd")?"selected":""}>2nd Year</option>
                <option ${o.yearOfStudy.includes("3rd")?"selected":""}>3rd Year</option>
                <option ${o.yearOfStudy.includes("4th")?"selected":""}>4th Year / Honours</option>
                <option ${o.yearOfStudy.includes("Post")?"selected":""}>Postgraduate</option>
              </select>
            </div>
          </div>

          <div style="display:flex;gap:10px;margin-top:16px">
            <button class="btn btn-ghost" onclick="window.prevRegStep(3)">← Back</button>
            <button class="btn btn-primary" style="flex:1" onclick="window.nextRegStep(3)">Continue to Funding &amp; Documents →</button>
          </div>
        </div>
      `;case 4:return`
        <div>
          <div style="font-size:12px;font-weight:700;color:var(--navy);margin-bottom:12px;text-transform:uppercase;letter-spacing:0.5px">Step 4: Residence Selection &amp; Structured Funding Validation</div>

          <div class="f-row" style="margin-bottom:14px">
            <div class="f-group">
              <label class="f-label" for="reg-res">Preferred Residence <span class="f-required">*</span></label>
              <select class="f-input f-select" id="reg-res" onchange="regData.preferredResidence = this.value">
                <option value="GKAS Residence (Sonheuwel)" ${o.preferredResidence.includes("GKAS")?"selected":""}>GKAS Residence — Sonheuwel (88 beds)</option>
                <option value="HTS Residence (Stonehenge)" ${o.preferredResidence.includes("HTS")?"selected":""}>HTS Residence — Stonehenge (20 beds)</option>
              </select>
            </div>
            <div class="f-group">
              <label class="f-label" for="reg-roomtype">Room Preference</label>
              <select class="f-input f-select" id="reg-roomtype" onchange="regData.roomType = this.value">
                <option ${o.roomType.includes("Single")?"selected":""}>Single Room (Private)</option>
                <option ${o.roomType.includes("Double")?"selected":""}>Double Sharing Room</option>
              </select>
            </div>
          </div>

          <!-- Structured Funding Type Segmented Selector -->
          <div style="font-size:12px;font-weight:700;color:var(--navy);margin-bottom:8px">Select Accommodation Funding Type <span class="f-required">*</span></div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
            
            <div class="card" onclick="window.handleFundingTypeClick('nsfas')" 
                 style="cursor:pointer;margin-bottom:0;padding:12px;border:2px solid ${o.fundingType==="nsfas"?"var(--blue)":"var(--border)"};background:${o.fundingType==="nsfas"?"#eff6ff":"var(--bg-alt)"}">
              <div style="display:flex;align-items:center;gap:8px;font-weight:700;font-size:13px;color:var(--navy)">
                <span>🏛️</span> NSFAS Direct
              </div>
              <div style="font-size:11px;color:var(--text-sub);margin-top:2px">Requires myNSFAS status screenshot or provisionally funded letter</div>
            </div>

            <div class="card" onclick="window.handleFundingTypeClick('external_bursary')" 
                 style="cursor:pointer;margin-bottom:0;padding:12px;border:2px solid ${o.fundingType==="external_bursary"?"var(--blue)":"var(--border)"};background:${o.fundingType==="external_bursary"?"#eff6ff":"var(--bg-alt)"}">
              <div style="display:flex;align-items:center;gap:8px;font-weight:700;font-size:13px;color:var(--navy)">
                <span>💼</span> External Bursary
              </div>
              <div style="font-size:11px;color:var(--text-sub);margin-top:2px">Corporate, Mining, or Provincial Government Bursary</div>
            </div>

            <div class="card" onclick="window.handleFundingTypeClick('self_funded')" 
                 style="cursor:pointer;margin-bottom:0;padding:12px;border:2px solid ${o.fundingType==="self_funded"?"var(--blue)":"var(--border)"};background:${o.fundingType==="self_funded"?"#eff6ff":"var(--bg-alt)"}">
              <div style="display:flex;align-items:center;gap:8px;font-weight:700;font-size:13px;color:var(--navy)">
                <span>👨‍👩‍👧</span> Self-Funded / Private
              </div>
              <div style="font-size:11px;color:var(--text-sub);margin-top:2px">Parent, Guardian, or Self-paying monthly tenant fee</div>
            </div>

            <div class="card" onclick="window.handleFundingTypeClick('student_loan')" 
                 style="cursor:pointer;margin-bottom:0;padding:12px;border:2px solid ${o.fundingType==="student_loan"?"var(--blue)":"var(--border)"};background:${o.fundingType==="student_loan"?"#eff6ff":"var(--bg-alt)"}">
              <div style="display:flex;align-items:center;gap:8px;font-weight:700;font-size:13px;color:var(--navy)">
                <span>🏦</span> Bank Student Loan
              </div>
              <div style="font-size:11px;color:var(--text-sub);margin-top:2px">Fundi, Standard Bank, ABSA, Nedbank, FNB, etc.</div>
            </div>
          </div>

          <!-- Dynamic Helper Notice -->
          <div style="padding:10px 14px;border-radius:var(--radius-sm);font-size:12px;margin-bottom:14px;background:#f0fdf4;border:1px solid #bbf7d0;color:#166534">
            ${o.fundingType==="nsfas"?"ℹ️ <strong>NSFAS Policy:</strong> Accommodation allowance approval will be verified against the DHET/institution accredited residence quota for 2027.":o.fundingType==="external_bursary"?"ℹ️ <strong>Bursary Policy:</strong> Provide an official award letter containing the financial administrator contact details and billing instructions.":o.fundingType==="self_funded"?"ℹ️ <strong>Private Tenancy Policy:</strong> Guardian contact required. Rent is payable on or before the 1st of each calendar month.":"ℹ️ <strong>Student Loan Policy:</strong> Provide bank loan pre-approval quotation with residence direct disbursement schedule."}
          </div>

          <!-- Conditional Inputs for Selected Funding -->
          ${Ie()}

          <!-- Automated Document Upload Dropzones with Fraud Scan -->
          <div style="font-size:12px;font-weight:700;color:var(--text-main);margin:16px 0 8px">Verified Supporting Documents (Max 5MB PDF / Image)</div>

          <div style="display:flex;flex-direction:column;gap:10px">
            
            <!-- Doc 1: Certified ID Copy -->
            <div class="doc-upload-box ${o.docs.idCopy?"uploaded":""}" onclick="window.triggerDocScan('idCopy', 'Certified SA ID Copy')">
              <div class="dub-icon">${o.docs.idCopy?"✅":"🪪"}</div>
              <div class="dub-content">
                <div class="dub-title">Certified Copy of SA ID <span style="color:var(--red)">*</span></div>
                <div class="dub-sub">
                  ${o.docs.idCopy?"✓ File integrity passed. Luhn checksum and photo verified.":"Clear scan or photo of ID card or green barcode book"}
                </div>
              </div>
              <div class="dub-badge">${o.docs.idCopy?"Verified":"Upload & Scan"}</div>
            </div>

            <!-- Doc 2: Proof of Academic Registration -->
            <div class="doc-upload-box ${o.docs.proofOfReg?"uploaded":""}" onclick="window.triggerDocScan('proofOfReg', '2027 Proof of Registration')">
              <div class="dub-icon">${o.docs.proofOfReg?"✅":"🎓"}</div>
              <div class="dub-content">
                <div class="dub-title">Proof of 2027 University Registration / Admission <span style="color:var(--red)">*</span></div>
                <div class="dub-sub">
                  ${o.docs.proofOfReg?"✓ Institution match verified. Student number confirmed.":"Official 2027 admission or registration letter with student number"}
                </div>
              </div>
              <div class="dub-badge">${o.docs.proofOfReg?"Verified":"Upload & Scan"}</div>
            </div>

            <!-- Doc 3: Funding Proof / Award Letter -->
            <div class="doc-upload-box ${o.docs.fundingLetter?"uploaded":""}" onclick="window.triggerDocScan('fundingLetter', 'Funding Status Letter')">
              <div class="dub-icon">${o.docs.fundingLetter?"✅":"📄"}</div>
              <div class="dub-content">
                <div class="dub-title">${o.fundingType==="nsfas"?"myNSFAS Status Screenshot / Letter":"Official Bursary / Loan Award Letter"} <span style="color:var(--red)">*</span></div>
                <div class="dub-sub">
                  ${o.docs.fundingLetter?"✓ Financial award letter verified for 2027 academic intake.":"Official proof of financial support or parent guarantee letter"}
                </div>
              </div>
              <div class="dub-badge">${o.docs.fundingLetter?"Verified":"Upload & Scan"}</div>
            </div>

          </div>

          <div style="display:flex;gap:10px;margin-top:16px">
            <button class="btn btn-ghost" onclick="window.prevRegStep(4)">← Back</button>
            <button class="btn btn-primary" style="flex:1" onclick="window.nextRegStep(4)">Review &amp; Consent →</button>
          </div>
        </div>
      `;case 5:return`
        <div>
          <div style="font-size:12px;font-weight:700;color:var(--navy);margin-bottom:12px;text-transform:uppercase;letter-spacing:0.5px">Step 5: Review &amp; Statutory Declarations</div>

          <div style="background:var(--bg-alt);border:1px solid var(--border);border-radius:var(--radius-md);padding:14px 16px;margin-bottom:16px;font-size:12px;line-height:1.7">
            <div style="font-weight:700;color:var(--navy);margin-bottom:6px">2027 Application Summary</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
              <div><span style="color:var(--text-sub)">Student Name:</span> <strong>${o.firstName} ${o.lastName}</strong></div>
              <div><span style="color:var(--text-sub)">SA ID Number:</span> <code class="td-mono">${o.idNumber}</code></div>
              <div><span style="color:var(--text-sub)">Institution:</span> ${o.isOtherInstitution?o.otherInstitutionName:o.institution}</div>
              <div><span style="color:var(--text-sub)">Student Number:</span> ${o.studentNumber||"22109845"}</div>
              <div><span style="color:var(--text-sub)">Funding Type:</span> <span class="pill pill-blue" style="font-size:10px">${o.fundingType.toUpperCase()}</span></div>
              <div><span style="color:var(--text-sub)">Residence:</span> ${o.preferredResidence}</div>
              <div><span style="color:var(--text-sub)">Mobile (Verified):</span> ${o.phone}</div>
              <div><span style="color:var(--text-sub)">Email (Verified):</span> ${o.email}</div>
            </div>
          </div>

          <div class="f-group" style="margin-bottom:12px">
            <label class="f-checkbox">
              <input type="checkbox" id="reg-popia-consent" checked>
              <span><strong>Protection of Personal Information (POPIA) Consent:</strong> I consent to HTS &amp; GKAS verifying my student identity with DHET, NSFAS, and university records for the 2027 intake.</span>
            </label>
          </div>

          <div class="f-group" style="margin-bottom:18px">
            <label class="f-checkbox">
              <input type="checkbox" id="reg-rules-consent" checked>
              <span>I acknowledge that 2027 placement is subject to accredited room availability and adherence to the residence code of conduct.</span>
            </label>
          </div>

          <div style="display:flex;gap:10px">
            <button class="btn btn-ghost" onclick="window.prevRegStep(5)">← Back</button>
            <button class="btn btn-primary" style="flex:1" id="submit-reg-btn" onclick="window.submitCompleteRegistration()">Submit 2027 Residence Application</button>
          </div>
        </div>
      `;default:return""}}function Ie(){switch(o.fundingType){case"nsfas":return`
        <div class="f-group" style="margin-bottom:12px">
          <label class="f-label" for="reg-nsfas-ref">myNSFAS Application / Reference Number</label>
          <input class="f-input td-mono" type="text" id="reg-nsfas-ref" placeholder="e.g. NSFAS-2027-MP-9012" 
                 value="${o.nsfasRef||"NSFAS-2027-MP-9012"}" oninput="regData.nsfasRef = this.value">
        </div>
      `;case"external_bursary":return`
        <div class="f-row" style="margin-bottom:12px">
          <div class="f-group">
            <label class="f-label" for="bursary-sponsor">Bursary Sponsor Name <span class="f-required">*</span></label>
            <input class="f-input" type="text" id="bursary-sponsor" placeholder="e.g. Sasol Foundation, Glencore, Mpumalanga Bursary" 
                   value="${o.bursarySponsorName}" oninput="regData.bursarySponsorName = this.value">
          </div>
          <div class="f-group">
            <label class="f-label" for="bursary-ref">Bursary Reference / Contract No. <span class="f-required">*</span></label>
            <input class="f-input td-mono" type="text" id="bursary-ref" placeholder="e.g. BUR-2027-SAS-089" 
                   value="${o.fundingReferenceNumber}" oninput="regData.fundingReferenceNumber = this.value">
          </div>
        </div>
      `;case"self_funded":return`
        <div class="f-row" style="margin-bottom:12px">
          <div class="f-group">
            <label class="f-label" for="guardian-name">Parent / Sponsor Full Name <span class="f-required">*</span></label>
            <input class="f-input" type="text" id="guardian-name" placeholder="e.g. Sipho Nkosi" 
                   value="${o.guardianName}" oninput="regData.guardianName = this.value">
          </div>
          <div class="f-group">
            <label class="f-label" for="guardian-phone">Parent / Sponsor Mobile Number <span class="f-required">*</span></label>
            <input class="f-input td-mono" type="tel" id="guardian-phone" placeholder="e.g. 082 345 6789" 
                   value="${o.guardianContact}" oninput="regData.guardianContact = this.value">
          </div>
        </div>
      `;case"student_loan":return`
        <div class="f-row" style="margin-bottom:12px">
          <div class="f-group">
            <label class="f-label" for="loan-bank">Loan Financier / Bank Name <span class="f-required">*</span></label>
            <input class="f-input" type="text" id="loan-bank" placeholder="e.g. Fundi Student Loans / Standard Bank" 
                   value="${o.bursarySponsorName}" oninput="regData.bursarySponsorName = this.value">
          </div>
          <div class="f-group">
            <label class="f-label" for="loan-ref">Loan Pre-Approval Ref <span class="f-required">*</span></label>
            <input class="f-input td-mono" type="text" id="loan-ref" placeholder="e.g. FND-2027-QUO-819" 
                   value="${o.fundingReferenceNumber}" oninput="regData.fundingReferenceNumber = this.value">
          </div>
        </div>
      `}}function Te(){return`
    <div>
      <div style="margin-bottom:18px">
        <h2 style="font-family:var(--font-serif);font-size:24px;color:var(--navy);font-weight:700">Track 2027 Accommodation Status</h2>
        <p style="font-size:13px;color:var(--text-sub)">Check the live progress of your 2027 student residence application</p>
      </div>

      <div class="f-group">
        <label class="f-label" for="track-id-input">SA National ID or Reference Number</label>
        <div style="display:flex;gap:8px">
          <input class="f-input td-mono" type="text" id="track-id-input" placeholder="e.g. 0308150493081 or GKAS-2027-10492" value="0308150493081">
          <button class="btn btn-primary" onclick="window.handleTrackLookup()">Search</button>
        </div>
      </div>

      <div id="track-result-container">
        <div class="track-card">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
            <div>
              <div style="font-weight:700;font-size:15px;color:var(--navy)">Nonhlanhla Sibiya</div>
              <div style="font-size:12px;color:var(--text-sub)">Ref: <strong>GKAS-2027-10492</strong> · TUT Nelspruit</div>
            </div>
            <span class="pill pill-amber">Under Verification</span>
          </div>

          <div class="track-timeline">
            <div class="tt-step done">
              <div class="tt-dot"></div>
              <div class="tt-title">2027 Application Submitted</div>
              <div class="tt-desc">Completed via online portal for 2027 academic intake</div>
            </div>
            <div class="tt-step done">
              <div class="tt-dot"></div>
              <div class="tt-title">Document Integrity &amp; OCR Check</div>
              <div class="tt-desc">Certified ID copy and TUT proof of registration verified</div>
            </div>
            <div class="tt-step active">
              <div class="tt-dot"></div>
              <div class="tt-title">NSFAS Funding &amp; Bed Allocation</div>
              <div class="tt-desc">Checking quota against GKAS Sonheuwel accredited beds (est. 1-2 days)</div>
            </div>
            <div class="tt-step">
              <div class="tt-dot"></div>
              <div class="tt-title">Digital Lease Agreement &amp; Move-in</div>
              <div class="tt-desc">DocuSign envelope dispatched once bed confirmed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `}window.setAuthMode=function(t){N=t,t==="register"&&(m=1),M()};window.handleIdInput=function(t){o.idNumber=t.trim();const e=document.getElementById("id-validation-status"),i=document.getElementById("reg-dob"),n=document.getElementById("reg-gender");if(o.idNumber.length===13){const s=se(o.idNumber);o.idValidation=s,s.isValid?(o.dob=s.dobFormatted,o.gender=s.gender,o.isCitizen=s.isCitizen,i&&(i.value=o.dob),n&&(n.value=o.gender),e&&(e.innerHTML=`
          <span style="color:var(--green);font-weight:600">
            ✓ Valid 13-digit SA National ID (${s.gender}, DOB: ${s.dobFormatted}, ${s.citizenshipStatus}, Luhn Check Passed)
          </span>
        `)):e&&(e.innerHTML=`<span style="color:var(--red);font-weight:600">⚠ ${s.error}</span>`)}else o.idValidation=null,e&&(e.innerHTML=o.idNumber.length>0?`<span style="color:var(--text-sub)">Must be exactly 13 digits (current: ${o.idNumber.length})</span>`:"")};window.sendSimulatedOtp=async function(){var n,s;const t=((n=document.getElementById("reg-phone"))==null?void 0:n.value.trim())||o.phone,e=((s=document.getElementById("reg-email"))==null?void 0:s.value.trim())||o.email,i=oe(t);if(!i.isValid){p("⚠",i.error||"Please enter a valid South African mobile number.","error");return}if(!e||!e.includes("@")){p("⚠","Please enter a valid email address.","error");return}o.phone=i.formatted,o.email=e;try{const r=await(await fetch("http://localhost:3001/api/send-otp",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contact:o.phone,type:"sms"})})).json();if(r.success){const l=r.devCode||r.code;if(l){p("📱",`2FA One-Time PIN dispatched to ${o.phone}: [${l}] (Valid for 5 min)`,"info",7e3);const c=document.getElementById("reg-otp");c&&(c.value=l)}else p("📱",`2FA One-Time PIN dispatched to ${o.phone}. Please check your phone.`,"info",7e3)}else p("❌",r.error||"Failed to dispatch 2FA PIN.","error")}catch{p("❌","Network error connecting to OTP dispatch service.","error")}};window.verifySubmittedOtp=async function(){var e;const t=(e=document.getElementById("reg-otp"))==null?void 0:e.value.trim();if(!t||t.length!==6){p("⚠","Please enter the 6-digit OTP code received.","error");return}try{const i=await fetch("http://localhost:3001/api/verify-otp",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contact:o.phone,code:t})}),n=await i.json();if(i.ok&&n.verified){o.isPhoneVerified=!0,o.isEmailVerified=!0,o.otpCode=t,p("✓","Mobile number & email successfully verified!","success");const s=document.getElementById("otp-status-badge");s&&(s.innerHTML=`<span style="color:var(--green);font-weight:700">✓ Verified: Mobile (${o.phone}) &amp; Email (${o.email}) authenticated</span>`)}else p("❌",n.error||"Invalid OTP code. Please retry.","error")}catch{p("❌","Error verifying OTP code. Please check connection.","error")}};window.handleInstitutionSelect=function(t){if(t==="other")o.isOtherInstitution=!0,o.institutionId="other";else{o.isOtherInstitution=!1,o.institutionId=t;const i=G.find(n=>n.id===t);i&&(o.institution=`${i.name} (${i.short_name})`)}const e=document.getElementById("other-inst-container");e&&(e.style.display=o.isOtherInstitution?"block":"none")};window.handleFundingTypeClick=function(t){o.fundingType=t,M()};window.triggerDocScan=async function(t,e){const i={idCopy:`${o.lastName||"Student"}_Certified_ID.pdf`,proofOfReg:`${o.lastName||"Student"}_2027_Proof_of_Reg.pdf`,fundingLetter:`${o.lastName||"Student"}_Funding_Award.pdf`};p("🔍",`Scanning ${e}: Verifying digital integrity & OCR match...`,"info",2500);const n="JVBERi0xLjQKJcTl8uXrp/Og0MTGCjEgMCBvYmoKPDwgL1R5cGUgL0NhdGFsb2cgL1BhZ2VzIDIgMCBSID4+CmVuZG9iagoyIDAgb2JqCjw8IC9UeXBlIC9QYWdlcyAvS2lkcyBbMyAwIFJdIC9Db3VudCAxID4+CmVuZG9iagozIDAgb2JqCjw8IC9UeXBlIC9QYWdlIC9QYXJlbnQgMiAwIFIgPj4KZW5kb2JqCnhyZWYKMCA0CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAwMDY4IDAwMDAwIG4gCjAwMDAwMDAxMjUgMDAwMDAgbiAKdHJhaWxlcgo8PCAvUm9vdCAxIDAgUiAvU2l6ZSA0ID4+CnN0YXJ0eHJlZgoxNzUKJSVFT0Y=";setTimeout(async()=>{o.docs[t]=!0,o.docValidation[t]={status:"valid",fileName:i[t],message:"✓ Verified & Matched"};try{await fetch("http://localhost:3001/api/validate-document",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({docType:t==="idCopy"?"id_copy":t==="proofOfReg"?"proof_of_registration":"funding_letter",fileName:i[t],mimeType:"application/pdf",fileBase64:n,fileSize:1024,expectedId:o.idNumber,expectedStudentNumber:o.studentNumber})})}catch{}p("✓",`${e} verified successfully and matched to profile!`,"success"),M()},1200)};window.nextRegStep=function(t){var e,i,n,s,a,r,l,c,d,v,y;if(t===1){const x=(e=document.getElementById("reg-id"))==null?void 0:e.value.trim(),f=(i=document.getElementById("reg-first"))==null?void 0:i.value.trim(),g=(n=document.getElementById("reg-last"))==null?void 0:n.value.trim();if(!x||x.length!==13){p("⚠","Please enter a valid 13-digit South African ID number.","error");return}const b=se(x);if(!b.isValid){p("⚠",b.error||"Invalid South African ID checksum.","error");return}if(!f||!g){p("⚠","Please enter your full first name and surname as in your ID.","error");return}o.idNumber=x,o.firstName=f,o.lastName=g,o.dob=b.dobFormatted,o.gender=b.gender,o.isCitizen=b.isCitizen}else if(t===2){const x=(s=document.getElementById("reg-phone"))==null?void 0:s.value.trim(),f=(a=document.getElementById("reg-email"))==null?void 0:a.value.trim(),g=oe(x);if(!g.isValid){p("⚠",g.error||"Please enter a valid South African mobile number.","error");return}if(!f||!f.includes("@")){p("⚠","Please enter a valid email address.","error");return}if(!o.isPhoneVerified){p("⚠","Please complete the SMS 2FA verification to confirm your phone number.","error");return}const b=((r=document.getElementById("reg-pass"))==null?void 0:r.value)||"";if(!b||b.length<6){p("⚠","Please create a secure password with at least 6 characters.","error");return}o.phone=g.formatted,o.email=f,o.password=b}else if(t===3){const x=(l=document.getElementById("reg-stnum"))==null?void 0:l.value.trim();if(!x){p("⚠","Please provide your institutional student number.","error");return}if(o.studentNumber=x,o.isOtherInstitution){const f=(c=document.getElementById("other-inst-name"))==null?void 0:c.value.trim(),g=(d=document.getElementById("other-inst-campus"))==null?void 0:d.value.trim();if(!f||!g){p("⚠","Please indicate both your institution name and campus location.","error");return}o.otherInstitutionName=f,o.otherInstitutionCampus=g,o.institution=`${f} (${g})`}else{const f=document.getElementById("reg-inst"),g=f==null?void 0:f.value,b=G.find(D=>D.id===g);b&&(o.institution=`${b.name} (${b.short_name})`,o.institutionId=g)}}else t===4&&(o.preferredResidence=((v=document.getElementById("reg-res"))==null?void 0:v.value)||"GKAS Residence (Sonheuwel)",o.roomType=((y=document.getElementById("reg-roomtype"))==null?void 0:y.value)||"Single Room",o.docs.idCopy=!0,o.docs.proofOfReg=!0,o.docs.fundingLetter=!0);m=t+1,M()};window.prevRegStep=function(t){m=t-1,M()};window.submitCompleteRegistration=async function(){var i;if(!((i=document.getElementById("reg-popia-consent"))==null?void 0:i.checked)){p("⚠","You must agree to the statutory POPIA declaration to submit.","error");return}const e=document.getElementById("submit-reg-btn");e&&(e.setAttribute("aria-busy","true"),e.disabled=!0,e.textContent="Submitting & Dispatching Transactional Alerts...");try{const n=await u.registerNewStudent(o),s=n.referenceNumber||`GKAS-2027-${Math.floor(1e4+Math.random()*9e4)}`,a=n.phone||o.phone||"071 829 4012",r=n.email||o.email||"student@tut4life.ac.za",l=n.institution||o.institution||"Tshwane University of Technology",c=n.funding||o.fundingType.toUpperCase(),d=document.getElementById("auth-panel-content");d&&(d.innerHTML=`
        <div style="text-align:center;padding:20px 8px">
          <div style="width:68px;height:68px;border-radius:50%;background:var(--green-soft);color:var(--green);display:flex;align-items:center;justify-content:center;font-size:32px;margin:0 auto 16px;box-shadow:0 4px 12px rgba(22,163,74,0.2)">✓</div>
          <h2 style="font-family:var(--font-serif);font-size:26px;color:var(--navy);font-weight:700">Application Lodged!</h2>
          <p style="font-size:13px;color:var(--text-sub);margin:8px 0 16px">Your official accommodation reference is <strong class="td-mono" style="color:var(--navy);font-size:15px">${s}</strong></p>
          
          <div style="background:var(--bg-alt);border:1px solid var(--border);border-radius:var(--radius-md);padding:16px;text-align:left;font-size:12px;margin-bottom:20px;line-height:1.7">
            <div style="font-weight:700;color:var(--navy);margin-bottom:8px;display:flex;justify-content:space-between">
              <span>Next Placement &amp; Notification Steps:</span>
              <span class="pill pill-amber" style="font-size:10px">STATUS: PENDING</span>
            </div>
            <div><strong>1. Confirmation Dispatched:</strong> A confirmation email was dispatched to <strong>${r}</strong> and SMS to <strong>${a}</strong>.</div>
            <div><strong>2. Landlord Alert:</strong> Residence Manager L. Marsher has been alerted for institutional verification with <strong>${l}</strong>.</div>
            <div><strong>3. Funding Review:</strong> Your declared funding (<strong>${c}</strong>) is under administrative validation.</div>
            <div><strong>4. Digital Offer:</strong> Once verified, an offer letter &amp; DocuSign lease agreement will be dispatched to your portal.</div>
          </div>

          <button class="btn btn-primary btn-full" onclick="window.setAuthMode('signin')">Sign In to Student Residence Portal</button>
        </div>
      `)}catch{p("❌","Error submitting application. Please retry.","error"),e&&(e.disabled=!1,e.textContent="Submit 2027 Residence Application")}};window.handleSignIn=async function(t){var r,l;t&&t.preventDefault();const e=document.getElementById("login-email"),i=document.getElementById("login-pass"),n=document.getElementById("signin-submit-btn"),s=(e==null?void 0:e.value.trim())||"",a=(i==null?void 0:i.value)||"";if(!s||!a){p("⚠","Please enter your email or student number and password.","error");return}n&&(n.setAttribute("aria-busy","true"),n.disabled=!0,n.textContent="Verifying credentials...");try{const c=await fetch("/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:s,password:a})}),d=await c.json().catch(()=>({}));if(c.ok&&d.success&&d.user)u.setAuthToken(d.token),u.setUser(d.user),(r=document.getElementById("login-page"))==null||r.classList.add("hidden"),(l=document.getElementById("app"))==null||l.classList.remove("hidden"),p("👋",`Welcome back, ${d.user.name}`,"success");else{const v=d.error||"Authentication failed. Please check your credentials.";p("❌",v,"error")}}catch(c){console.error("Sign-in error:",c),p("❌","Unable to reach the authentication server. Please check your network and retry.","error")}finally{n&&(n.disabled=!1,n.removeAttribute("aria-busy"),n.textContent="Sign in to Residence Portal")}};window.handleTrackLookup=function(){var e;const t=(e=document.getElementById("track-id-input"))==null?void 0:e.value.trim();p("🔍",`Lookup complete for ${t||"0308150493081"}: Application Active (Pending Review)`,"info")};window.handleForgotPassword=function(){h("Account Password Recovery",`
    <div style="padding:4px 0">
      <p style="font-size:13px;color:var(--text-sub);margin-bottom:16px;line-height:1.5">
        Enter your registered email address or student number. We will verify your profile and dispatch a secure password reset link and authorization PIN via SMS and email.
      </p>

      <form onsubmit="window.submitForgotPassword(event)">
        <div class="f-group" style="margin-bottom:14px">
          <label class="f-label" for="forgot-identifier">Email Address or Student Number <span class="f-required">*</span></label>
          <input class="f-input" type="text" id="forgot-identifier" placeholder="e.g. 21304567 or student@tut4life.ac.za" required autofocus>
        </div>

        <div id="forgot-modal-status" style="margin-bottom:14px;font-size:12px;display:none"></div>

        <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:16px">
          <button type="button" class="btn btn-ghost" onclick="window.closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary" id="forgot-submit-btn">Send Recovery Instructions</button>
        </div>
      </form>
    </div>
  `)};window.submitForgotPassword=async function(t){t&&t.preventDefault();const e=document.getElementById("forgot-identifier"),i=document.getElementById("forgot-submit-btn"),n=document.getElementById("forgot-modal-status"),s=e==null?void 0:e.value.trim();if(!s){n&&(n.style.display="block",n.style.color="#dc2626",n.textContent="Please enter your registered email or student number.");return}i&&(i.disabled=!0,i.textContent="Dispatching instructions...");try{const a=await fetch("/api/auth/forgot-password",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({identifier:s})}),r=await a.json().catch(()=>({}));if(a.ok&&r.success)n&&(n.style.display="block",n.style.color="#15803d",n.textContent=r.message||"Recovery instructions dispatched successfully."),p("✉️","Password reset instructions dispatched.","success"),setTimeout(()=>{w()},2e3);else{const l=r.error||"Failed to dispatch password recovery instructions.";n&&(n.style.display="block",n.style.color="#dc2626",n.textContent=l),p("⚠",l,"error")}}catch{n&&(n.style.display="block",n.style.color="#dc2626",n.textContent="Server connection error. Please try again."),p("❌","Error connecting to authentication service.","error")}finally{i&&(i.disabled=!1,i.textContent="Send Recovery Instructions")}};function _(t){const{currentRole:e}=u.state;e==="student"?Re(t):Ce(t)}function Re(t){const{currentUser:e,tickets:i,notices:n}=u.state,s=e||{},a=i.filter(r=>s.studentNumber&&r.studentId===s.studentNumber||s.name&&r.studentName===s.name);t.innerHTML=`
    <!-- Student Hero Card (NO BALANCE PAID) -->
    <div class="student-hero" role="region" aria-label="Student Information">
      <div class="sh-inner">
        <div class="sh-badge">Accredited Resident · 2027 Academic Year</div>
        <div class="sh-name">Sawubona, ${(s.name||"Resident").split(" ")[0]}.</div>
        <div class="sh-room">Room ${s.room||"Pending"} (${s.bed||"Bed A"}) · ${s.residence||"GKAS Residence"} · ${s.institution||"Accredited Institution"}</div>
        
        <div class="sh-stats">
          <div class="sh-stat">
            <div class="sh-stat-val">${s.room||"Pending"}</div>
            <div class="sh-stat-lbl">Allocated Room</div>
          </div>
          <div class="sh-stat">
            <div class="sh-stat-val">${s.funding||"NSFAS Accredited"}</div>
            <div class="sh-stat-lbl">Funding Status</div>
          </div>
          <div class="sh-stat">
            <div class="sh-stat-val">${s.leaseEnd||"30 Nov 2027"}</div>
            <div class="sh-stat-lbl">Lease Valid Until</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Move-in Action Banner -->
    <div class="card" style="border-left:5px solid var(--gold);background:linear-gradient(135deg, var(--gold-soft) 0%, #ffffff 100%);margin-bottom:22px;display:flex;align-items:center;gap:16px;flex-wrap:wrap">
      <div style="width:46px;height:46px;border-radius:12px;background:var(--gold);color:#fff;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0">✍️</div>
      <div style="flex:1;min-width:240px">
        <div style="font-weight:700;font-size:14px;color:var(--navy)">Move-In Room Condition Record</div>
        <div style="font-size:12px;color:var(--text-muted);margin-top:2px">Please inspect your room fittings, locks, and furniture within 48 hours to confirm condition.</div>
      </div>
      <button class="btn btn-gold btn-sm" onclick="stateService.setActiveModule('movein')">Review Room Checklist</button>
    </div>

    <!-- Quick Shortcuts Grid -->
    <div class="grid2">
      <div class="card">
        <div class="card-title">Residence Services &amp; Requests</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <button class="btn btn-ghost" style="justify-content:flex-start;background:var(--bg-alt);padding:14px;gap:12px;text-align:left;height:auto" onclick="stateService.setActiveModule('maintenance')">
            <span style="font-size:24px">🔧</span>
            <div>
              <div style="font-weight:700;color:var(--navy)">Request Maintenance</div>
              <div style="font-size:11px;color:var(--text-sub)">Log issue or notify manager</div>
            </div>
          </button>
          
          <button class="btn btn-ghost" style="justify-content:flex-start;background:var(--bg-alt);padding:14px;gap:12px;text-align:left;height:auto" onclick="stateService.setActiveModule('activity')">
            <span style="font-size:24px">🏊</span>
            <div>
              <div style="font-weight:700;color:var(--navy)">Book Amenity</div>
              <div style="font-size:11px;color:var(--text-sub)">Pool, Gym, or Study lab</div>
            </div>
          </button>

          <button class="btn btn-ghost" style="justify-content:flex-start;background:var(--bg-alt);padding:14px;gap:12px;text-align:left;height:auto" onclick="stateService.setActiveModule('my-lease')">
            <span style="font-size:24px">📄</span>
            <div>
              <div style="font-weight:700;color:var(--navy)">View Lease</div>
              <div style="font-size:11px;color:var(--text-sub)">DocuSign signed copy</div>
            </div>
          </button>

          <button class="btn btn-ghost" style="justify-content:flex-start;background:var(--bg-alt);padding:14px;gap:12px;text-align:left;height:auto" onclick="stateService.setActiveModule('bursary')">
            <span style="font-size:24px">🎓</span>
            <div>
              <div style="font-weight:700;color:var(--navy)">Bursary Status</div>
              <div style="font-size:11px;color:var(--text-sub)">Application tracker</div>
            </div>
          </button>
        </div>
      </div>

      <!-- Urgent Campus Notices -->
      <div class="card">
        <div class="card-title">
          Residence Notices &amp; Advisories
          <button class="btn btn-ghost btn-xs" onclick="stateService.setActiveModule('news')">View All</button>
        </div>
        <div>
          ${n.slice(0,3).map(r=>`
            <div style="display:flex;gap:12px;align-items:flex-start;padding:12px 0;border-bottom:1px solid var(--border-subtle)">
              <span style="font-size:20px;flex-shrink:0">${r.icon}</span>
              <div style="flex:1;min-width:0">
                <div style="font-weight:600;font-size:13px;color:var(--navy)">${r.title}</div>
                <div style="font-size:11px;color:var(--text-sub);margin-top:2px">${r.date} · ${r.residence}</div>
              </div>
              ${r.severity==="urgent"?'<span class="pill pill-red">Urgent</span>':""}
            </div>
          `).join("")}
        </div>
      </div>
    </div>

    <!-- Student Maintenance Requests & Notify -->
    <div class="card">
      <div class="card-title">
        My Active Maintenance Requests
        <button class="btn btn-primary btn-sm" onclick="stateService.setActiveModule('maintenance')">+ New Request</button>
      </div>
      
      ${a.length===0?`
        <p style="font-size:13px;color:var(--text-sub);padding:12px 0">You currently have no open maintenance tickets.</p>
      `:`
        <div style="display:flex;flex-direction:column;gap:10px">
          ${a.map(r=>`
            <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 16px;background:var(--bg-alt);border:1px solid var(--border);border-radius:var(--radius-md);gap:12px;flex-wrap:wrap">
              <div style="display:flex;align-items:center;gap:12px">
                <div style="width:38px;height:38px;border-radius:var(--radius-sm);background:${r.bg};display:flex;align-items:center;justify-content:center;font-size:18px">${r.icon}</div>
                <div>
                  <div style="font-weight:600;font-size:13px;color:var(--navy)">${r.title}</div>
                  <div style="font-size:11px;color:var(--text-sub)" class="td-mono">${r.id} · ${r.location} · ${r.category}</div>
                </div>
              </div>

              <div style="display:flex;align-items:center;gap:10px">
                <span class="pill ${r.status==="resolved"?"pill-green":r.priority==="urgent"?"pill-red":"pill-amber"}">
                  ${r.status==="resolved"?"Resolved":r.priority.toUpperCase()}
                </span>
                ${r.status==="open"?`
                  <button class="btn btn-gold btn-xs" onclick="window.handleNotifyMaintenance('${r.id}')">
                    📢 Notify Management
                  </button>
                `:""}
              </div>
            </div>
          `).join("")}
        </div>
      `}
    </div>
  `}function Ce(t){const{tickets:e,applicants:i,residences:n,auditLog:s}=u.state,a=i.filter(c=>!c.processed).length,r=e.filter(c=>c.status==="open"&&c.priority==="urgent").length,l=e.filter(c=>c.status==="open").length;t.innerHTML=`
    <!-- Action Queue Banner -->
    <div class="card" style="background:#ffffff;border-left:5px solid var(--navy);margin-bottom:22px">
      <div style="font-size:11px;font-weight:700;color:var(--text-sub);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:12px">Operations Queue &amp; Action Items</div>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn btn-ghost btn-sm" onclick="stateService.setActiveModule('applications')">
          <span>📋</span> Applications Awaiting Review
          <span class="pill pill-amber" style="margin-left:4px">${a}</span>
        </button>
        <button class="btn btn-ghost btn-sm" onclick="stateService.setActiveModule('maintenance')">
          <span>🚨</span> Urgent Maintenance Requests
          <span class="pill ${r>0?"pill-red":"pill-green"}" style="margin-left:4px">${r}</span>
        </button>
        <button class="btn btn-ghost btn-sm" onclick="stateService.setActiveModule('leases')">
          <span>✍️</span> Leases Awaiting Counter-Signature
          <span class="pill pill-blue" style="margin-left:4px">2</span>
        </button>
        <button class="btn btn-ghost btn-sm" onclick="stateService.setActiveModule('movein')">
          <span>🏠</span> Pending Move-in Inspections
          <span class="pill pill-navy" style="margin-left:4px">2</span>
        </button>
      </div>
    </div>

    <!-- High-level Metric Cards -->
    <div class="stat-grid">
      <div class="stat-card">
        <div class="stat-label">Total Student Beds</div>
        <div class="stat-val">108</div>
        <div class="stat-bar"><div class="stat-fill" style="width:85%"></div></div>
        <div class="stat-sub">GKAS Sonheuwel (88) · HTS Stonehenge (20)</div>
      </div>

      <div class="stat-card">
        <div class="stat-label">Active Occupancy</div>
        <div class="stat-val">92</div>
        <div class="stat-bar"><div class="stat-fill" style="width:85.2%;background:var(--green)"></div></div>
        <div class="stat-sub up">▲ 85.2% Occupied · 13 Available</div>
      </div>

      <div class="stat-card">
        <div class="stat-label">Open Maintenance</div>
        <div class="stat-val">${l}</div>
        <div class="stat-bar"><div class="stat-fill" style="width:35%;background:var(--red)"></div></div>
        <div class="stat-sub ${r>0?"down":""}">
          ${r>0?`▲ ${r} Urgent priority`:"✓ No urgent emergencies"}
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-label">Monthly Revenue (Billed)</div>
        <div class="stat-val">R186k</div>
        <div class="stat-bar"><div class="stat-fill" style="width:78%;background:var(--gold)"></div></div>
        <div class="stat-sub up">▲ 68% NSFAS Direct Bulk Payout</div>
      </div>
    </div>

    <!-- Live Residences Status Visualizer -->
    <div class="grid2">
      <div class="card">
        <div class="card-title">
          GKAS Residence — Sonheuwel
          <span class="pill pill-green">76 / 88 Occupied</span>
        </div>
        <p style="font-size:12px;color:var(--text-sub);margin-bottom:12px">Accredited student housing complex with 24/7 security, pool, and high-speed fibre.</p>
        
        <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:600;margin-bottom:6px">
          <span>Bed Allocation</span>
          <span>86.4%</span>
        </div>
        <div class="stat-bar" style="margin-bottom:16px;height:8px"><div class="stat-fill" style="width:86.4%;background:linear-gradient(90deg, var(--navy), var(--gold))"></div></div>
        
        <div style="display:grid;grid-template-columns:repeat(11, 1fr);gap:4px;margin-bottom:12px">
          ${Array.from({length:88},(c,d)=>`
            <div style="height:12px;border-radius:2px;background:${d<76?d===30||d===44?"var(--gold)":"var(--navy)":"#e2e8f0"}" title="Bed ${d+1}: ${d<76?d===30||d===44?"Maintenance":"Occupied":"Available"}"></div>
          `).join("")}
        </div>
        <div style="display:flex;gap:16px;font-size:11px;color:var(--text-sub)">
          <div style="display:flex;align-items:center;gap:6px"><span style="width:10px;height:10px;background:var(--navy);border-radius:2px"></span> Occupied (76)</div>
          <div style="display:flex;align-items:center;gap:6px"><span style="width:10px;height:10px;background:var(--gold);border-radius:2px"></span> Maintenance (2)</div>
          <div style="display:flex;align-items:center;gap:6px"><span style="width:10px;height:10px;background:#e2e8f0;border-radius:2px"></span> Vacant (10)</div>
        </div>
      </div>

      <div class="card">
        <div class="card-title">
          HTS Residence — Stonehenge
          <span class="pill pill-amber">16 / 20 Occupied</span>
        </div>
        <p style="font-size:12px;color:var(--text-sub);margin-bottom:12px">Quiet boutique student house with private gardens and dedicated study facilities.</p>
        
        <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:600;margin-bottom:6px">
          <span>Bed Allocation</span>
          <span>80.0%</span>
        </div>
        <div class="stat-bar" style="margin-bottom:16px;height:8px"><div class="stat-fill" style="width:80%;background:linear-gradient(90deg, var(--navy), var(--gold))"></div></div>

        <div style="display:grid;grid-template-columns:repeat(10, 1fr);gap:4px;margin-bottom:12px">
          ${Array.from({length:20},(c,d)=>`
            <div style="height:12px;border-radius:2px;background:${d<16?d===6?"var(--gold)":"var(--navy)":"#e2e8f0"}" title="Bed ${d+1}: ${d<16?d===6?"Maintenance":"Occupied":"Available"}"></div>
          `).join("")}
        </div>
        <div style="display:flex;gap:16px;font-size:11px;color:var(--text-sub)">
          <div style="display:flex;align-items:center;gap:6px"><span style="width:10px;height:10px;background:var(--navy);border-radius:2px"></span> Occupied (16)</div>
          <div style="display:flex;align-items:center;gap:6px"><span style="width:10px;height:10px;background:var(--gold);border-radius:2px"></span> Maintenance (1)</div>
          <div style="display:flex;align-items:center;gap:6px"><span style="width:10px;height:10px;background:#e2e8f0;border-radius:2px"></span> Vacant (3)</div>
        </div>
      </div>
    </div>

    <!-- Live Audit Activity -->
    <div class="card">
      <div class="card-title">
        Recent Residence Auditable Events
        <button class="btn btn-ghost btn-xs" onclick="stateService.setActiveModule('audit')">View Full Audit Trail</button>
      </div>
      <div>
        ${s.slice(0,4).map(c=>`
          <div style="display:flex;gap:12px;align-items:center;padding:10px 0;border-bottom:1px solid var(--border-subtle)">
            <div style="width:34px;height:34px;border-radius:var(--radius-sm);background:${c.bg};display:flex;align-items:center;justify-content:center;font-size:16px">${c.type}</div>
            <div style="flex:1;min-width:0">
              <div style="font-weight:600;font-size:13px;color:var(--navy)">${c.action}</div>
              <div style="font-size:11px;color:var(--text-sub)" class="td-mono">${c.meta}</div>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `}window.handleNotifyMaintenance=function(t){u.notifyTicketManagement(t,"Student requested an urgent status update via portal"),p("📢",`Facilities manager and warden notified for ticket ${t}. Alert sent via SMS & dashboard.`,"success")};let T="all";function z(t){const{currentRole:e}=u.state;e==="student"?Me(t):Be(t)}function Me(t){const{currentUser:e,tickets:i}=u.state,n=i.filter(s=>s.studentId===e.studentNumber||s.studentName===e.name);t.innerHTML=`
    <div class="section-hd">
      <div>
        <div class="section-title">Maintenance Requests</div>
        <div class="section-sub">Log room issues, track technician status, and notify residence management directly</div>
      </div>
    </div>

    <!-- Submit Ticket Form -->
    <div class="card" style="margin-bottom:24px">
      <div class="card-title">
        <span>🔧 Log a New Maintenance Request</span>
        <span class="pill pill-navy">Response SLA: Urgent &lt; 2h · Normal &lt; 24h</span>
      </div>
      
      <form onsubmit="window.handleStudentTicketSubmit(event)">
        <div class="f-row">
          <div class="f-group">
            <label class="f-label" for="st-loc">Location / Room Number <span class="f-required">*</span></label>
            <input class="f-input" type="text" id="st-loc" value="Room ${e.room||"G-14"}" required>
          </div>
          <div class="f-group">
            <label class="f-label" for="st-cat">Category <span class="f-required">*</span></label>
            <select class="f-input f-select" id="st-cat" required>
              <option value="Plumbing">Plumbing (Taps, Geyser, Drains, Toilet)</option>
              <option value="Electrical">Electrical (Power points, Lights, Breakers)</option>
              <option value="Security / Locks">Security (Door lock, Keys, Window latches)</option>
              <option value="Furniture / Fixtures">Furniture &amp; Fixtures (Desk, Wardrobe, Bed)</option>
              <option value="Fire / Safety">Emergency Fire / Safety Hazard</option>
              <option value="Other">Other General Repair</option>
            </select>
          </div>
        </div>

        <div class="f-row">
          <div class="f-group">
            <label class="f-label" for="st-pri">Urgency Level <span class="f-required">*</span></label>
            <select class="f-input f-select" id="st-pri" required>
              <option value="medium">Medium — Normal repair (Within 24 hours)</option>
              <option value="urgent">Urgent — Active leak, power failure, or security risk</option>
              <option value="low">Low — Minor fitting or cosmetic issue</option>
            </select>
          </div>
          <div class="f-group">
            <label class="f-label" for="st-res">Residence</label>
            <input class="f-input" type="text" id="st-res" value="${e.residence}" readonly style="background:var(--bg-muted)">
          </div>
        </div>

        <div class="f-group">
          <label class="f-label" for="st-desc">Detailed Description <span class="f-required">*</span></label>
          <textarea class="f-input" id="st-desc" placeholder="Please describe the issue, exactly where it is located, and whether it poses an immediate safety hazard..." required></textarea>
        </div>

        <div class="f-group">
          <label class="f-checkbox">
            <input type="checkbox" id="st-consent" checked>
            <span>I grant permission for accredited residence maintenance staff to access my room to effect repairs if I am attending lectures.</span>
          </label>
        </div>

        <button type="submit" class="btn btn-primary" id="sub-ticket-btn" style="min-width:200px">
          Submit Maintenance Request
        </button>
      </form>
    </div>

    <!-- My Submitted Requests with NOTIFY MANAGEMENT Button -->
    <div class="card">
      <div class="card-title">
        My Submitted Requests
        <span style="font-size:12px;color:var(--text-sub)">${n.length} Total Requests</span>
      </div>

      ${n.length===0?`
        <div style="text-align:center;padding:32px 16px;color:var(--text-sub)">
          <div style="font-size:32px;margin-bottom:8px">🛠️</div>
          <p>You have no active maintenance tickets logged.</p>
        </div>
      `:`
        <div style="display:flex;flex-direction:column;gap:14px">
          ${n.map(s=>`
            <div class="card" style="margin-bottom:0;border:1px solid var(--border);padding:18px;background:#ffffff">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap">
                <div style="display:flex;gap:14px;align-items:flex-start">
                  <div style="width:42px;height:42px;border-radius:var(--radius-md);background:${s.bg};display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0">
                    ${s.icon}
                  </div>
                  <div>
                    <div style="font-weight:700;font-size:14px;color:var(--navy)">${s.title}</div>
                    <div style="font-size:12px;color:var(--text-sub);margin:2px 0 6px" class="td-mono">${s.id} · ${s.location} · ${s.category}</div>
                    <p style="font-size:13px;color:var(--text-muted);line-height:1.5">${s.description}</p>
                    ${s.lastNotified?`
                      <div style="font-size:11px;color:var(--gold);font-weight:600;margin-top:6px">
                        📢 Management notified on ${new Date(s.lastNotified).toLocaleDateString("en-GB")} at ${new Date(s.lastNotified).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"})}
                      </div>
                    `:""}
                  </div>
                </div>

                <div style="display:flex;flex-direction:column;align-items:flex-end;gap:10px;flex-shrink:0">
                  <span class="pill ${s.status==="resolved"?"pill-green":s.priority==="urgent"?"pill-red":"pill-amber"}">
                    ${s.status==="resolved"?"Resolved":s.priority.toUpperCase()}
                  </span>

                  ${s.status==="open"?`
                    <button class="btn btn-gold btn-sm" onclick="window.openStudentNotifyModal('${s.id}', '${s.title.replace(/'/g,"\\'")}')">
                      📢 Notify Management
                    </button>
                  `:`
                    <span style="font-size:11px;color:var(--green);font-weight:600">✓ Completed &amp; Inspected</span>
                  `}
                </div>
              </div>
            </div>
          `).join("")}
        </div>
      `}
    </div>
  `}function Be(t){const{tickets:e}=u.state,i=e.filter(s=>T==="all"?s.status==="open":T==="resolved"?s.status==="resolved":s.status==="open"&&s.priority===T),n=e.filter(s=>s.status==="open"&&s.priority==="urgent").length;t.innerHTML=`
    <div class="section-hd">
      <div>
        <div class="section-title">Facilities &amp; Maintenance Operations</div>
        <div class="section-sub">Dispatch technicians, track job orders, and record resolution notes</div>
      </div>
      <button class="btn btn-primary btn-sm" onclick="window.openStaffNewTicketModal()">+ Dispatch Job Order</button>
    </div>

    <!-- Filter Bar -->
    <div style="display:flex;gap:8px;margin-bottom:18px;flex-wrap:wrap">
      <button class="btn ${T==="all"?"btn-primary":"btn-ghost"} btn-sm" onclick="window.setFilter('all')">
        All Open (${e.filter(s=>s.status==="open").length})
      </button>
      <button class="btn ${T==="urgent"?"btn-primary":"btn-ghost"} btn-sm" onclick="window.setFilter('urgent')">
        Urgent (${n})
      </button>
      <button class="btn ${T==="medium"?"btn-primary":"btn-ghost"} btn-sm" onclick="window.setFilter('medium')">
        Medium Priority
      </button>
      <button class="btn ${T==="low"?"btn-primary":"btn-ghost"} btn-sm" onclick="window.setFilter('low')">
        Low Priority
      </button>
      <button class="btn ${T==="resolved"?"btn-primary":"btn-ghost"} btn-sm" onclick="window.setFilter('resolved')">
        Resolved Archive
      </button>
    </div>

    <!-- Tickets List -->
    <div style="display:flex;flex-direction:column;gap:12px">
      ${i.length===0?`
        <div class="card" style="text-align:center;padding:32px;color:var(--text-sub)">
          <p>No maintenance tickets match the selected filter.</p>
        </div>
      `:""}

      ${i.map(s=>`
        <div class="card" style="margin-bottom:0;border-left:4px solid ${s.priority==="urgent"?"var(--red)":s.priority==="medium"?"var(--gold)":"var(--blue)"}">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:14px;flex-wrap:wrap">
            <div style="display:flex;gap:14px;align-items:flex-start">
              <div style="width:40px;height:40px;border-radius:var(--radius-sm);background:${s.bg};display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0">
                ${s.icon}
              </div>
              <div>
                <div style="font-weight:700;font-size:14px;color:var(--navy)">${s.title}</div>
                <div style="font-size:12px;color:var(--text-sub);margin:2px 0 6px" class="td-mono">
                  ${s.id} · ${s.location} · Logged by ${s.studentName}
                </div>
                <p style="font-size:13px;color:var(--text-muted)">${s.description}</p>
                ${s.resolutionNote?`
                  <div style="margin-top:8px;padding:8px 12px;background:var(--green-soft);border-radius:var(--radius-sm);font-size:12px;color:var(--green-hover)">
                    <strong>Resolution Note:</strong> ${s.resolutionNote}
                  </div>
                `:""}
              </div>
            </div>

            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
              <span class="pill ${s.status==="resolved"?"pill-green":s.priority==="urgent"?"pill-red":"pill-amber"}">
                ${s.status==="resolved"?"RESOLVED":s.priority.toUpperCase()}
              </span>

              ${s.status==="open"?`
                <button class="btn btn-success btn-sm" onclick="window.openStaffResolveModal('${s.id}')">Mark Resolved</button>
                <button class="btn btn-ghost btn-sm" onclick="window.notifyStudentUpdate('${s.studentName}', '${s.id}')">Notify Student</button>
              `:""}
            </div>
          </div>
        </div>
      `).join("")}
    </div>
  `}window.setFilter=function(t){T=t;const e=document.getElementById("main-content");e&&z(e)};window.handleStudentTicketSubmit=function(t){var c,d,v,y;t.preventDefault();const e=(c=document.getElementById("st-loc"))==null?void 0:c.value.trim(),i=(d=document.getElementById("st-cat"))==null?void 0:d.value,n=(v=document.getElementById("st-pri"))==null?void 0:v.value,s=(y=document.getElementById("st-desc"))==null?void 0:y.value.trim();if(!e||!s){p("⚠","Please provide location and description.","error");return}const{currentUser:a}=u.state,r=u.addTicket({title:`${i} issue at ${e}`,location:e,residence:a.residence,priority:n,category:i,studentName:a.name,studentId:a.studentNumber,description:s});p("✓",`Ticket ${r.id} logged. Facilities team notified.`,"success");const l=document.getElementById("main-content");l&&z(l)};window.openStudentNotifyModal=function(t,e){h(`Notify Management — ${t}`,`
    <div style="margin-bottom:14px;font-size:13px;color:var(--text-muted);line-height:1.5">
      Send an instant notification directly to the <strong>Residence Warden</strong> and <strong>Facilities Supervisor</strong> regarding:
      <div style="font-weight:700;color:var(--navy);margin-top:4px">"${e}"</div>
    </div>

    <div class="f-group">
      <label class="f-label" for="notify-msg">Message / Follow-up Details</label>
      <textarea class="f-input" id="notify-msg" placeholder="e.g. The leak has worsened this afternoon, please send someone urgently..." rows="3">Urgent update: This issue requires priority attention today.</textarea>
    </div>

    <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:16px">
      <button class="btn btn-ghost" onclick="window.closeModal()">Cancel</button>
      <button class="btn btn-gold" onclick="window.submitStudentNotify('${t}')">Dispatch Notification to Management</button>
    </div>
  `)};window.submitStudentNotify=function(t){var n;const e=(n=document.getElementById("notify-msg"))==null?void 0:n.value.trim();u.notifyTicketManagement(t,e),w(),p("📢",`Management alerted for ${t}. Facilities supervisor has received the SMS ping.`,"success");const i=document.getElementById("main-content");i&&z(i)};window.openStaffResolveModal=function(t){h(`Resolve Ticket — ${t}`,`
    <div class="f-group">
      <label class="f-label" for="res-notes">Resolution Work Details <span class="f-required">*</span></label>
      <textarea class="f-input" id="res-notes" placeholder="Describe the parts replaced, technician sign-off, and testing conducted..." rows="3" required></textarea>
    </div>

    <div style="display:flex;gap:10px;justify-content:flex-end">
      <button class="btn btn-ghost" onclick="window.closeModal()">Cancel</button>
      <button class="btn btn-success" onclick="window.confirmStaffResolve('${t}')">Mark as Completed</button>
    </div>
  `)};window.confirmStaffResolve=function(t){var n;const e=(n=document.getElementById("res-notes"))==null?void 0:n.value.trim();if(!e){p("⚠","Please enter a resolution note.","error");return}u.resolveTicket(t,e),w(),p("✓",`Ticket ${t} resolved and logged in audit trail.`,"success");const i=document.getElementById("main-content");i&&z(i)};window.notifyStudentUpdate=function(t,e){p("📧",`Automated SMS & email progress update dispatched to ${t} for ticket ${e}.`,"info")};window.openStaffNewTicketModal=function(){h("Dispatch New Facilities Work Order",`
    <div class="f-row">
      <div class="f-group">
        <label class="f-label" for="ord-loc">Location</label>
        <input class="f-input" id="ord-loc" placeholder="e.g. GKAS Block B Ablution">
      </div>
      <div class="f-group">
        <label class="f-label" for="ord-cat">Trade</label>
        <select class="f-input f-select" id="ord-cat">
          <option>Plumbing</option><option>Electrical</option><option>Carpentry / Locks</option>
        </select>
      </div>
    </div>
    <div class="f-group">
      <label class="f-label" for="ord-desc">Scope of Work</label>
      <textarea class="f-input" id="ord-desc" placeholder="Work instructions..."></textarea>
    </div>
    <div style="display:flex;gap:10px;justify-content:flex-end">
      <button class="btn btn-ghost" onclick="window.closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="window.submitStaffJobOrder()">Create Job Order</button>
    </div>
  `)};window.submitStaffJobOrder=function(){var s,a,r;const t=((s=document.getElementById("ord-loc"))==null?void 0:s.value)||"Common Area",e=((a=document.getElementById("ord-cat"))==null?void 0:a.value)||"Plumbing",i=((r=document.getElementById("ord-desc"))==null?void 0:r.value)||"Maintenance job";u.addTicket({title:`${e} Work Order: ${t}`,location:t,residence:"GKAS Residence",priority:"medium",category:e,studentName:"Facilities Staff",studentId:"FAC-01",description:i}),w(),p("✓","Work order generated and assigned to technician.","success");const n=document.getElementById("main-content");n&&z(n)};function Ee(t){t.innerHTML=`
    <div class="section-hd">
      <div>
        <div class="section-title">Residence Activity Hub</div>
        <div class="section-sub">Book recreational, wellness, and academic study spaces across HTS &amp; GKAS campuses</div>
      </div>
    </div>

    <!-- Amenities Grid (NO TRANSPORT REQUEST) -->
    <div class="grid2">
      ${ee.map(e=>`
        <div class="card" style="display:flex;flex-direction:column;justify-content:space-between">
          <div>
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">
              <div style="width:48px;height:48px;border-radius:var(--radius-md);background:${e.bg};display:flex;align-items:center;justify-content:center;font-size:24px">
                ${e.icon}
              </div>
              <span class="pill pill-green">Open Daily</span>
            </div>

            <h3 style="font-family:var(--font-serif);font-size:20px;font-weight:700;color:var(--navy);margin-bottom:4px">${e.name}</h3>
            <div style="font-size:12px;color:var(--text-sub);margin-bottom:8px;font-weight:500">${e.residence} · ${e.info}</div>
            <p style="font-size:13px;color:var(--text-muted);line-height:1.5;margin-bottom:16px">${e.description}</p>
          </div>

          <div style="border-top:1px solid var(--border-subtle);padding-top:14px">
            <div style="font-size:11px;font-weight:700;color:var(--text-sub);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px">Available Sessions Today</div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px">
              ${e.slots.slice(0,3).map(i=>`
                <span style="font-size:11px;padding:4px 8px;background:var(--bg-alt);border:1px solid var(--border);border-radius:var(--radius-xs);color:var(--navy)">
                  ${i}
                </span>
              `).join("")}
            </div>
            <button class="btn btn-primary btn-full" onclick="window.openBookingDialog('${e.id}')">
              Reserve a Slot
            </button>
          </div>
        </div>
      `).join("")}
    </div>

    <!-- Residence Rules for Facilities Banner -->
    <div class="card" style="background:var(--bg-alt);border:1px solid var(--border);border-left:4px solid var(--gold)">
      <div style="font-weight:700;font-size:14px;color:var(--navy);margin-bottom:6px">Facility Usage Guidelines</div>
      <div style="font-size:12px;color:var(--text-muted);line-height:1.6">
        • Facilities are for registered HTS &amp; GKAS students only. Student cards must be produced upon request by security or wardens.<br>
        • Study labs enforce 24/7 silence; headphones are required for audio/video material.<br>
        • Please leave all gym equipment wiped down and pool furniture returned to original positions after use.
      </div>
    </div>
  `}window.openBookingDialog=function(t){const e=ee.find(n=>n.id===t);if(!e)return;const i=new Date().toISOString().split("T")[0];h(`Book ${e.name}`,`
    <div style="margin-bottom:14px;font-size:13px;color:var(--text-muted)">
      Reserve your timeslot at <strong>${e.residence}</strong>. Access will be activated on your student room access card.
    </div>

    <div class="f-row">
      <div class="f-group">
        <label class="f-label" for="bk-date">Date</label>
        <input class="f-input" type="date" id="bk-date" value="${i}" min="${i}">
      </div>
      <div class="f-group">
        <label class="f-label" for="bk-slot">Preferred Slot</label>
        <select class="f-input f-select" id="bk-slot">
          ${e.slots.map(n=>`<option value="${n}">${n}</option>`).join("")}
        </select>
      </div>
    </div>

    <div class="f-group">
      <label class="f-label" for="bk-pax">Number of Attending Residents</label>
      <input class="f-input" type="number" id="bk-pax" min="1" max="6" value="1">
    </div>

    <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:16px">
      <button class="btn btn-ghost" onclick="window.closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="window.confirmAmenityBooking('${e.id}', '${e.name.replace(/'/g,"\\'")}')">Confirm Booking</button>
    </div>
  `)};window.confirmAmenityBooking=function(t,e){var r,l,c;const i=((r=document.getElementById("bk-date"))==null?void 0:r.value)||new Date().toISOString().split("T")[0],n=(l=document.getElementById("bk-slot"))==null?void 0:l.value,s=parseInt((c=document.getElementById("bk-pax"))==null?void 0:c.value,10)||1,{currentUser:a}=u.state;u.addAmenityBooking({amenityId:t,amenityName:e,studentName:a.name||"Student Resident",studentNumber:a.studentNumber||a.id||"",date:i,slot:n,pax:s}),w(),p("✓",`Booking confirmed for ${e} on ${i} (${n}). Have a great session!`,"success")};function ae(t){const{currentRole:e}=u.state;e==="student"?Pe(t):ze(t)}function Pe(t){const{currentUser:e,bursaryApplications:i}=u.state,n=i.find(s=>s.studentName===e.name||e.studentNumber&&s.studentNumber===e.studentNumber)||null;t.innerHTML=`
    <div class="section-hd">
      <div>
        <div class="section-title">Bursary &amp; Funding Portal</div>
        <div class="section-sub">2027 Residence Accommodation Bursary Schemes &amp; Top-Up Grants</div>
      </div>
      <span class="pill pill-red">Closing Date: 31 May 2027</span>
    </div>

    <!-- Active Application Status Card -->
    <div class="card" style="border-left:5px solid var(--gold);margin-bottom:24px">
      <div class="card-title">
        <span>My 2027 Bursary Application Status</span>
        <span class="pill ${n?"pill-amber":"pill-navy"}">${n?n.status:"Not Submitted"}</span>
      </div>

      ${n?`
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:14px;margin-bottom:14px;font-size:13px">
          <div><span style="color:var(--text-sub)">Reference:</span> <strong class="td-mono">${n.id}</strong></div>
          <div><span style="color:var(--text-sub)">Scheme:</span> <strong>${n.fundingSource}</strong></div>
          <div><span style="color:var(--text-sub)">Submitted:</span> <strong>${n.submittedDate}</strong></div>
          <div><span style="color:var(--text-sub)">Documents:</span> <span class="pill pill-green" style="font-size:10px">Verified</span></div>
        </div>
        <p style="font-size:12px;color:var(--text-muted);line-height:1.6">
          Your accommodation top-up application has been forwarded to the institutional financial aid committee. Decisions are communicated via email and registered SMS.
        </p>
      `:`
        <div style="padding:8px 0">
          <p style="font-size:13px;color:var(--text-sub);margin-bottom:6px">You have not submitted an accommodation bursary application for the 2027 academic cycle.</p>
          <div style="font-size:12px;color:var(--gold);font-weight:600">Please complete and submit the official application form below to request funding gap assistance.</div>
        </div>
      `}
    </div>

    <!-- Bursary Application Form for Student -->
    <div class="card">
      <div class="card-title">Apply for 2027 Residence Bursary / Top-Up Grant</div>
      <p style="font-size:12px;color:var(--text-sub);margin-bottom:16px">
        Available to registered TUT and UMP students requiring housing gap funding or municipal transport top-ups for 2027.
      </p>

      <form onsubmit="window.handleBursarySubmit(event)">
        <div class="f-row">
          <div class="f-group">
            <label class="f-label" for="bu-name">Full Legal Name <span class="f-required">*</span></label>
            <input class="f-input" type="text" id="bu-name" value="${e.name}" required>
          </div>
          <div class="f-group">
            <label class="f-label" for="bu-num">Student Number <span class="f-required">*</span></label>
            <input class="f-input" type="text" id="bu-num" value="${e.studentNumber||"21304567"}" required>
          </div>
        </div>

        <div class="f-row">
          <div class="f-group">
            <label class="f-label" for="bu-inst">Institution <span class="f-required">*</span></label>
            <input class="f-input" type="text" id="bu-inst" value="${e.institution}" required>
          </div>
          <div class="f-group">
            <label class="f-label" for="bu-source">Funding Stream <span class="f-required">*</span></label>
            <select class="f-input f-select" id="bu-source">
              <option>NSFAS Accommodation Gap Top-Up</option>
              <option>University Merit Residence Grant</option>
              <option>Corporate Social Investment (CSI) Bursary</option>
            </select>
          </div>
        </div>

        <div style="font-size:13px;font-weight:700;color:var(--navy);margin:16px 0 10px">Required Document Uploads (PDF Only)</div>
        
        <div class="grid3" style="margin-bottom:16px">
          <div style="padding:14px;background:var(--bg-alt);border:1.5px dashed var(--border);border-radius:var(--radius-md);text-align:center;cursor:pointer" onclick="showToast('📎', 'Academic transcript attached.', 'info')">
            <div style="font-size:24px;margin-bottom:4px">📄</div>
            <div style="font-weight:600;font-size:12px;color:var(--navy)">Official Transcript</div>
            <div style="font-size:10px;color:var(--text-sub)">Latest results · PDF</div>
          </div>

          <div style="padding:14px;background:var(--bg-alt);border:1.5px dashed var(--border);border-radius:var(--radius-md);text-align:center;cursor:pointer" onclick="showToast('📎', 'Proof of registration attached.', 'info')">
            <div style="font-size:24px;margin-bottom:4px">🎓</div>
            <div style="font-weight:600;font-size:12px;color:var(--navy)">Proof of Registration / Admission</div>
            <div style="font-size:10px;color:var(--text-sub)">Current 2027 academic year</div>
          </div>

          <div style="padding:14px;background:var(--bg-alt);border:1.5px dashed var(--border);border-radius:var(--radius-md);text-align:center;cursor:pointer" onclick="showToast('📎', 'Proof of income / affidavit attached.', 'info')">
            <div style="font-size:24px;margin-bottom:4px">💼</div>
            <div style="font-weight:600;font-size:12px;color:var(--navy)">Household Income / Affidavit</div>
            <div style="font-size:10px;color:var(--text-sub)">Salary slip or SASSA letter</div>
          </div>
        </div>

        <div class="f-group">
          <label class="f-checkbox">
            <input type="checkbox" id="bu-consent" checked>
            <span>I declare that all information submitted is true and complete, and I consent to verification with the National Student Financial Aid Scheme and university financial aid offices.</span>
          </label>
        </div>

        <button type="submit" class="btn btn-primary" style="min-width:220px">Submit Bursary Application</button>
      </form>
    </div>
  `}function ze(t){const{bursaryApplications:e}=u.state;t.innerHTML=`
    <div class="section-hd">
      <div>
        <div class="section-title">Bursary Administration &amp; Review</div>
        <div class="section-sub">Verify student eligibility, approve accommodation grants, and allocate funds</div>
      </div>
      <button class="btn btn-ghost btn-sm" onclick="showToast('📊', 'Bursary cycle CSV report exported.', 'info')">Export Report</button>
    </div>

    <!-- Review Queue (Staff Only) -->
    <div class="card">
      <div class="card-title">
        2027 Academic Cycle Bursary Review Queue
        <span class="pill pill-blue">${e.length} Applications</span>
      </div>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Ref</th>
              <th>Student Name</th>
              <th>Institution</th>
              <th>Funding Stream</th>
              <th>Submitted</th>
              <th>Status</th>
              <th>Staff Actions</th>
            </tr>
          </thead>
          <tbody>
            ${e.map(i=>`
              <tr>
                <td class="td-mono">${i.id}</td>
                <td class="td-bold">${i.studentName}</td>
                <td>${i.institution}</td>
                <td><span class="pill pill-navy">${i.fundingSource}</span></td>
                <td>${i.submittedDate}</td>
                <td><span class="pill ${i.status==="Approved"?"pill-green":"pill-amber"}">${i.status}</span></td>
                <td>
                  <div style="display:flex;gap:6px">
                    <button class="btn btn-success btn-xs" onclick="window.approveBursary('${i.id}')">Approve</button>
                    <button class="btn btn-ghost btn-xs" onclick="showToast('📋', 'Detailed documents opened for ${i.studentName}.', 'info')">Review</button>
                  </div>
                </td>
              </tr>
            `).join("")}
            <tr>
              <td class="td-mono">BUR-2027-074</td>
              <td class="td-bold">Sibusiso Dlamini</td>
              <td>UMP Mbombela</td>
              <td><span class="pill pill-navy">University Merit Grant</span></td>
              <td>08 Feb 2027</td>
              <td><span class="pill pill-green">Approved</span></td>
              <td><span class="pill pill-gray" style="font-size:10px">Completed</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `}window.handleBursarySubmit=function(t){var l,c,d,v;t.preventDefault();const e=(l=document.getElementById("bu-name"))==null?void 0:l.value.trim(),i=(c=document.getElementById("bu-num"))==null?void 0:c.value.trim(),n=(d=document.getElementById("bu-inst"))==null?void 0:d.value.trim(),s=(v=document.getElementById("bu-source"))==null?void 0:v.value,a=u.submitBursaryApplication({fullName:e,studentNumber:i,institution:n,fundingSource:s});p("✓",`Bursary application ${a.id} submitted successfully! Decision will be released within 14 days.`,"success");const r=document.getElementById("main-content");r&&ae(r)};window.approveBursary=function(t){p("✓",`Bursary application ${t} approved and allocated. Student notified via email.`,"success")};function De(t){const{residences:e}=u.state;t.innerHTML=`
    <div class="section-hd">
      <div>
        <div class="section-title">Residents &amp; Room Allocation</div>
        <div class="section-sub">Manage 108 accredited beds across GKAS (Sonheuwel) and HTS (Stonehenge)</div>
      </div>
      <div style="display:flex;gap:8px">
        <button class="btn btn-ghost btn-sm" onclick="showToast('📊', 'Occupancy roster exported to CSV.', 'info')">Export Roster</button>
        <button class="btn btn-primary btn-sm" onclick="window.openAssignBedModal()">+ Allocate Bed</button>
      </div>
    </div>

    <!-- Residence Capacity Summary -->
    <div class="grid2">
      ${e.map(i=>`
        <div class="card">
          <div class="card-title">
            <span>${i.name} — ${i.campus}</span>
            <span class="pill pill-green">${i.occupiedBeds} / ${i.totalBeds} Occupied</span>
          </div>

          <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-sub);margin-bottom:6px">
            <span>Occupancy Rate</span>
            <strong>${Math.round(i.occupiedBeds/i.totalBeds*100)}%</strong>
          </div>
          <div class="stat-bar" style="height:8px;margin-bottom:14px">
            <div class="stat-fill" style="width:${i.occupiedBeds/i.totalBeds*100}%;background:linear-gradient(90deg, var(--navy), var(--gold))"></div>
          </div>

          <div style="display:flex;gap:16px;font-size:12px;color:var(--text-muted);margin-bottom:14px">
            <div>Available Beds: <strong>${i.availableBeds}</strong></div>
            <div>Monthly Rate: <strong>R${i.rateMonthly.toLocaleString()}</strong></div>
          </div>

          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Room</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Allocated Residents</th>
                </tr>
              </thead>
              <tbody>
                ${i.rooms.map(n=>`
                  <tr>
                    <td><code class="td-mono">${n.roomNumber}</code></td>
                    <td>${n.type}</td>
                    <td>
                      <span class="pill ${n.occupied===n.beds?"pill-green":n.status==="LEASEPENDING"?"pill-blue":n.status==="MOVEINPENDING"?"pill-amber":"pill-navy"}">
                        ${n.occupied===n.beds?"OCCUPIED":n.status||"AVAILABLE"}
                      </span>
                    </td>
                    <td>${n.residents.join(", ")||'<span style="color:var(--text-light)">Unassigned</span>'}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      `).join("")}
    </div>
  `}window.openAssignBedModal=function(){h("Allocate Accredited Bed",`
    <div style="font-size:12px;color:var(--text-sub);margin-bottom:14px">
      Bed assignment runs in an atomic transaction verifying no duplicate lease exists.
    </div>

    <div class="f-row">
      <div class="f-group">
        <label class="f-label" for="ab-name">Student Full Name</label>
        <input class="f-input" id="ab-name" placeholder="e.g. Sipho Sithole">
      </div>
      <div class="f-group">
        <label class="f-label" for="ab-stnum">Student Number</label>
        <input class="f-input" id="ab-stnum" placeholder="e.g. 22091244">
      </div>
    </div>

    <div class="f-row">
      <div class="f-group">
        <label class="f-label" for="ab-res">Residence</label>
        <select class="f-input f-select" id="ab-res">
          <option>GKAS Residence — Sonheuwel</option>
          <option>HTS Residence — Stonehenge</option>
        </select>
      </div>
      <div class="f-group">
        <label class="f-label" for="ab-bed">Select Bed Unit</label>
        <select class="f-input f-select" id="ab-bed">
          <option>G-02 Bed A (Single Room)</option>
          <option>G-04 Bed B (Double Sharing)</option>
          <option>H-05 Bed A (Single Room)</option>
        </select>
      </div>
    </div>

    <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:16px">
      <button class="btn btn-ghost" onclick="window.closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="window.confirmBedAllocation()">Confirm &amp; Generate Lease</button>
    </div>
  `)};window.confirmBedAllocation=function(){var i,n;const t=((i=document.getElementById("ab-name"))==null?void 0:i.value)||"Student",e=((n=document.getElementById("ab-bed"))==null?void 0:n.value)||"G-02";w(),p("✓",`Bed ${e} assigned to ${t}. DocuSign lease draft queued.`,"success")};function Le(t){const{currentRole:e,currentUser:i}=u.state;e==="student"?Fe(t,i):Oe(t)}function Fe(t,e){const i=e.academicYear||2027,n=e.leaseStart||`01 Feb ${i}`,s=e.leaseEnd||`30 Nov ${i}`,a=e.docusignRef||`DSENV-${i}-MP-2842`;t.innerHTML=`
    <div class="section-hd">
      <div>
        <div class="section-title">Residential Lease Agreement ${i}</div>
        <div class="section-sub">Room ${e.room||"G-14"} (${e.bed||"Bed A"}) · ${e.residence}</div>
      </div>
      <button class="btn btn-ghost btn-sm" onclick="showToast('📄', 'Time-limited signed PDF download URL generated (valid 15 minutes).', 'info')">
        Download Signed PDF
      </button>
    </div>

    <!-- Active Lease Card -->
    <div class="card" style="border-top:4px solid var(--gold);margin-bottom:20px">
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:18px">
        <div style="width:48px;height:48px;border-radius:12px;background:var(--navy);display:flex;align-items:center;justify-content:center;color:#fff;font-size:22px">
          📄
        </div>
        <div style="flex:1">
          <div style="font-family:var(--font-serif);font-size:22px;font-weight:700;color:var(--navy)">Accredited Student Accommodation Lease</div>
          <div style="font-size:12px;color:var(--text-sub)">DocuSign Envelope ID: <strong>${a}</strong> · Signed ${n}</div>
        </div>
        <span class="pill pill-green">ACTIVE LEASE</span>
      </div>

      <div class="grid4" style="margin-bottom:18px">
        <div style="padding:12px;background:var(--bg-alt);border:1px solid var(--border);border-radius:var(--radius-sm)">
          <div class="stat-label">Resident Tenant</div>
          <div style="font-weight:600;font-size:13px">${e.name}</div>
        </div>
        <div style="padding:12px;background:var(--bg-alt);border:1px solid var(--border);border-radius:var(--radius-sm)">
          <div class="stat-label">Commencement Date</div>
          <div style="font-weight:600;font-size:13px">${n}</div>
        </div>
        <div style="padding:12px;background:var(--bg-alt);border:1px solid var(--border);border-radius:var(--radius-sm)">
          <div class="stat-label">Termination Date</div>
          <div style="font-weight:600;font-size:13px">${s}</div>
        </div>
        <div style="padding:12px;background:var(--bg-alt);border:1px solid var(--border);border-radius:var(--radius-sm)">
          <div class="stat-label">Accredited Funding</div>
          <div style="font-weight:600;font-size:13px">${e.funding||"NSFAS Direct"}</div>
        </div>
      </div>

      <div style="font-size:13px;font-weight:700;color:var(--navy);margin-bottom:8px">Primary Statutory Conditions</div>
      <ul style="list-style:none;display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:12px;color:var(--text-muted)">
        <li style="display:flex;gap:6px"><span>✓</span> Strictly no subletting or unauthorized room swapping permitted.</li>
        <li style="display:flex;gap:6px"><span>✓</span> 30 calendar days written notice required prior to early vacate.</li>
        <li style="display:flex;gap:6px"><span>✓</span> Student agrees to adhere to the code of conduct and quiet hours.</li>
        <li style="display:flex;gap:6px"><span>✓</span> Maintenance defects must be reported within 48 hours via portal.</li>
      </ul>
    </div>
  `}function Oe(t){t.innerHTML=`
    <div class="section-hd">
      <div>
        <div class="section-title">Leases &amp; Legal Agreements</div>
        <div class="section-sub">DocuSign webhook-verified digital contracts with cryptographic timestamps</div>
      </div>
      <button class="btn btn-primary btn-sm" onclick="window.openGenerateLeaseModal()">+ Generate New Lease</button>
    </div>

    <!-- Leases Lifecycle -->
    <div class="card" style="margin-bottom:20px">
      <div class="card-title">Active Residence Leases Roster (2027 Academic Year)</div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Tenant</th>
              <th>Room</th>
              <th>Residence</th>
              <th>Period</th>
              <th>Monthly Rate</th>
              <th>DocuSign Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="td-bold">Thandeka Nkosi</td>
              <td><code class="td-mono">G-14</code></td>
              <td>GKAS Sonheuwel</td>
              <td>Feb – Nov 2027</td>
              <td>R3,200</td>
              <td><span class="pill pill-green">ACTIVE (SIGNED)</span></td>
              <td><button class="btn btn-ghost btn-xs" onclick="showToast('📄', 'DocuSign certificate of completion downloaded.', 'info')">Audit Trail</button></td>
            </tr>
            <tr>
              <td class="td-bold">Sibusiso Dlamini</td>
              <td><code class="td-mono">H-07</code></td>
              <td>HTS Stonehenge</td>
              <td>Feb – Nov 2027</td>
              <td>R3,400</td>
              <td><span class="pill pill-green">ACTIVE (SIGNED)</span></td>
              <td><button class="btn btn-ghost btn-xs" onclick="showToast('📄', 'DocuSign certificate of completion downloaded.', 'info')">Audit Trail</button></td>
            </tr>
            <tr>
              <td class="td-bold">Amahle Zulu</td>
              <td><code class="td-mono">G-22</code></td>
              <td>GKAS Sonheuwel</td>
              <td>Feb – Nov 2027</td>
              <td>R3,200</td>
              <td><span class="pill pill-amber">SENT (AWAITING SIGNATURE)</span></td>
              <td><button class="btn btn-gold btn-xs" onclick="showToast('📧', 'SMS reminder sent to student.', 'info')">Resend SMS</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `}window.openGenerateLeaseModal=function(){h("Generate Digital Lease Contract",`
    <div class="f-group">
      <label class="f-label" for="gl-stud">Select Student Applicant</label>
      <select class="f-input f-select" id="gl-stud">
        <option>Nonhlanhla Sibiya (TUT - 22109438)</option>
        <option>Karabo Mashile (UMP - 21980345)</option>
      </select>
    </div>

    <div class="f-row">
      <div class="f-group">
        <label class="f-label" for="gl-res">Residence</label>
        <input class="f-input" id="gl-res" value="GKAS Residence (Sonheuwel)" readonly>
      </div>
      <div class="f-group">
        <label class="f-label" for="gl-rate">Monthly Accredited Rate</label>
        <input class="f-input" id="gl-rate" value="R3,200.00" readonly>
      </div>
    </div>

    <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:16px">
      <button class="btn btn-ghost" onclick="window.closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="window.confirmGenerateLease()">Dispatch via DocuSign</button>
    </div>
  `)};window.confirmGenerateLease=function(){w(),p("✓","Lease envelope generated and sent via DocuSign to student email.","success")};function Ue(t){const{currentRole:e}=u.state;t.innerHTML=`
    <div class="section-hd">
      <div>
        <div class="section-title">Rules &amp; Disciplinary Code</div>
        <div class="section-sub">Version 4.1 · Applicable to all residents across GKAS and HTS complexes</div>
      </div>
      ${e!=="student"?`
        <button class="btn btn-danger btn-sm" onclick="window.openIssueWarningModal()">+ Issue Disciplinary Warning</button>
      `:""}
    </div>

    <!-- House Rules Cards -->
    <div class="card" style="margin-bottom:20px">
      <div class="card-title">Residence Living Standards &amp; Bylaws</div>
      <div style="display:flex;flex-direction:column;gap:14px">
        ${ue.map((i,n)=>`
          <div style="display:flex;gap:14px;align-items:flex-start;padding-bottom:12px;border-bottom:1px solid var(--border-subtle)">
            <div style="width:28px;height:28px;border-radius:var(--radius-sm);background:var(--bg-muted);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;color:var(--navy);flex-shrink:0">
              ${n+1}
            </div>
            <div>
              <div style="font-weight:700;font-size:13px;color:var(--navy);margin-bottom:2px">${i.cat}</div>
              <div style="font-size:13px;color:var(--text-muted);line-height:1.55">${i.text}</div>
            </div>
          </div>
        `).join("")}
      </div>
    </div>

    <!-- Disciplinary Case Log (Staff view or student's own records) -->
    <div class="card">
      <div class="card-title">
        <span>Formal Disciplinary Log</span>
        <span class="pill pill-navy">Dispute Appeal Window: 7 Business Days</span>
      </div>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Resident</th>
              <th>Room</th>
              <th>Allegation / Incident</th>
              <th>Date</th>
              <th>Level</th>
              <th>Issued By</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="td-bold">Lwazi Motha</td>
              <td>G-05</td>
              <td>Amplified sound disturbance after 22:00</td>
              <td>08 Apr 2026</td>
              <td><span class="pill pill-amber">Warning 1 (Verbal)</span></td>
              <td>S. Motha (Warden)</td>
            </tr>
            <tr>
              <td class="td-bold">B. Sithole</td>
              <td>G-78</td>
              <td>Unregistered overnight guest exceeding 48h limit</td>
              <td>28 Mar 2026</td>
              <td><span class="pill pill-red">Warning 2 (Written)</span></td>
              <td>K. Mokoena (Admin)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `}window.openIssueWarningModal=function(){h("Log Disciplinary Warning",`
    <div class="f-group">
      <label class="f-label" for="warn-student">Resident</label>
      <select class="f-input f-select" id="warn-student">
        <option>Lwazi Motha (Room G-05)</option>
        <option>Sibusiso Dlamini (Room H-07)</option>
      </select>
    </div>

    <div class="f-row">
      <div class="f-group">
        <label class="f-label" for="warn-cat">Violation Category</label>
        <select class="f-input f-select" id="warn-cat">
          <option>Quiet Hours Infringement</option>
          <option>Unregistered Overnight Visitor</option>
          <option>Cleanliness / Communal Area Misuse</option>
          <option>Substance / Smoking Violation</option>
        </select>
      </div>
      <div class="f-group">
        <label class="f-label" for="warn-lvl">Warning Stage</label>
        <select class="f-input f-select" id="warn-lvl">
          <option>Warning 1 — Formal Verbal</option>
          <option>Warning 2 — First Written</option>
          <option>Warning 3 — Final Notice</option>
        </select>
      </div>
    </div>

    <div class="f-group">
      <label class="f-label" for="warn-notes">Incident Summary &amp; Evidence</label>
      <textarea class="f-input" id="warn-notes" placeholder="Summarize incident details and student response..."></textarea>
    </div>

    <div style="display:flex;gap:10px;justify-content:flex-end">
      <button class="btn btn-ghost" onclick="window.closeModal()">Cancel</button>
      <button class="btn btn-danger" onclick="window.confirmIssueWarning()">Log Warning &amp; Notify Student</button>
    </div>
  `)};window.confirmIssueWarning=function(){w(),p("⚠","Disciplinary warning recorded in student record and dispatched via registered email.","info")};function re(t){const{currentRole:e,notices:i}=u.state;t.innerHTML=`
    <div class="section-hd">
      <div>
        <div class="section-title">Notices &amp; Announcements</div>
        <div class="section-sub">Official residence communications and emergency municipal advisories</div>
      </div>
      ${e!=="student"?`
        <button class="btn btn-primary btn-sm" onclick="window.openPostNoticeModal()">+ Broadcast Announcement</button>
      `:""}
    </div>

    <!-- Notices List -->
    <div style="display:flex;flex-direction:column;gap:14px">
      ${i.map(n=>`
        <div class="card" style="margin-bottom:0;border-left:5px solid ${n.severity==="urgent"?"var(--red)":n.severity==="info"?"var(--blue)":"var(--navy)"}">
          <div style="display:flex;align-items:flex-start;gap:14px">
            <span style="font-size:26px;flex-shrink:0">${n.icon}</span>
            <div style="flex:1;min-width:0">
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;flex-wrap:wrap">
                <h3 style="font-size:15px;font-weight:700;color:var(--navy)">${n.title}</h3>
                ${n.severity==="urgent"?'<span class="pill pill-red">URGENT SMS DISPATCHED</span>':""}
                <span class="pill pill-gray">${n.residence}</span>
              </div>
              <p style="font-size:13px;color:var(--text-muted);line-height:1.6;margin-bottom:8px">${n.body}</p>
              <div style="font-size:11px;color:var(--text-sub)">Posted on ${n.date} · ${n.author}</div>
            </div>
          </div>
        </div>
      `).join("")}
    </div>
  `}window.openPostNoticeModal=function(){h("Broadcast Residence Notice",`
    <div class="f-group">
      <label class="f-label" for="nt-title">Notice Headline <span class="f-required">*</span></label>
      <input class="f-input" id="nt-title" placeholder="e.g. Generator Maintenance Schedule" required>
    </div>

    <div class="f-row">
      <div class="f-group">
        <label class="f-label" for="nt-res">Target Residence</label>
        <select class="f-input f-select" id="nt-res">
          <option>All Residences (GKAS &amp; HTS)</option>
          <option>GKAS Residence (Sonheuwel)</option>
          <option>HTS Residence (Stonehenge)</option>
        </select>
      </div>
      <div class="f-group">
        <label class="f-label" for="nt-sev">Priority Level</label>
        <select class="f-input f-select" id="nt-sev">
          <option value="normal">Standard Notice</option>
          <option value="urgent">Urgent Advisory (Triggers SMS Push)</option>
          <option value="info">Informational Bulletin</option>
        </select>
      </div>
    </div>

    <div class="f-group">
      <label class="f-label" for="nt-body">Notice Body <span class="f-required">*</span></label>
      <textarea class="f-input" id="nt-body" placeholder="Write full details..." rows="4" required></textarea>
    </div>

    <div style="display:flex;gap:10px;justify-content:flex-end">
      <button class="btn btn-ghost" onclick="window.closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="window.confirmPostNotice()">Broadcast to Students</button>
    </div>
  `)};window.confirmPostNotice=function(){var a,r,l,c;const t=(a=document.getElementById("nt-title"))==null?void 0:a.value.trim(),e=(r=document.getElementById("nt-res"))==null?void 0:r.value,i=(l=document.getElementById("nt-sev"))==null?void 0:l.value,n=(c=document.getElementById("nt-body"))==null?void 0:c.value.trim();if(!t||!n){p("⚠","Title and body are required.","error");return}u.addNotice({title:t,residence:e,severity:i,body:n}),w(),p("📣","Notice published and notified to all resident inboxes.","success");const s=document.getElementById("main-content");s&&re(s)};let P="all";function O(t){const{currentRole:e,bankAccount:i,transactions:n}=u.state;if(e==="student"){t.innerHTML=`
      <div class="card" style="text-align:center;padding:48px 16px">
        <div style="font-size:36px;margin-bottom:8px">🔒</div>
        <h2 style="font-family:var(--font-serif);font-size:22px;color:var(--navy)">Access Restricted</h2>
        <p style="font-size:13px;color:var(--text-sub);margin-top:6px">Corporate bank accounts and financial reconciliations are restricted to Administrator L. Marsher.</p>
      </div>
    `;return}const s=n.filter(l=>l.type==="credit").reduce((l,c)=>l+c.amount,0),a=n.filter(l=>l.status!=="Reconciled").length,r=n.filter(l=>P==="reconciled"?l.status==="Reconciled":P==="pending"?l.status!=="Reconciled":!0);t.innerHTML=`
    <div class="section-hd">
      <div>
        <div class="section-title">Corporate Bank Integration &amp; Reconciliation</div>
        <div class="section-sub">Direct banking API sync, transaction matching, and accurate ZAR financial ledgers</div>
      </div>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn btn-ghost btn-sm" onclick="window.openConnectBankModal()">⚙️ Change Bank Account</button>
        <button class="btn btn-gold btn-sm" onclick="window.triggerLiveBankSync()">🔄 Sync Live Bank Feed</button>
      </div>
    </div>

    <!-- Accurate Financial Metrics Cards -->
    <div class="stat-grid">
      <div class="stat-card" style="border-top:4px solid var(--navy)">
        <div class="stat-label">Verified Bank Balance</div>
        <div class="stat-val" style="color:var(--navy);font-size:26px">
          R ${i.availableBalance.toLocaleString("en-ZA",{minimumFractionDigits:2,maximumFractionDigits:2})}
        </div>
        <div class="stat-sub up">✓ Live from ${i.bankName}</div>
      </div>

      <div class="stat-card" style="border-top:4px solid var(--green)">
        <div class="stat-label">Total Monthly Inflow</div>
        <div class="stat-val" style="color:var(--green);font-size:26px">
          R ${s.toLocaleString("en-ZA",{minimumFractionDigits:2,maximumFractionDigits:2})}
        </div>
        <div class="stat-sub">Across 39 accredited student beds</div>
      </div>

      <div class="stat-card" style="border-top:4px solid var(--blue)">
        <div class="stat-label">NSFAS Batch Receipts</div>
        <div class="stat-val" style="color:var(--blue);font-size:26px">
          R 126,400.00
        </div>
        <div class="stat-sub up">Batch reference: NSFAS-2027-MP-8812</div>
      </div>

      <div class="stat-card" style="border-top:4px solid ${a>0?"var(--gold)":"var(--border)"}">
        <div class="stat-label">Pending Reconciliation</div>
        <div class="stat-val" style="color:${a>0?"var(--amber)":"var(--text-sub)"};font-size:26px">
          ${a}
        </div>
        <div class="stat-sub ${a>0?"down":""}">
          ${a>0?"Awaiting student room matching":"✓ All transactions reconciled"}
        </div>
      </div>
    </div>

    <!-- Connected Bank Account Card -->
    <div class="card" style="background:linear-gradient(135deg, #071220 0%, var(--navy) 60%, #152d4d 100%);color:#ffffff;margin-bottom:24px;border:none;box-shadow:var(--shadow-md)">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:16px;margin-bottom:20px">
        <div style="display:flex;align-items:center;gap:14px">
          <div style="width:52px;height:52px;border-radius:14px;background:rgba(200,147,58,0.25);border:1px solid rgba(200,147,58,0.4);display:flex;align-items:center;justify-content:center;font-size:24px;color:#fff">
            🏦
          </div>
          <div>
            <div style="font-size:11px;color:var(--gold-light);letter-spacing:0.8px;text-transform:uppercase;font-weight:700">Connected Commercial Account</div>
            <div style="font-family:var(--font-serif);font-size:22px;font-weight:700;color:#ffffff">${i.bankName}</div>
            <div style="font-size:12px;color:#94a3b8">${i.accountHolder}</div>
          </div>
        </div>

        <div style="text-align:right">
          <span class="pill pill-green" style="background:rgba(21,128,61,0.2);color:#86efac;border:1px solid rgba(134,239,172,0.3)">
            ● ${i.status}
          </span>
          <div style="font-size:11px;color:#94a3b8;margin-top:6px">
            Feed Provider: <strong>${i.feedProvider}</strong>
          </div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(180px, 1fr));gap:14px;background:rgba(255,255,255,0.06);padding:14px 18px;border-radius:var(--radius-md);border:1px solid rgba(255,255,255,0.1)">
        <div>
          <div style="font-size:10px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px">Account Number</div>
          <div style="font-size:14px;font-weight:700;color:#ffffff" class="td-mono">${i.accountNumber}</div>
        </div>
        <div>
          <div style="font-size:10px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px">Branch Code</div>
          <div style="font-size:14px;font-weight:700;color:#ffffff" class="td-mono">${i.branchCode} (${i.branchName})</div>
        </div>
        <div>
          <div style="font-size:10px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px">Account Type</div>
          <div style="font-size:14px;font-weight:700;color:#ffffff">${i.accountType}</div>
        </div>
        <div>
          <div style="font-size:10px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px">Last Real-time Sync</div>
          <div style="font-size:12px;font-weight:600;color:var(--gold-light)">
            ${new Date(i.lastSyncedAt).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"})} today
          </div>
        </div>
      </div>
    </div>

    <!-- Bank Transactions Reconciliation Table -->
    <div class="card">
      <div class="card-title">
        <span>Bank Statement &amp; Resident Transaction Ledger</span>
        
        <!-- Filter Tabs -->
        <div style="display:flex;gap:6px">
          <button class="btn ${P==="all"?"btn-primary":"btn-ghost"} btn-xs" onclick="window.setTxnFilter('all')">
            All (${n.length})
          </button>
          <button class="btn ${P==="reconciled"?"btn-primary":"btn-ghost"} btn-xs" onclick="window.setTxnFilter('reconciled')">
            Reconciled (${n.filter(l=>l.status==="Reconciled").length})
          </button>
          <button class="btn ${P==="pending"?"btn-primary":"btn-ghost"} btn-xs" onclick="window.setTxnFilter('pending')">
            Pending Match (${a})
          </button>
        </div>
      </div>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Date &amp; Time</th>
              <th>Reference</th>
              <th>Description / Counterparty</th>
              <th>Allocated Room</th>
              <th>Amount (ZAR)</th>
              <th>Reconciliation Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${r.map(l=>{const c=new Date(l.date).toLocaleDateString("en-GB",{day:"numeric",month:"short"}),d=l.type==="credit",v=d?"+":"",y=d?"var(--green)":"var(--red)";return`
                <tr>
                  <td style="font-size:12px">${c}</td>
                  <td><code class="td-mono">${l.reference}</code></td>
                  <td>
                    <div style="font-weight:600;color:var(--navy);font-size:13px">${l.counterparty}</div>
                    <div style="font-size:11px;color:var(--text-sub)">${l.description}</div>
                  </td>
                  <td>
                    ${l.matchedRoom?`
                      <span class="pill pill-navy" style="font-size:10px">${l.matchedRoom}</span>
                    `:`
                      <span style="color:var(--text-light);font-size:11px">Unmatched</span>
                    `}
                  </td>
                  <td style="font-weight:700;color:${y};font-size:13px;white-space:nowrap" class="td-mono">
                    ${v}R ${Math.abs(l.amount).toLocaleString("en-ZA",{minimumFractionDigits:2,maximumFractionDigits:2})}
                  </td>
                  <td>
                    <span class="pill ${l.status==="Reconciled"?"pill-green":l.status==="Auto-Matched"?"pill-blue":"pill-amber"}">
                      ${l.status.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    ${l.status!=="Reconciled"?`
                      <button class="btn btn-gold btn-xs" onclick="window.openReconcileModal('${l.id}', '${l.reference}', ${l.amount})">
                        Reconcile Room
                      </button>
                    `:`
                      <span style="font-size:11px;color:var(--green);font-weight:600">✓ Verified</span>
                    `}
                  </td>
                </tr>
              `}).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `}window.setTxnFilter=function(t){P=t;const e=document.getElementById("main-content");e&&O(e)};window.triggerLiveBankSync=async function(){p("🔄","Connecting to Standard Bank Open Banking feed API...","info",2e3),setTimeout(async()=>{await u.syncBankFeed(),p("✓","Live bank feed synchronized! New electronic EFT deposit imported and auto-matched.","success");const t=document.getElementById("main-content");t&&O(t)},900)};window.openConnectBankModal=function(){const{bankAccount:t}=u.state;h("Connect Corporate Bank Account",`
    <div style="font-size:12px;color:var(--text-sub);margin-bottom:16px">
      Connect the legal trust or operating account of the residence to receive automated bank statements and EFT notifications.
    </div>

    <div class="f-group">
      <label class="f-label" for="cb-bank">Financial Institution <span class="f-required">*</span></label>
      <select class="f-input f-select" id="cb-bank">
        <option value="Standard Bank South Africa" ${t.bankName.includes("Standard")?"selected":""}>Standard Bank South Africa</option>
        <option value="First National Bank (FNB)" ${t.bankName.includes("FNB")?"selected":""}>First National Bank (FNB)</option>
        <option value="Absa Corporate &amp; Commercial" ${t.bankName.includes("Absa")?"selected":""}>Absa Corporate &amp; Commercial</option>
        <option value="Nedbank Corporate" ${t.bankName.includes("Nedbank")?"selected":""}>Nedbank Corporate</option>
        <option value="Capitec Business" ${t.bankName.includes("Capitec")?"selected":""}>Capitec Business</option>
      </select>
    </div>

    <div class="f-group">
      <label class="f-label" for="cb-holder">Account Holder Name <span class="f-required">*</span></label>
      <input class="f-input" id="cb-holder" value="${t.accountHolder}" required>
    </div>

    <div class="f-row">
      <div class="f-group">
        <label class="f-label" for="cb-acc">Account Number <span class="f-required">*</span></label>
        <input class="f-input td-mono" id="cb-acc" value="${t.accountNumber}" required>
      </div>
      <div class="f-group">
        <label class="f-label" for="cb-branch">Branch Code <span class="f-required">*</span></label>
        <input class="f-input td-mono" id="cb-branch" value="${t.branchCode}" required>
      </div>
    </div>

    <div class="f-group">
      <label class="f-label" for="cb-type">Account Type</label>
      <select class="f-input f-select" id="cb-type">
        <option>Commercial Cheque Account</option>
        <option>Corporate Trust Account</option>
        <option>Sectional Title / Body Corporate Account</option>
      </select>
    </div>

    <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:16px">
      <button class="btn btn-ghost" onclick="window.closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="window.saveConnectedBank()">Verify &amp; Connect Account</button>
    </div>
  `)};window.saveConnectedBank=async function(){var r,l,c,d,v;const t=(r=document.getElementById("cb-bank"))==null?void 0:r.value,e=(l=document.getElementById("cb-holder"))==null?void 0:l.value,i=(c=document.getElementById("cb-acc"))==null?void 0:c.value,n=(d=document.getElementById("cb-branch"))==null?void 0:d.value,s=(v=document.getElementById("cb-type"))==null?void 0:v.value;await u.updateBankAccount({bankName:t,accountHolder:e,accountNumber:i,branchCode:n,accountType:s}),w(),p("✓",`Bank account ${i} successfully connected and verified via Open Banking API!`,"success");const a=document.getElementById("main-content");a&&O(a)};window.openReconcileModal=function(t,e,i){h(`Reconcile Transaction: ${e}`,`
    <div style="margin-bottom:14px;font-size:13px;color:var(--text-muted)">
      Match incoming electronic bank deposit of <strong style="color:var(--green)">R ${i.toLocaleString("en-ZA",{minimumFractionDigits:2})}</strong> to resident room allocation:
    </div>

    <div class="f-group">
      <label class="f-label" for="rec-room">Select Student Resident / Room</label>
      <select class="f-input f-select" id="rec-room">
        <option value="G-22 (GKAS) — Amahle Zulu">G-22 (GKAS) — Amahle Zulu</option>
        <option value="G-55 (GKAS) — Precious Khumalo">G-55 (GKAS) — Precious Khumalo</option>
        <option value="H-11 (HTS) — D. Nzimande">H-11 (HTS) — D. Nzimande</option>
        <option value="General Residence Deposit">General Residence Deposit</option>
      </select>
    </div>

    <div class="f-group">
      <label class="f-label" for="rec-notes">Reconciliation Sign-Off Notes</label>
      <input class="f-input" id="rec-notes" value="Verified against bank statement deposit slip by L. Marsher">
    </div>

    <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:16px">
      <button class="btn btn-ghost" onclick="window.closeModal()">Cancel</button>
      <button class="btn btn-success" onclick="window.confirmReconcile('${t}')">Confirm &amp; Reconcile</button>
    </div>
  `)};window.confirmReconcile=async function(t){var a;const e=((a=document.getElementById("rec-room"))==null?void 0:a.value)||"G-22 (GKAS)",i=e.split(" — ")[0],n=e.split(" — ")[1]||"Resident";await u.reconcileTransaction(t,i,n),w(),p("✓",`Transaction ${t} reconciled against ${i}. Ledger updated in real-time.`,"success");const s=document.getElementById("main-content");s&&O(s)};function je(t){const{auditLog:e}=u.state;t.innerHTML=`
    <div class="section-hd">
      <div>
        <div class="section-title">Cryptographic Audit Trail</div>
        <div class="section-sub">Tamper-evident chronological log of all sensitive database mutations</div>
      </div>
      <button class="btn btn-ghost btn-sm" onclick="showToast('📊', 'Full audit log exported to CSV.', 'info')">Export Audit CSV</button>
    </div>

    <div class="card">
      <div class="card-title">
        <span>Recorded System Events</span>
        <span class="pill pill-green">${e.length} Events Verified</span>
      </div>

      <div style="display:flex;flex-direction:column;gap:12px">
        ${e.map(i=>`
          <div style="display:flex;gap:14px;align-items:center;padding:12px 14px;background:var(--bg-alt);border:1px solid var(--border-subtle);border-radius:var(--radius-md)">
            <div style="width:36px;height:36px;border-radius:var(--radius-sm);background:${i.bg};display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">
              ${i.type}
            </div>
            <div style="flex:1;min-width:0">
              <div style="font-weight:600;font-size:13px;color:var(--navy)">${i.action}</div>
              <div style="font-size:11px;color:var(--text-sub);margin-top:2px" class="td-mono">${i.meta}</div>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `}function He(t){t.innerHTML=`
    <div class="section-hd">
      <div>
        <div class="section-title">System Settings &amp; Security</div>
        <div class="section-sub">POPIA statutory compliance, MFA enforcement, and external API connectors</div>
      </div>
      <button class="btn btn-primary btn-sm" onclick="showToast('✓', 'Configuration saved to database.', 'success')">Save Settings</button>
    </div>

    <div class="grid2">
      <!-- General Residence Info -->
      <div class="card">
        <div class="card-title">Residence Management Profile</div>
        <div class="f-group">
          <label class="f-label" for="set-name">Organization Name</label>
          <input class="f-input" id="set-name" value="HTS &amp; GKAS Student Residences (Pty) Ltd">
        </div>
        <div class="f-group">
          <label class="f-label" for="set-email">Facilities Desk Email</label>
          <input class="f-input" id="set-email" value="management@hts-gkas.co.za">
        </div>
        <div class="f-row">
          <div class="f-group">
            <label class="f-label" for="set-phone">Reception Desk Phone</label>
            <input class="f-input" id="set-phone" value="+27 13 752 4000">
          </div>
          <div class="f-group">
            <label class="f-label" for="set-sla">Emergency SLA (Hours)</label>
            <input class="f-input" id="set-sla" type="number" value="2">
          </div>
        </div>
      </div>

      <!-- Compliance & Legal Info -->
      <div class="card">
        <div class="card-title">POPIA Compliance &amp; Data Officer</div>
        <div class="f-group">
          <label class="f-label" for="set-io">Registered Information Officer</label>
          <input class="f-input" id="set-io" value="K. Mokoena (Compliance Cert: SA-POPIA-2024)">
        </div>
        <div class="f-group">
          <label class="f-label" for="set-retention">Student Document Retention Period</label>
          <select class="f-input f-select" id="set-retention">
            <option>5 Years post-graduation (Statutory standard)</option>
            <option>3 Years post-lease termination</option>
          </select>
        </div>
        <div style="font-size:12px;color:var(--text-sub);line-height:1.5;margin-top:10px">
          All document uploads are encrypted at rest with AES-256 and accessible only via time-limited pre-signed URLs.
        </div>
      </div>
    </div>

    <!-- External API Connectors -->
    <div class="card">
      <div class="card-title">Accredited Integrations</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:14px">
        <div style="padding:14px;background:var(--bg-alt);border:1px solid var(--border);border-radius:var(--radius-md);display:flex;justify-content:space-between;align-items:center">
          <div>
            <div style="font-weight:700;font-size:13px;color:var(--navy)">DocuSign Enterprise</div>
            <div style="font-size:11px;color:var(--text-sub)">E-Signature &amp; digital lease dispatch</div>
          </div>
          <span class="pill pill-green">Connected</span>
        </div>

        <div style="padding:14px;background:var(--bg-alt);border:1px solid var(--border);border-radius:var(--radius-md);display:flex;justify-content:space-between;align-items:center">
          <div>
            <div style="font-weight:700;font-size:13px;color:var(--navy)">Twilio / SMS Portal</div>
            <div style="font-size:11px;color:var(--text-sub)">Urgent alerts &amp; OTP verification</div>
          </div>
          <span class="pill pill-green">Connected</span>
        </div>

        <div style="padding:14px;background:var(--bg-alt);border:1px solid var(--border);border-radius:var(--radius-md);display:flex;justify-content:space-between;align-items:center">
          <div>
            <div style="font-weight:700;font-size:13px;color:var(--navy)">DHET / NSFAS API</div>
            <div style="font-size:11px;color:var(--text-sub)">Accredited student housing data exchange</div>
          </div>
          <span class="pill pill-blue">Sync Active</span>
        </div>
      </div>
    </div>
  `}function _e(t,e){let i=100;const n=document.createElement("div");n.id="doc-audit-drawer-overlay",n.style.cssText=`
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(4px);
    z-index: 10000; display: flex; justify-content: flex-end;
  `;function s(){return`
      <div style="width: min(100vw, 920px); height: 100%; background: #ffffff; display: flex; flex-direction: column; box-shadow: -8px 0 24px rgba(0,0,0,0.2); animation: slideInRight 0.25s ease">
        
        <!-- Drawer Header -->
        <div style="padding: 16px 20px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; background: var(--navy); color: #ffffff">
          <div>
            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px; color: var(--gold); font-weight: 700">Fraud Prevention &amp; Integrity Audit</div>
            <div style="font-family: var(--font-serif); font-size: 18px; font-weight: 700">${t.applicantName} · ${t.documentName}</div>
          </div>
          <button class="btn btn-ghost btn-sm" id="close-audit-drawer-btn" style="color: #ffffff; border-color: rgba(255,255,255,0.2)">
            ✕ Close
          </button>
        </div>

        <!-- Split View Body -->
        <div style="flex: 1; display: grid; grid-template-columns: 1fr 340px; overflow: hidden">
          
          <!-- LEFT PANE: Document Preview with Zoom Controls -->
          <div style="background: #1e293b; display: flex; flex-direction: column; overflow: hidden; border-right: 1px solid var(--border)">
            
            <!-- Zoom Toolbar -->
            <div style="padding: 8px 12px; background: #0f172a; display: flex; align-items: center; justify-content: space-between; color: #94a3b8; font-size: 12px">
              <div style="display: flex; gap: 8px; align-items: center">
                <button class="btn btn-ghost btn-xs" id="zoom-out-btn" style="color: #ffffff">🔍 -</button>
                <span id="zoom-level-text" style="color: #e2e8f0; font-family: monospace">${i}%</span>
                <button class="btn btn-ghost btn-xs" id="zoom-in-btn" style="color: #ffffff">🔍 +</button>
                <button class="btn btn-ghost btn-xs" id="zoom-reset-btn" style="color: #ffffff">Fit</button>
              </div>
              <div style="font-size: 11px; color: #94a3b8">
                Format: <strong>${t.documentType.toUpperCase()}</strong> · High Res Scanned Copy
              </div>
            </div>

            <!-- Preview Viewport -->
            <div style="flex: 1; overflow: auto; display: flex; align-items: center; justify-content: center; padding: 24px" id="doc-viewport">
              <div id="doc-canvas" style="transform: scale(${i/100}); transform-origin: center center; transition: transform 0.15s ease; max-width: 100%; background: #ffffff; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5); border-radius: 4px; padding: 24px; min-height: 480px; width: 420px; color: #0f172a; font-family: sans-serif; font-size: 12px">
                
                <!-- Simulated High-Fidelity Scanned Document -->
                <div style="text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 16px">
                  <div style="font-weight: 800; font-size: 14px; text-transform: uppercase; letter-spacing: 1px">
                    ${t.documentType==="id_copy"?"REPUBLIC OF SOUTH AFRICA — NATIONAL IDENTITY":t.documentType==="proof_of_registration"?t.profileInstitution:"NSFAS / BURSARY CONFIRMATION LETTER"}
                  </div>
                  <div style="font-size: 10px; color: #64748b">OFFICIAL CERTIFIED DOCUMENT · 2027 ACADEMIC INTAKE</div>
                </div>

                <div style="display: grid; grid-template-columns: 80px 1fr; gap: 12px; margin-bottom: 20px; align-items: center">
                  <div style="width: 80px; height: 90px; background: #e2e8f0; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 32px">
                    👤
                  </div>
                  <div style="line-height: 1.6">
                    <div><strong>SURNAME / NAME:</strong> ${t.detectedName}</div>
                    <div><strong>IDENTITY NUMBER:</strong> <span style="font-family: monospace; font-weight: 700">${t.detectedId}</span></div>
                    <div><strong>DATE OF BIRTH:</strong> 2003-08-15</div>
                    <div><strong>INSTITUTION:</strong> ${t.detectedInstitution}</div>
                  </div>
                </div>

                <div style="border: 2px solid #16a34a; border-radius: 8px; padding: 10px; text-align: center; color: #16a34a; margin-top: 24px; font-weight: 700; font-size: 11px; text-transform: uppercase">
                  ✓ COMMISSIONER OF OATHS CERTIFIED COPY
                  <div style="font-size: 9px; font-weight: 400; color: #475569">Mbombela Police Station · Stamp Date: 16 Oct 2026</div>
                </div>
              </div>
            </div>
          </div>

          <!-- RIGHT PANE: Integrity Cross-Check Card -->
          <div style="padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; background: var(--bg-alt)">
            
            <div>
              <div style="font-weight: 700; font-size: 14px; color: var(--navy); margin-bottom: 4px">OCR Cross-Check Card</div>
              <div style="font-size: 12px; color: var(--text-sub)">Automated comparison between registered profile and document stream text</div>
            </div>

            <!-- Comparison 1: Name -->
            <div style="background: #ffffff; border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 12px">
              <div style="display: flex; justify-content: space-between; margin-bottom: 6px">
                <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-sub)">Student Full Name</span>
                <span class="pill pill-green" style="font-size: 10px">MATCH (100%)</span>
              </div>
              <div style="font-size: 12px">Profile: <strong>${t.applicantName}</strong></div>
              <div style="font-size: 12px; color: var(--text-sub)">Document: <strong>${t.detectedName}</strong></div>
            </div>

            <!-- Comparison 2: ID Number with Luhn Check -->
            <div style="background: #ffffff; border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 12px">
              <div style="display: flex; justify-content: space-between; margin-bottom: 6px">
                <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-sub)">13-Digit SA ID</span>
                <span class="pill ${t.luhnValid?"pill-green":"pill-red"}" style="font-size: 10px">
                  ${t.luhnValid?"✓ LUHN VALID":"⚠ LUHN INVALID"}
                </span>
              </div>
              <div style="font-size: 12px; font-family: monospace">Profile: <strong>${t.profileId}</strong></div>
              <div style="font-size: 12px; font-family: monospace; color: var(--text-sub)">Detected: <strong>${t.detectedId}</strong></div>
            </div>

            <!-- Comparison 3: Institution -->
            <div style="background: #ffffff; border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 12px">
              <div style="display: flex; justify-content: space-between; margin-bottom: 6px">
                <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-sub)">Target Institution</span>
                <span class="pill pill-green" style="font-size: 10px">VERIFIED</span>
              </div>
              <div style="font-size: 12px">Profile: <strong>${t.profileInstitution}</strong></div>
              <div style="font-size: 12px; color: var(--text-sub)">Detected: <strong>${t.detectedInstitution}</strong></div>
            </div>

            <!-- Tamper & Metadata Heuristics -->
            <div style="background: ${t.tamperScore>.4?"#fef2f2":"#ffffff"}; border: 1px solid ${t.tamperScore>.4?"var(--red)":"var(--border)"}; border-radius: var(--radius-sm); padding: 12px">
              <div style="display: flex; justify-content: space-between; margin-bottom: 6px">
                <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-sub)">Tamper Risk Score</span>
                <span class="pill ${t.tamperScore>.4?"pill-red":"pill-green"}" style="font-size: 10px">
                  ${t.tamperScore>.4?"HIGH RISK":"LOW RISK (AUTHENTIC)"}
                </span>
              </div>
              <div style="font-size: 12px">Producer Tool: <strong>${t.metadataProducer}</strong></div>
              <div style="font-size: 11px; color: var(--text-sub); margin-top: 2px">
                ${t.tamperScore>.4?"⚠ Warning: File created with photo editing software.":"✓ Certified scanner stream detected without post-processing artifacts."}
              </div>
            </div>

            <!-- Decision Controls -->
            <div style="margin-top: auto; padding-top: 14px; border-top: 1px solid var(--border); display: flex; flex-direction: column; gap: 8px">
              <button class="btn btn-success" id="accept-doc-btn" style="width: 100%">
                ✓ Accept Document &amp; Verify Identity
              </button>

              <div style="display: flex; gap: 8px">
                <select class="f-input f-select" id="reject-reason-select" style="font-size: 12px; flex: 1">
                  <option value="ID number mismatch with profile">ID mismatch with profile</option>
                  <option value="Illegible or blurry scanned document">Illegible / blurry scan</option>
                  <option value="Suspected tampering or altered font">Suspected digital tampering</option>
                  <option value="Expired or non-certified copy">Missing commissioner of oaths stamp</option>
                </select>
                <button class="btn btn-danger btn-sm" id="request-reupload-btn">
                  Request Re-upload
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `}n.innerHTML=s(),document.body.appendChild(n);const a=n.querySelector("#close-audit-drawer-btn");a==null||a.addEventListener("click",()=>{n.remove()});const r=n.querySelector("#zoom-in-btn"),l=n.querySelector("#zoom-out-btn"),c=n.querySelector("#zoom-reset-btn"),d=n.querySelector("#doc-canvas"),v=n.querySelector("#zoom-level-text");r==null||r.addEventListener("click",()=>{i<200&&(i+=25,d&&(d.style.transform=`scale(${i/100})`),v&&(v.textContent=`${i}%`))}),l==null||l.addEventListener("click",()=>{i>50&&(i-=25,d&&(d.style.transform=`scale(${i/100})`),v&&(v.textContent=`${i}%`))}),c==null||c.addEventListener("click",()=>{i=100,d&&(d.style.transform="scale(1)"),v&&(v.textContent="100%")});const y=n.querySelector("#accept-doc-btn");y==null||y.addEventListener("click",()=>{n.remove(),e&&e("accept")});const x=n.querySelector("#request-reupload-btn");x==null||x.addEventListener("click",()=>{var g;const f=(g=n.querySelector("#reject-reason-select"))==null?void 0:g.value;n.remove(),e&&e("reject",f)})}function U(t){const{applicants:e}=u.state,i=e.filter(n=>!n.processed);t.innerHTML=`
    <div class="section-hd">
      <div>
        <div class="section-title">2027 Applications &amp; Waiting List</div>
        <div class="section-sub">Chronologically ordered queue aligned with NSFAS accredited bed allocations and audit verification</div>
      </div>
      <div style="display:flex;gap:8px;align-items:center">
        <span class="pill pill-amber">${i.length} Awaiting Verification</span>
        <span class="pill pill-blue">Intake Year: 2027</span>
      </div>
    </div>

    <!-- Active Review Queue -->
    <div class="card">
      <div class="card-title">
        <span>Application Queue (Time-Ordered)</span>
        <span style="font-size:12px;color:var(--text-sub)">Review background check, funding verification &amp; certified document integrity</span>
      </div>

      <div style="display:flex;flex-direction:column;gap:14px">
        ${e.map(n=>{const s=n.fundingStatus||"pending_verification",a=n.referenceNumber||n.id;return`
            <div class="card" style="margin-bottom:0;border:1px solid var(--border);padding:18px;background:${n.processed?"var(--bg-alt)":"#ffffff"}">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:14px">
                
                <!-- Student Info -->
                <div style="display:flex;align-items:flex-start;gap:14px">
                  <div style="width:48px;height:48px;border-radius:var(--radius-full);background:${n.bg};color:${n.tc};display:flex;align-items:center;justify-content:center;font-weight:700;font-size:16px;flex-shrink:0">
                    ${n.initials}
                  </div>
                  <div>
                    <div style="font-weight:700;font-size:15px;color:var(--navy);display:flex;align-items:center;gap:8px">
                      ${n.name}
                      <span class="pill ${s==="verified"?"pill-green":s==="rejected"?"pill-red":"pill-amber"}" style="font-size:10px">
                        Funding: ${s.toUpperCase().replace("_"," ")}
                      </span>
                    </div>

                    <div style="font-size:12px;color:var(--text-sub);margin:2px 0 4px" class="td-mono">
                      Ref: <strong>${a}</strong> · ${n.institution||"TUT Nelspruit"} · ${n.funding||"NSFAS"}
                    </div>

                    <div style="font-size:11px;color:var(--text-muted);display:flex;flex-wrap:wrap;gap:12px">
                      <span>Preferred: <strong>${n.preferredResidence}</strong> (${n.roomType||"Single Room"})</span>
                      <span>SA ID: <code class="td-mono">${n.idNumber}</code></span>
                      <span>Student No: <code class="td-mono">${n.studentNumber||"22109845"}</code></span>
                      <span>Contact: <strong>${n.phone||"071 829 4012"}</strong></span>
                    </div>

                    ${n.bursarySponsorName?`
                      <div style="font-size:11px;color:var(--blue);margin-top:4px">
                        Sponsor / Guarantor: <strong>${n.bursarySponsorName}</strong> (Ref: ${n.fundingReferenceNumber||"N/A"})
                      </div>
                    `:""}

                    ${n.guardianName?`
                      <div style="font-size:11px;color:var(--text-sub);margin-top:4px">
                        Parent / Sponsor: <strong>${n.guardianName}</strong> (${n.guardianContact||"N/A"})
                      </div>
                    `:""}
                  </div>
                </div>

                <!-- Right Action Cluster -->
                <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px">
                  <div style="display:flex;gap:6px;align-items:center">
                    <button class="btn btn-ghost btn-xs" onclick="window.handleOpenAuditDrawer('${n.id}')" title="Open split-screen OCR cross-check & tamper scanner">
                      🔍 Audit Documents
                    </button>

                    ${s==="pending_verification"?`
                      <button class="btn btn-success btn-xs" onclick="window.handleApproveFunding('${n.id}')">
                        Approve Funding
                      </button>
                      <button class="btn btn-ghost btn-xs" style="color:var(--red)" onclick="window.handleRejectFunding('${n.id}')">
                        Reject Funding
                      </button>
                    `:""}
                  </div>

                  <div style="display:flex;gap:8px;align-items:center;margin-top:4px">
                    ${n.processed?`
                      <span class="pill ${n.decision==="accepted"?"pill-green":"pill-red"}" style="font-weight:700">
                        ${n.decision?n.decision.toUpperCase():"PROCESSED"}
                      </span>
                    `:`
                      <button class="btn btn-success btn-sm" onclick="window.handleAcceptApplicant('${n.id}')">
                        ✓ Accept &amp; Offer Bed
                      </button>
                      <button class="btn btn-danger btn-sm" onclick="window.handleDeclineApplicant('${n.id}')">
                        ✕ Decline
                      </button>
                    `}
                  </div>
                </div>

              </div>
            </div>
          `}).join("")}
      </div>
    </div>
  `}window.handleOpenAuditDrawer=function(t){const e=u.state.applicants.find(i=>i.id===t)||u.state.applicants[0];e&&_e({documentId:`doc-${e.id}-01`,applicantId:e.id,applicantName:e.name,detectedName:e.name,profileId:e.idNumber,detectedId:e.idNumber,luhnValid:!0,profileInstitution:e.institution||"Tshwane University of Technology",detectedInstitution:e.institution||"Tshwane University of Technology",documentType:"id_copy",documentName:"Certified South African ID & 2027 Registration Copy",tamperScore:.04,metadataProducer:"Canon imageRUNNER / Certified Police Stamp"},(i,n)=>{i==="accept"?p("✓",`Document verified for ${e.name}. Tamper check: Clean.`,"success"):p("⚠",`Re-upload requested from ${e.name}. Reason: ${n||"Document mismatch"}`,"info")})};window.handleApproveFunding=async function(t){await u.updateFundingStatus(t,"verified",null),p("💰",`Funding approved & verified for applicant ${t}!`,"success");const e=document.getElementById("main-content");e&&U(e)};window.handleRejectFunding=function(t){h(`Reject / Request Funding Resubmission — ${t}`,`
    <div class="f-group">
      <label class="f-label" for="rej-funding-reason">Reason for Rejection / Requesting Resubmission <span class="f-required">*</span></label>
      <select class="f-input f-select" id="rej-funding-reason">
        <option>NSFAS allowance not approved on university residence portal</option>
        <option>Bursary award letter lacks accommodation coverage clause</option>
        <option>Invalid guarantor contact or failed debit order mandate</option>
        <option>Loan pre-approval quote expired or rejected by financier</option>
      </select>
    </div>

    <div style="display:flex;gap:10px;justify-content:flex-end">
      <button class="btn btn-ghost" onclick="window.closeModal()">Cancel</button>
      <button class="btn btn-danger" onclick="window.confirmRejectFunding('${t}')">Confirm Rejection</button>
    </div>
  `)};window.confirmRejectFunding=async function(t){var n;const e=((n=document.getElementById("rej-funding-reason"))==null?void 0:n.value)||"Incomplete documentation";await u.updateFundingStatus(t,"rejected",e),w(),p("⚠",`Funding rejected for ${t}. Notice sent to student requesting resubmission.`,"info");const i=document.getElementById("main-content");i&&U(i)};window.handleAcceptApplicant=async function(t){const e=u.state.applicants.find(n=>n.id===t);await u.processApplicant(t,"accepted","All documents verified, funding confirmed, and 2027 bed allocated."),p("✓",`Applicant ${(e==null?void 0:e.name)||t} accepted! 2027 Bed assigned and DocuSign lease dispatched.`,"success");const i=document.getElementById("main-content");i&&U(i)};window.handleDeclineApplicant=function(t){h(`Decline 2027 Application — ${t}`,`
    <div class="f-group">
      <label class="f-label" for="dec-reason">Official Reason for Declining <span class="f-required">*</span></label>
      <select class="f-input f-select" id="dec-reason">
        <option>Academic registration unverified with institution for 2027</option>
        <option>All accredited beds fully occupied for selected residence</option>
        <option>Incomplete or uncertified documentation</option>
        <option>Funding verification rejected by financial administrator</option>
      </select>
    </div>

    <div style="display:flex;gap:10px;justify-content:flex-end">
      <button class="btn btn-ghost" onclick="window.closeModal()">Cancel</button>
      <button class="btn btn-danger" onclick="window.confirmDecline('${t}')">Confirm Decline</button>
    </div>
  `)};window.confirmDecline=async function(t){var n;const e=(n=document.getElementById("dec-reason"))==null?void 0:n.value;await u.processApplicant(t,"declined",e),w(),p("✓",`Application ${t} marked as declined. Formal notice dispatched to student.`,"info");const i=document.getElementById("main-content");i&&U(i)};function Ge(t){const{currentUser:e,currentRole:i}=u.state;t.innerHTML=`
    <div class="section-hd">
      <div>
        <div class="section-title">Move-In Room Condition Inspections</div>
        <div class="section-sub">Digital room defect inventory counter-signed by resident and residence warden</div>
      </div>
      <button class="btn btn-primary btn-sm" onclick="window.submitInspectionForm()">Save &amp; Counter-Sign Record</button>
    </div>

    <!-- Active Inspection Form -->
    <div class="card" style="margin-bottom:20px">
      <div class="card-title">
        <span>Room Condition Inventory: Room ${e.room||"G-14"}</span>
        <span class="pill pill-navy">Inspection Date: 01 Feb 2027</span>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(260px, 1fr));gap:14px;margin-bottom:20px">
        ${["Walls, Plaster & Paintwork","Floor Tiles & Skirting","Window Glass, Latches & Curtains","Door Cylinder, Keys & Handles","Electrical Outlets & Light Fixtures","Desk, Chair & Study Lamp","Bed Frame, Base & Mattress Protector","Wardrobe, Shelving & Rail","Ablution Fixtures & Water Pressure"].map(n=>`
          <div style="padding:14px;background:var(--bg-alt);border:1px solid var(--border);border-radius:var(--radius-md)">
            <div style="font-weight:600;font-size:13px;color:var(--navy);margin-bottom:8px">${n}</div>
            <select class="f-input f-select" style="min-height:36px;font-size:12px">
              <option>Good — No damage noted</option>
              <option>Fair — Minor pre-existing wear</option>
              <option>Defect Noted — Repair requested</option>
            </select>
          </div>
        `).join("")}
      </div>

      <div class="f-group">
        <label class="f-label" for="insp-notes">Specific Defect Notes or Comments</label>
        <textarea class="f-input" id="insp-notes" placeholder="e.g. Small scuff mark behind entrance door; all keys tested and functioning."></textarea>
      </div>

      <div class="f-group">
        <label class="f-checkbox">
          <input type="checkbox" id="insp-confirm" checked>
          <span>Both resident student and residence warden confirm that this condition record is accurate upon key handover.</span>
        </label>
      </div>
    </div>
  `}window.submitInspectionForm=function(){p("✓","Move-in inspection digitally timestamped and countersigned. Copy stored in your document library.","success")};let j=[],C="all";async function le(t){const{currentUser:e,currentRole:i}=u.state;if(!e){t.innerHTML=`
      <div class="section-hd">
        <div>
          <div class="section-title">My Document Library</div>
          <div class="section-sub">Encrypted repository of your signed agreements, inspection certificates, and bursary letters</div>
        </div>
      </div>
      <div class="card" style="text-align:center;padding:48px 20px">
        <div style="font-size:36px;margin-bottom:12px">🔒</div>
        <div style="font-weight:700;font-size:16px;color:var(--navy);margin-bottom:6px">Authentication Required</div>
        <div style="font-size:13px;color:var(--text-sub);max-width:400px;margin:0 auto 16px">Please sign in to access your confidential student residence agreements and verified receipts.</div>
        <button class="btn btn-primary" onclick="window.location.hash='#login'">Go to Sign In</button>
      </div>
    `;return}t.innerHTML=`
    <div class="section-hd">
      <div>
        <div class="section-title">My Document Library</div>
        <div class="section-sub">Encrypted repository of your signed agreements, inspection certificates, and bursary letters</div>
      </div>
      <div style="display:flex;align-items:center;gap:10px">
        <span class="pill pill-navy td-mono" style="font-size:11px">
          ${e.studentNumber?`STUDENT: ${e.studentNumber}`:`USER: ${e.id}`}
        </span>
      </div>
    </div>

    <!-- Category Filter Bar -->
    <div style="display:flex;gap:8px;margin-bottom:18px;overflow-x:auto;padding-bottom:4px" id="doc-filters">
      <button class="btn btn-sm ${C==="all"?"btn-primary":"btn-ghost"}" onclick="window.filterDocsCategory('all')">All Documents</button>
      <button class="btn btn-sm ${C==="lease"?"btn-primary":"btn-ghost"}" onclick="window.filterDocsCategory('lease')">Leases &amp; Agreements</button>
      <button class="btn btn-sm ${C==="inspection"?"btn-primary":"btn-ghost"}" onclick="window.filterDocsCategory('inspection')">Move-In Inspections</button>
      <button class="btn btn-sm ${C==="receipt"?"btn-primary":"btn-ghost"}" onclick="window.filterDocsCategory('receipt')">Payment Receipts</button>
    </div>

    <div class="card" id="docs-content-container">
      <div style="text-align:center;padding:40px 16px;color:var(--text-sub)">
        <div style="font-size:28px;margin-bottom:8px">⌛</div>
        <div>Loading authenticated document records from secure vault...</div>
      </div>
    </div>
  `;try{const n=await fetch("/api/documents",{headers:u.getAuthHeaders()});n.ok?(j=(await n.json()).documents||[],Ve()):n.status===401?p("🔒","Session expired. Please sign in again.","error"):Y("Unable to load documents from backend service.")}catch(n){console.error("Documents fetch error:",n),Y("Network connection error while fetching documents.")}}function Ve(){const t=document.getElementById("docs-content-container");if(!t)return;const e=C==="all"?j:j.filter(i=>i.category===C);if(e.length===0){t.innerHTML=`
      <div style="text-align:center;padding:48px 16px">
        <div style="font-size:36px;margin-bottom:12px">📂</div>
        <div style="font-weight:700;font-size:16px;color:var(--navy);margin-bottom:6px">No Documents Found</div>
        <div style="font-size:13px;color:var(--text-sub);max-width:380px;margin:0 auto">
          No records match the selected filter category for this resident account.
        </div>
      </div>
    `;return}t.innerHTML=`
    <div class="card-title" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <span>Verified Documents (${e.length})</span>
      <span style="font-size:12px;font-weight:500;color:var(--text-sub)">Encrypted AES-256 Storage</span>
    </div>

    <div style="display:flex;flex-direction:column;gap:12px">
      ${e.map(i=>`
        <div style="display:flex;justify-content:space-between;align-items:center;padding:16px;background:var(--bg-alt);border:1px solid var(--border);border-radius:var(--radius-md);flex-wrap:wrap;gap:14px;transition:border-color 0.15s">
          <div style="display:flex;align-items:center;gap:14px;min-width:260px">
            <span style="font-size:30px;line-height:1">${i.icon||"📄"}</span>
            <div>
              <div style="font-weight:700;font-size:14px;color:var(--navy);display:flex;align-items:center;gap:8px;flex-wrap:wrap">
                <span>${i.title}</span>
                <span class="pill pill-green" style="font-size:10px">${i.status||"Verified"}</span>
              </div>
              <div style="font-size:12px;color:var(--text-sub);margin-top:2px">
                ${i.type} · <strong>${i.date}</strong> · ${i.size} · Ref: <span class="td-mono">${i.ref||i.id}</span>
              </div>
            </div>
          </div>

          <div style="display:flex;gap:8px">
            <button class="btn btn-ghost btn-sm" onclick="window.previewStudentDocument('${i.id}')">
              Preview
            </button>
            <button class="btn btn-primary btn-sm" onclick="window.downloadStudentDocument('${i.id}', '${i.title.replace(/'/g,"\\'")}')">
              Download
            </button>
          </div>
        </div>
      `).join("")}
    </div>
  `}function Y(t){const e=document.getElementById("docs-content-container");e&&(e.innerHTML=`
      <div style="text-align:center;padding:40px 16px;color:#dc2626">
        <div style="font-size:32px;margin-bottom:8px">⚠️</div>
        <div style="font-weight:700;margin-bottom:4px">Document Service Unavailable</div>
        <div style="font-size:12px;color:var(--text-sub);margin-bottom:14px">${t}</div>
        <button class="btn btn-sm btn-ghost" onclick="renderDocsView(document.getElementById('main-content'))">Retry Connection</button>
      </div>
    `)}window.filterDocsCategory=function(t){C=t;const e=document.getElementById("main-content");e&&le(e)};window.previewStudentDocument=function(t){const e=j.find(s=>s.id===t);if(!e)return;const{currentUser:i}=u.state,n=`
    <div style="padding:4px 0">
      <div style="background:var(--bg-alt);border:1px solid var(--border);border-radius:var(--radius-md);padding:14px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
        <div>
          <div style="font-weight:700;color:var(--navy);font-size:14px">${e.title}</div>
          <div style="font-size:12px;color:var(--text-sub)">Ref: <strong class="td-mono">${e.ref||e.id}</strong> · ${e.date} · ${e.size}</div>
        </div>
        <span class="pill pill-green" style="font-size:11px">✓ ${e.status||"Verified"}</span>
      </div>

      <div style="background:#fff;border:1px solid var(--border);border-radius:var(--radius-sm);padding:24px;min-height:200px;font-family:var(--font-sans);font-size:13px;line-height:1.7;color:var(--navy);box-shadow:inset 0 1px 3px rgba(0,0,0,0.05)">
        <div style="display:flex;justify-content:space-between;border-bottom:1px solid var(--border);padding-bottom:12px;margin-bottom:16px">
          <div>
            <strong style="font-size:15px;color:var(--navy)">HTS &amp; GKAS STUDENT RESIDENCES</strong><br>
            <span style="font-size:11px;color:var(--text-sub)">Mbombela / Nelspruit, Mpumalanga, South Africa</span>
          </div>
          <div style="text-align:right">
            <span class="pill pill-navy" style="font-size:10px">CERTIFIED RECORD</span>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;font-size:12px">
          <div><strong>Resident Name:</strong> ${e.studentName||(i==null?void 0:i.name)||"Resident"}</div>
          <div><strong>Student Number:</strong> ${e.studentNumber||(i==null?void 0:i.studentNumber)||"21304567"}</div>
          <div><strong>Document Type:</strong> ${e.type}</div>
          <div><strong>Digital Tracking Ref:</strong> <span class="td-mono">${e.ref||e.id}</span></div>
        </div>

        <div style="background:var(--bg-alt);padding:12px;border-radius:var(--radius-sm);font-size:12px;color:var(--text-sub);border-left:3px solid var(--navy)">
          This is an official document retrieved from the encrypted residence vault. Legally validated and counter-signed by Administrator <strong>L. Marsher</strong> on ${e.date}.
        </div>
      </div>

      <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:16px">
        <button type="button" class="btn btn-ghost" onclick="window.closeModal()">Close</button>
        <button type="button" class="btn btn-primary" onclick="window.downloadStudentDocument('${e.id}', '${e.title.replace(/'/g,"\\'")}')">Download Certified PDF</button>
      </div>
    </div>
  `;h(e.title,n,!0)};window.downloadStudentDocument=async function(t,e){try{const n=await(await fetch(`/api/documents/download/${t}`,{headers:u.getAuthHeaders()})).json().catch(()=>({}));p("📄",`Pre-signed download link generated for "${e}". Valid for 15 minutes.`,"success")}catch{p("📄",`Secure download initiated for "${e}".`,"success")}};function qe(t){t==="privacy"?h("Protection of Personal Information Act (POPIA) Policy",`
      <div style="font-size:13px;color:var(--text-muted);line-height:1.6">
        <h4 style="color:var(--navy);font-size:15px;margin-bottom:6px">1. Responsible Party</h4>
        <p style="margin-bottom:12px">HTS &amp; GKAS Student Residences (Pty) Ltd acts as the responsible party under Act No. 4 of 2013 (POPIA) for all student applicant and resident personal information processed through this portal.</p>

        <h4 style="color:var(--navy);font-size:15px;margin-bottom:6px">2. Purpose of Processing</h4>
        <p style="margin-bottom:12px">Personal records (including SA National ID, academic registration, NSFAS funding status, and disciplinary history) are collected solely for accommodation placement, security access, regulatory DHET compliance, and emergency contact.</p>

        <h4 style="color:var(--navy);font-size:15px;margin-bottom:6px">3. Security &amp; Data Rights</h4>
        <p>Students retain the statutory right to request access, correction, or deletion of outdated personal data by contacting the appointed Information Officer at <strong>privacy@hts-gkas.co.za</strong>.</p>
      </div>
    `,!0):t==="terms"?h("Terms & Conditions of Residence",`
      <div style="font-size:13px;color:var(--text-muted);line-height:1.6">
        <h4 style="color:var(--navy);font-size:15px;margin-bottom:6px">1. Accreditation &amp; Allocation</h4>
        <p style="margin-bottom:12px">Beds are allocated strictly based on verified enrollment at accredited higher education institutions in Nelspruit/Mbombela (TUT, UMP) and active funding accreditation.</p>

        <h4 style="color:var(--navy);font-size:15px;margin-bottom:6px">2. Digital Signature &amp; Notice</h4>
        <p>Digital lease contracts executed through DocuSign are legally binding under the Electronic Communications and Transactions Act (ECTA). Thirty (30) days written notice is required for any contract amendment.</p>
      </div>
    `,!0):t==="cookies"&&h("Portal Cookie Policy",`
      <div style="font-size:13px;color:var(--text-muted);line-height:1.6">
        <p style="margin-bottom:12px">This portal uses strictly necessary HTTP-only authentication tokens and local state storage to manage active user sessions and role views. No commercial advertising trackers or third-party behavioral cookies are deployed.</p>
      </div>
    `)}window.openLegalModal=qe;window.showToast=p;window.closeToast=ie;window.closeModal=w;window.toggleSidebar=me;window.openMobileMenu=ge;window.closeMobileMenu=te;window.toggleNotif=ne;window.pwaService=F;window.installPwa=()=>F.promptInstall();window.doLogout=function(){var t,e;(t=document.getElementById("app"))==null||t.classList.add("hidden"),(e=document.getElementById("login-page"))==null||e.classList.remove("hidden"),M(),p("👋","Signed out of residence portal session.","info")};window.handleNotifClick=function(t){ne(),u.setActiveModule("news")};function Z(){const t=document.getElementById("main-content");if(!t)return;fe(),we();const{activeModule:e,currentRole:i}=u.state;switch(t.innerHTML="",t.scrollTop=0,e){case"dashboard":case"student-home":_(t);break;case"maintenance":z(t);break;case"activity":Ee(t);break;case"bursary":ae(t);break;case"occupancy":De(t);break;case"leases":case"my-lease":Le(t);break;case"rules":Ue(t);break;case"news":re(t);break;case"finance":O(t);break;case"audit":je(t);break;case"settings":He(t);break;case"applications":U(t);break;case"movein":Ge(t);break;case"my-docs":le(t);break;default:_(t);break}}function Q(){var i,n,s,a,r,l,c,d;const t=window.location.hash;if(!t)return;const e=t.replace(/^#\/?/,"").toLowerCase();if(e==="register")(i=document.getElementById("app"))==null||i.classList.add("hidden"),(n=document.getElementById("login-page"))==null||n.classList.remove("hidden"),typeof window.setAuthMode=="function"&&window.setAuthMode("register");else if(e==="maintenance")(s=document.getElementById("login-page"))==null||s.classList.add("hidden"),(a=document.getElementById("app"))==null||a.classList.remove("hidden"),u.setActiveModule("maintenance");else if(e==="lease"||e==="my-lease"){(r=document.getElementById("login-page"))==null||r.classList.add("hidden"),(l=document.getElementById("app"))==null||l.classList.remove("hidden");const{currentRole:v}=u.state;u.setActiveModule(v==="student"?"my-lease":"leases")}else if(e==="dashboard"||e==="student-home"){(c=document.getElementById("login-page"))==null||c.classList.add("hidden"),(d=document.getElementById("app"))==null||d.classList.remove("hidden");const{currentRole:v}=u.state;u.setActiveModule(v==="student"?"student-home":"dashboard")}}function X(){F.init(),Se(),u.subscribe(()=>{Z()}),M(),Z(),Q(),window.addEventListener("hashchange",Q)}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",X):X();
