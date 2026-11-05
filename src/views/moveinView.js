/* ═══════════════════════════════════════════════════════════
   MOVE-IN INSPECTIONS VIEW
   Dated digital room condition checklist signed by student & warden
═══════════════════════════════════════════════════════════ */

import { stateService } from '../services/state.js';
import { showToast } from '../components/toast.js';

export function renderMoveinView(container) {
  const { currentUser, currentRole } = stateService.state;

  container.innerHTML = `
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
        <span>Room Condition Inventory: Room ${currentUser.room || 'G-14'}</span>
        <span class="pill pill-navy">Inspection Date: 01 Feb 2027</span>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(260px, 1fr));gap:14px;margin-bottom:20px">
        ${[
          'Walls, Plaster & Paintwork',
          'Floor Tiles & Skirting',
          'Window Glass, Latches & Curtains',
          'Door Cylinder, Keys & Handles',
          'Electrical Outlets & Light Fixtures',
          'Desk, Chair & Study Lamp',
          'Bed Frame, Base & Mattress Protector',
          'Wardrobe, Shelving & Rail',
          'Ablution Fixtures & Water Pressure'
        ].map(item => `
          <div style="padding:14px;background:var(--bg-alt);border:1px solid var(--border);border-radius:var(--radius-md)">
            <div style="font-weight:600;font-size:13px;color:var(--navy);margin-bottom:8px">${item}</div>
            <select class="f-input f-select" style="min-height:36px;font-size:12px">
              <option>Good — No damage noted</option>
              <option>Fair — Minor pre-existing wear</option>
              <option>Defect Noted — Repair requested</option>
            </select>
          </div>
        `).join('')}
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
  `;
}

window.submitInspectionForm = function() {
  showToast('✓', 'Move-in inspection digitally timestamped and countersigned. Copy stored in your document library.', 'success');
};
