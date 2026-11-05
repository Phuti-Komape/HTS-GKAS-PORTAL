/* ═══════════════════════════════════════════════════════════
   LEGAL VIEWS & MODALS
   POPIA Privacy Policy, Terms of Residence, Cookie Policy
═══════════════════════════════════════════════════════════ */

import { openModal } from '../components/modal.js';

export function openLegalModal(type) {
  if (type === 'privacy') {
    openModal('Protection of Personal Information Act (POPIA) Policy', `
      <div style="font-size:13px;color:var(--text-muted);line-height:1.6">
        <h4 style="color:var(--navy);font-size:15px;margin-bottom:6px">1. Responsible Party</h4>
        <p style="margin-bottom:12px">HTS &amp; GKAS Student Residences (Pty) Ltd acts as the responsible party under Act No. 4 of 2013 (POPIA) for all student applicant and resident personal information processed through this portal.</p>

        <h4 style="color:var(--navy);font-size:15px;margin-bottom:6px">2. Purpose of Processing</h4>
        <p style="margin-bottom:12px">Personal records (including SA National ID, academic registration, NSFAS funding status, and disciplinary history) are collected solely for accommodation placement, security access, regulatory DHET compliance, and emergency contact.</p>

        <h4 style="color:var(--navy);font-size:15px;margin-bottom:6px">3. Security &amp; Data Rights</h4>
        <p>Students retain the statutory right to request access, correction, or deletion of outdated personal data by contacting the appointed Information Officer at <strong>privacy@hts-gkas.co.za</strong>.</p>
      </div>
    `, true);
  } else if (type === 'terms') {
    openModal('Terms & Conditions of Residence', `
      <div style="font-size:13px;color:var(--text-muted);line-height:1.6">
        <h4 style="color:var(--navy);font-size:15px;margin-bottom:6px">1. Accreditation &amp; Allocation</h4>
        <p style="margin-bottom:12px">Beds are allocated strictly based on verified enrollment at accredited higher education institutions in Nelspruit/Mbombela (TUT, UMP) and active funding accreditation.</p>

        <h4 style="color:var(--navy);font-size:15px;margin-bottom:6px">2. Digital Signature &amp; Notice</h4>
        <p>Digital lease contracts executed through DocuSign are legally binding under the Electronic Communications and Transactions Act (ECTA). Thirty (30) days written notice is required for any contract amendment.</p>
      </div>
    `, true);
  } else if (type === 'cookies') {
    openModal('Portal Cookie Policy', `
      <div style="font-size:13px;color:var(--text-muted);line-height:1.6">
        <p style="margin-bottom:12px">This portal uses strictly necessary HTTP-only authentication tokens and local state storage to manage active user sessions and role views. No commercial advertising trackers or third-party behavioral cookies are deployed.</p>
      </div>
    `);
  }
}

window.openLegalModal = openLegalModal;
