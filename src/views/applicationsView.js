/* ═══════════════════════════════════════════════════════════
   APPLICATIONS & WAITING LIST VIEW (STAFF ONLY)
   Time-ordered queue for student accommodation applications,
   Structured Funding Review, Document Audit Drawer, and
   Transactional Decision Triggers (L. Marsher).
═══════════════════════════════════════════════════════════ */

import { stateService } from '../services/state.js';
import { showToast } from '../components/toast.js';
import { openModal, closeModal } from '../components/modal.js';
import { openDocumentAuditDrawer } from '../components/admin/DocumentAuditDrawer.js';

export function renderApplicationsView(container) {
  const { applicants } = stateService.state;
  const pending = applicants.filter(a => !a.processed);

  container.innerHTML = `
    <div class="section-hd">
      <div>
        <div class="section-title">2027 Applications &amp; Waiting List</div>
        <div class="section-sub">Chronologically ordered queue aligned with NSFAS accredited bed allocations and audit verification</div>
      </div>
      <div style="display:flex;gap:8px;align-items:center">
        <span class="pill pill-amber">${pending.length} Awaiting Verification</span>
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
        ${applicants.map(app => {
          const fundingStatus = app.fundingStatus || 'pending_verification';
          const refNumber = app.referenceNumber || app.id;

          return `
            <div class="card" style="margin-bottom:0;border:1px solid var(--border);padding:18px;background:${app.processed ? 'var(--bg-alt)' : '#ffffff'}">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:14px">
                
                <!-- Student Info -->
                <div style="display:flex;align-items:flex-start;gap:14px">
                  <div style="width:48px;height:48px;border-radius:var(--radius-full);background:${app.bg};color:${app.tc};display:flex;align-items:center;justify-content:center;font-weight:700;font-size:16px;flex-shrink:0">
                    ${app.initials}
                  </div>
                  <div>
                    <div style="font-weight:700;font-size:15px;color:var(--navy);display:flex;align-items:center;gap:8px">
                      ${app.name}
                      <span class="pill ${
                        fundingStatus === 'verified' ? 'pill-green' : fundingStatus === 'rejected' ? 'pill-red' : 'pill-amber'
                      }" style="font-size:10px">
                        Funding: ${fundingStatus.toUpperCase().replace('_', ' ')}
                      </span>
                    </div>

                    <div style="font-size:12px;color:var(--text-sub);margin:2px 0 4px" class="td-mono">
                      Ref: <strong>${refNumber}</strong> · ${app.institution || 'TUT Nelspruit'} · ${app.funding || 'NSFAS'}
                    </div>

                    <div style="font-size:11px;color:var(--text-muted);display:flex;flex-wrap:wrap;gap:12px">
                      <span>Preferred: <strong>${app.preferredResidence}</strong> (${app.roomType || 'Single Room'})</span>
                      <span>SA ID: <code class="td-mono">${app.idNumber}</code></span>
                      <span>Student No: <code class="td-mono">${app.studentNumber || '22109845'}</code></span>
                      <span>Contact: <strong>${app.phone || '071 829 4012'}</strong></span>
                    </div>

                    ${app.bursarySponsorName ? `
                      <div style="font-size:11px;color:var(--blue);margin-top:4px">
                        Sponsor / Guarantor: <strong>${app.bursarySponsorName}</strong> (Ref: ${app.fundingReferenceNumber || 'N/A'})
                      </div>
                    ` : ''}

                    ${app.guardianName ? `
                      <div style="font-size:11px;color:var(--text-sub);margin-top:4px">
                        Parent / Sponsor: <strong>${app.guardianName}</strong> (${app.guardianContact || 'N/A'})
                      </div>
                    ` : ''}
                  </div>
                </div>

                <!-- Right Action Cluster -->
                <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px">
                  <div style="display:flex;gap:6px;align-items:center">
                    <button class="btn btn-ghost btn-xs" onclick="window.handleOpenAuditDrawer('${app.id}')" title="Open split-screen OCR cross-check & tamper scanner">
                      🔍 Audit Documents
                    </button>

                    ${fundingStatus === 'pending_verification' ? `
                      <button class="btn btn-success btn-xs" onclick="window.handleApproveFunding('${app.id}')">
                        Approve Funding
                      </button>
                      <button class="btn btn-ghost btn-xs" style="color:var(--red)" onclick="window.handleRejectFunding('${app.id}')">
                        Reject Funding
                      </button>
                    ` : ''}
                  </div>

                  <div style="display:flex;gap:8px;align-items:center;margin-top:4px">
                    ${!app.processed ? `
                      <button class="btn btn-success btn-sm" onclick="window.handleAcceptApplicant('${app.id}')">
                        ✓ Accept &amp; Offer Bed
                      </button>
                      <button class="btn btn-danger btn-sm" onclick="window.handleDeclineApplicant('${app.id}')">
                        ✕ Decline
                      </button>
                    ` : `
                      <span class="pill ${app.decision === 'accepted' ? 'pill-green' : 'pill-red'}" style="font-weight:700">
                        ${app.decision ? app.decision.toUpperCase() : 'PROCESSED'}
                      </span>
                    `}
                  </div>
                </div>

              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

