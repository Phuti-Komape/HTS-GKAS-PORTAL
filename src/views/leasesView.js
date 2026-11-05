/* ═══════════════════════════════════════════════════════════
   LEASES & LEGAL AGREEMENTS VIEW
   DocuSign e-signature integration, lease generator, student lease view
═══════════════════════════════════════════════════════════ */

import { stateService } from '../services/state.js';
import { showToast } from '../components/toast.js';
import { openModal, closeModal } from '../components/modal.js';

export function renderLeasesView(container) {
  const { currentRole, currentUser } = stateService.state;

  if (currentRole === 'student') {
    renderStudentLease(container, currentUser);
  } else {
    renderStaffLeases(container);
  }
}

// Student's own lease view
function renderStudentLease(container, user) {
  const academicYear = user.academicYear || 2027;
  const commencementDate = user.leaseStart || `01 Feb ${academicYear}`;
  const terminationDate = user.leaseEnd || `30 Nov ${academicYear}`;
  const docusignRef = user.docusignRef || `DSENV-${academicYear}-MP-2842`;

  container.innerHTML = `
    <div class="section-hd">
      <div>
        <div class="section-title">Residential Lease Agreement ${academicYear}</div>
        <div class="section-sub">Room ${user.room || 'G-14'} (${user.bed || 'Bed A'}) · ${user.residence}</div>
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
          <div style="font-size:12px;color:var(--text-sub)">DocuSign Envelope ID: <strong>${docusignRef}</strong> · Signed ${commencementDate}</div>
        </div>
        <span class="pill pill-green">ACTIVE LEASE</span>
      </div>

      <div class="grid4" style="margin-bottom:18px">
        <div style="padding:12px;background:var(--bg-alt);border:1px solid var(--border);border-radius:var(--radius-sm)">
          <div class="stat-label">Resident Tenant</div>
          <div style="font-weight:600;font-size:13px">${user.name}</div>
        </div>
        <div style="padding:12px;background:var(--bg-alt);border:1px solid var(--border);border-radius:var(--radius-sm)">
          <div class="stat-label">Commencement Date</div>
          <div style="font-weight:600;font-size:13px">${commencementDate}</div>
        </div>
        <div style="padding:12px;background:var(--bg-alt);border:1px solid var(--border);border-radius:var(--radius-sm)">
          <div class="stat-label">Termination Date</div>
          <div style="font-weight:600;font-size:13px">${terminationDate}</div>
        </div>
        <div style="padding:12px;background:var(--bg-alt);border:1px solid var(--border);border-radius:var(--radius-sm)">
          <div class="stat-label">Accredited Funding</div>
          <div style="font-weight:600;font-size:13px">${user.funding || 'NSFAS Direct'}</div>
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
  `;
}

// Staff leases view
function renderStaffLeases(container) {
  container.innerHTML = `
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
  `;
}

window.openGenerateLeaseModal = function() {
  openModal('Generate Digital Lease Contract', `
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
  `);
};

window.confirmGenerateLease = function() {
  closeModal();
  showToast('✓', 'Lease envelope generated and sent via DocuSign to student email.', 'success');
};
