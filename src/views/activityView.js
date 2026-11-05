/* ═══════════════════════════════════════════════════════════
   ACTIVITY HUB VIEW
   - Cleaned per user request: Transport Request REMOVED!
   - Cleaned per user request: Upcoming Bookings REMOVED!
   - Focus on on-campus residence amenities & instant slot booking
═══════════════════════════════════════════════════════════ */

import { stateService } from '../services/state.js';
import { RESIDENCE_AMENITIES } from '../data/initialData.js';
import { showToast } from '../components/toast.js';
import { openModal, closeModal } from '../components/modal.js';

export function renderActivityView(container) {
  container.innerHTML = `
    <div class="section-hd">
      <div>
        <div class="section-title">Residence Activity Hub</div>
        <div class="section-sub">Book recreational, wellness, and academic study spaces across HTS &amp; GKAS campuses</div>
      </div>
    </div>

    <!-- Amenities Grid (NO TRANSPORT REQUEST) -->
    <div class="grid2">
      ${RESIDENCE_AMENITIES.map(a => `
        <div class="card" style="display:flex;flex-direction:column;justify-content:space-between">
          <div>
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">
              <div style="width:48px;height:48px;border-radius:var(--radius-md);background:${a.bg};display:flex;align-items:center;justify-content:center;font-size:24px">
                ${a.icon}
              </div>
              <span class="pill pill-green">Open Daily</span>
            </div>

            <h3 style="font-family:var(--font-serif);font-size:20px;font-weight:700;color:var(--navy);margin-bottom:4px">${a.name}</h3>
            <div style="font-size:12px;color:var(--text-sub);margin-bottom:8px;font-weight:500">${a.residence} · ${a.info}</div>
            <p style="font-size:13px;color:var(--text-muted);line-height:1.5;margin-bottom:16px">${a.description}</p>
          </div>

          <div style="border-top:1px solid var(--border-subtle);padding-top:14px">
            <div style="font-size:11px;font-weight:700;color:var(--text-sub);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px">Available Sessions Today</div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px">
              ${a.slots.slice(0, 3).map(s => `
                <span style="font-size:11px;padding:4px 8px;background:var(--bg-alt);border:1px solid var(--border);border-radius:var(--radius-xs);color:var(--navy)">
                  ${s}
                </span>
              `).join('')}
            </div>
            <button class="btn btn-primary btn-full" onclick="window.openBookingDialog('${a.id}')">
              Reserve a Slot
            </button>
          </div>
        </div>
      `).join('')}
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
  `;
}

window.openBookingDialog = function(amenityId) {
  const amenity = RESIDENCE_AMENITIES.find(a => a.id === amenityId);
  if (!amenity) return;

  const today = new Date().toISOString().split('T')[0];

  openModal(`Book ${amenity.name}`, `
    <div style="margin-bottom:14px;font-size:13px;color:var(--text-muted)">
      Reserve your timeslot at <strong>${amenity.residence}</strong>. Access will be activated on your student room access card.
    </div>

    <div class="f-row">
      <div class="f-group">
        <label class="f-label" for="bk-date">Date</label>
        <input class="f-input" type="date" id="bk-date" value="${today}" min="${today}">
      </div>
      <div class="f-group">
        <label class="f-label" for="bk-slot">Preferred Slot</label>
        <select class="f-input f-select" id="bk-slot">
          ${amenity.slots.map(s => `<option value="${s}">${s}</option>`).join('')}
        </select>
      </div>
    </div>

    <div class="f-group">
      <label class="f-label" for="bk-pax">Number of Attending Residents</label>
      <input class="f-input" type="number" id="bk-pax" min="1" max="6" value="1">
    </div>

    <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:16px">
      <button class="btn btn-ghost" onclick="window.closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="window.confirmAmenityBooking('${amenity.id}', '${amenity.name.replace(/'/g, "\\'")}')">Confirm Booking</button>
    </div>
  `);
};

window.confirmAmenityBooking = function(amenityId, amenityName) {
  const date = document.getElementById('bk-date')?.value || new Date().toISOString().split('T')[0];
  const slot = document.getElementById('bk-slot')?.value;
  const pax = parseInt(document.getElementById('bk-pax')?.value, 10) || 1;

  const { currentUser } = stateService.state;

  stateService.addAmenityBooking({
    amenityId,
    amenityName,
    studentName: currentUser.name || 'Student Resident',
    studentNumber: currentUser.studentNumber || currentUser.id || '',
    date,
    slot,
    pax
  });

  closeModal();
  showToast('✓', `Booking confirmed for ${amenityName} on ${date} (${slot}). Have a great session!`, 'success');
};