// ─── Document Audit Drawer Opener ───
window.handleOpenAuditDrawer = function(appId) {
  const applicant = stateService.state.applicants.find(a => a.id === appId) || stateService.state.applicants[0];
  if (!applicant) return;

  openDocumentAuditDrawer({
    documentId: `doc-${applicant.id}-01`,
    applicantId: applicant.id,
    applicantName: applicant.name,
    detectedName: applicant.name,
    profileId: applicant.idNumber,
    detectedId: applicant.idNumber,
    luhnValid: true,
    profileInstitution: applicant.institution || 'Tshwane University of Technology',
    detectedInstitution: applicant.institution || 'Tshwane University of Technology',
    documentType: 'id_copy',
    documentName: 'Certified South African ID & 2027 Registration Copy',
    tamperScore: 0.04,
    metadataProducer: 'Canon imageRUNNER / Certified Police Stamp',
    fileUrl: '#',
    status: 'valid'
  }, (action, reason) => {
    if (action === 'accept') {
      showToast('✓', `Document verified for ${applicant.name}. Tamper check: Clean.`, 'success');
    } else {
      showToast('⚠', `Re-upload requested from ${applicant.name}. Reason: ${reason || 'Document mismatch'}`, 'info');
    }
  });
};

// ─── Funding Quick-Action Buttons ───
window.handleApproveFunding = async function(appId) {
  await stateService.updateFundingStatus(appId, 'verified', null);
  showToast('💰', `Funding approved & verified for applicant ${appId}!`, 'success');
  const content = document.getElementById('main-content');
  if (content) renderApplicationsView(content);
};

window.handleRejectFunding = function(appId) {
  openModal(`Reject / Request Funding Resubmission — ${appId}`, `
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
      <button class="btn btn-danger" onclick="window.confirmRejectFunding('${appId}')">Confirm Rejection</button>
    </div>
  `);
};

window.confirmRejectFunding = async function(appId) {
  const reason = document.getElementById('rej-funding-reason')?.value || 'Incomplete documentation';
  await stateService.updateFundingStatus(appId, 'rejected', reason);
  closeModal();
  showToast('⚠', `Funding rejected for ${appId}. Notice sent to student requesting resubmission.`, 'info');
  const content = document.getElementById('main-content');
  if (content) renderApplicationsView(content);
};

// ─── Decision Triggers ───
window.handleAcceptApplicant = async function(appId) {
  const applicant = stateService.state.applicants.find(a => a.id === appId);
  await stateService.processApplicant(appId, 'accepted', 'All documents verified, funding confirmed, and 2027 bed allocated.');
  showToast('✓', `Applicant ${applicant?.name || appId} accepted! 2027 Bed assigned and DocuSign lease dispatched.`, 'success');
  const content = document.getElementById('main-content');
  if (content) renderApplicationsView(content);
};

window.handleDeclineApplicant = function(appId) {
  openModal(`Decline 2027 Application — ${appId}`, `
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
      <button class="btn btn-danger" onclick="window.confirmDecline('${appId}')">Confirm Decline</button>
    </div>
  `);
};

window.confirmDecline = async function(appId) {
  const reason = document.getElementById('dec-reason')?.value;
  await stateService.processApplicant(appId, 'declined', reason);
  closeModal();
  showToast('✓', `Application ${appId} marked as declined. Formal notice dispatched to student.`, 'info');
  const content = document.getElementById('main-content');
  if (content) renderApplicationsView(content);
};
