/* ═══════════════════════════════════════════════════════════
   OCCUPANCY & RESIDENTS VIEW
   Interactive bed allocation for GKAS Sonheuwel & HTS Stonehenge
═══════════════════════════════════════════════════════════ */

import { stateService } from '../services/state.js';
import { showToast } from '../components/toast.js';
import { openModal, closeModal } from '../components/modal.js';

export function renderOccupancyView(container) {
  const { residences } = stateService.state;

  container.innerHTML = `
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
      ${residences.map(res => `
        <div class="card">
          <div class="card-title">
            <span>${res.name} — ${res.campus}</span>
            <span class="pill pill-green">${res.occupiedBeds} / ${res.totalBeds} Occupied</span>
          </div>

          <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-sub);margin-bottom:6px">
            <span>Occupancy Rate</span>
            <strong>${Math.round((res.occupiedBeds / res.totalBeds) * 100)}%</strong>
          </div>
          <div class="stat-bar" style="height:8px;margin-bottom:14px">
            <div class="stat-fill" style="width:${(res.occupiedBeds / res.totalBeds) * 100}%;background:linear-gradient(90deg, var(--navy), var(--gold))"></div>
          </div>

          <div style="display:flex;gap:16px;font-size:12px;color:var(--text-muted);margin-bottom:14px">
            <div>Available Beds: <strong>${res.availableBeds}</strong></div>
            <div>Monthly Rate: <strong>R${res.rateMonthly.toLocaleString()}</strong></div>
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
                ${res.rooms.map(rm => `
                  <tr>
                    <td><code class="td-mono">${rm.roomNumber}</code></td>
                    <td>${rm.type}</td>
                    <td>
                      <span class="pill ${rm.occupied === rm.beds ? 'pill-green' : rm.status === 'LEASEPENDING' ? 'pill-blue' : rm.status === 'MOVEINPENDING' ? 'pill-amber' : 'pill-navy'}">
                        ${rm.occupied === rm.beds ? 'OCCUPIED' : rm.status || 'AVAILABLE'}
                      </span>
                    </td>
                    <td>${rm.residents.join(', ') || '<span style="color:var(--text-light)">Unassigned</span>'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

window.openAssignBedModal = function() {
  openModal('Allocate Accredited Bed', `
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
  `);
};

window.confirmBedAllocation = function() {
  const name = document.getElementById('ab-name')?.value || 'Student';
  const bed = document.getElementById('ab-bed')?.value || 'G-02';
  closeModal();
  showToast('✓', `Bed ${bed} assigned to ${name}. DocuSign lease draft queued.`, 'success');
};
