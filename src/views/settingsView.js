/* ═══════════════════════════════════════════════════════════
   SETTINGS VIEW
   System configuration, user accounts, and API integrations
═══════════════════════════════════════════════════════════ */

import { stateService } from '../services/state.js';
import { showToast } from '../components/toast.js';

export function renderSettingsView(container) {
  container.innerHTML = `
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
  `;
}
