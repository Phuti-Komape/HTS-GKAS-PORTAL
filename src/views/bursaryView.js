/* ═══════════════════════════════════════════════════════════
   BURSARY PORTAL VIEW
   - Student view: Admin review REMOVED per user request!
   - Staff view: Application verification, quota review & approvals
═══════════════════════════════════════════════════════════ */

import { stateService } from '../services/state.js';
import { showToast } from '../components/toast.js';
import { openModal, closeModal } from '../components/modal.js';

export function renderBursaryView(container) {
  const { currentRole } = stateService.state;

  if (currentRole === 'student') {
    renderStudentBursaryView(container);
  } else {
    renderStaffBursaryView(container);
  }
}

// ─── STUDENT BURSARY VIEW (NO ADMIN REVIEW) ───
function renderStudentBursaryView(container) {
  const { currentUser, bursaryApplications } = stateService.state;
  const myApp = bursaryApplications.find(b => 
    b.studentName === currentUser.name || 
    (currentUser.studentNumber && b.studentNumber === currentUser.studentNumber)
  ) || null;

  container.innerHTML = `
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
        <span class="pill ${myApp ? 'pill-amber' : 'pill-navy'}">${myApp ? myApp.status : 'Not Submitted'}</span>
      </div>

      ${myApp ? `
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:14px;margin-bottom:14px;font-size:13px">
          <div><span style="color:var(--text-sub)">Reference:</span> <strong class="td-mono">${myApp.id}</strong></div>
          <div><span style="color:var(--text-sub)">Scheme:</span> <strong>${myApp.fundingSource}</strong></div>
          <div><span style="color:var(--text-sub)">Submitted:</span> <strong>${myApp.submittedDate}</strong></div>
          <div><span style="color:var(--text-sub)">Documents:</span> <span class="pill pill-green" style="font-size:10px">Verified</span></div>
        </div>
        <p style="font-size:12px;color:var(--text-muted);line-height:1.6">
          Your accommodation top-up application has been forwarded to the institutional financial aid committee. Decisions are communicated via email and registered SMS.
        </p>
      ` : `
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
            <input class="f-input" type="text" id="bu-name" value="${currentUser.name}" required>
          </div>
          <div class="f-group">
            <label class="f-label" for="bu-num">Student Number <span class="f-required">*</span></label>
            <input class="f-input" type="text" id="bu-num" value="${currentUser.studentNumber || '21304567'}" required>
          </div>
        </div>

        <div class="f-row">
          <div class="f-group">
            <label class="f-label" for="bu-inst">Institution <span class="f-required">*</span></label>
            <input class="f-input" type="text" id="bu-inst" value="${currentUser.institution}" required>
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
  `;
}

// ─── STAFF BURSARY VIEW (ADMIN REVIEW SHOWN ONLY TO STAFF) ───
function renderStaffBursaryView(container) {
  const { bursaryApplications } = stateService.state;

  container.innerHTML = `
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
        <span class="pill pill-blue">${bursaryApplications.length} Applications</span>
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
            ${bursaryApplications.map(b => `
              <tr>
                <td class="td-mono">${b.id}</td>
                <td class="td-bold">${b.studentName}</td>
                <td>${b.institution}</td>
                <td><span class="pill pill-navy">${b.fundingSource}</span></td>
                <td>${b.submittedDate}</td>
                <td><span class="pill ${b.status === 'Approved' ? 'pill-green' : 'pill-amber'}">${b.status}</span></td>
                <td>
                  <div style="display:flex;gap:6px">
                    <button class="btn btn-success btn-xs" onclick="window.approveBursary('${b.id}')">Approve</button>
                    <button class="btn btn-ghost btn-xs" onclick="showToast('📋', 'Detailed documents opened for ${b.studentName}.', 'info')">Review</button>
                  </div>
                </td>
              </tr>
            `).join('')}
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
  `;
}

// ─── Event Handlers ───
window.handleBursarySubmit = function(e) {
  e.preventDefault();
  const name = document.getElementById('bu-name')?.value.trim();
  const num = document.getElementById('bu-num')?.value.trim();
  const inst = document.getElementById('bu-inst')?.value.trim();
  const stream = document.getElementById('bu-source')?.value;

  const newApp = stateService.submitBursaryApplication({
    fullName: name,
    studentNumber: num,
    institution: inst,
    fundingSource: stream
  });

  showToast('✓', `Bursary application ${newApp.id} submitted successfully! Decision will be released within 14 days.`, 'success');
  const content = document.getElementById('main-content');
  if (content) renderBursaryView(content);
};

window.approveBursary = function(id) {
  showToast('✓', `Bursary application ${id} approved and allocated. Student notified via email.`, 'success');
};
