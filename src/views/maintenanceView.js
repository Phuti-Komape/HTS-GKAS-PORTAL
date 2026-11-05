/* ═══════════════════════════════════════════════════════════
   MAINTENANCE VIEW
   - Student view: Request tickets only & notify management!
   - Staff view: Operations management, dispatch & resolution
═══════════════════════════════════════════════════════════ */

import { stateService } from '../services/state.js';
import { showToast } from '../components/toast.js';
import { openModal, closeModal } from '../components/modal.js';

let filterPriority = 'all';

export function renderMaintenanceView(container) {
  const { currentRole } = stateService.state;

  if (currentRole === 'student') {
    renderStudentMaintenance(container);
  } else {
    renderStaffMaintenance(container);
  }
}

// ─── STUDENT MAINTENANCE VIEW (REQUEST ONLY + NOTIFY) ───
function renderStudentMaintenance(container) {
  const { currentUser, tickets } = stateService.state;
  const myTickets = tickets.filter(t => t.studentId === currentUser.studentNumber || t.studentName === currentUser.name);

  container.innerHTML = `
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
            <input class="f-input" type="text" id="st-loc" value="Room ${currentUser.room || 'G-14'}" required>
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
            <input class="f-input" type="text" id="st-res" value="${currentUser.residence}" readonly style="background:var(--bg-muted)">
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
        <span style="font-size:12px;color:var(--text-sub)">${myTickets.length} Total Requests</span>
      </div>

      ${myTickets.length === 0 ? `
        <div style="text-align:center;padding:32px 16px;color:var(--text-sub)">
          <div style="font-size:32px;margin-bottom:8px">🛠️</div>
          <p>You have no active maintenance tickets logged.</p>
        </div>
      ` : `
        <div style="display:flex;flex-direction:column;gap:14px">
          ${myTickets.map(t => `
            <div class="card" style="margin-bottom:0;border:1px solid var(--border);padding:18px;background:#ffffff">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap">
                <div style="display:flex;gap:14px;align-items:flex-start">
                  <div style="width:42px;height:42px;border-radius:var(--radius-md);background:${t.bg};display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0">
                    ${t.icon}
                  </div>
                  <div>
                    <div style="font-weight:700;font-size:14px;color:var(--navy)">${t.title}</div>
                    <div style="font-size:12px;color:var(--text-sub);margin:2px 0 6px" class="td-mono">${t.id} · ${t.location} · ${t.category}</div>
                    <p style="font-size:13px;color:var(--text-muted);line-height:1.5">${t.description}</p>
                    ${t.lastNotified ? `
                      <div style="font-size:11px;color:var(--gold);font-weight:600;margin-top:6px">
                        📢 Management notified on ${new Date(t.lastNotified).toLocaleDateString('en-GB')} at ${new Date(t.lastNotified).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    ` : ''}
                  </div>
                </div>

                <div style="display:flex;flex-direction:column;align-items:flex-end;gap:10px;flex-shrink:0">
                  <span class="pill ${t.status === 'resolved' ? 'pill-green' : t.priority === 'urgent' ? 'pill-red' : 'pill-amber'}">
                    ${t.status === 'resolved' ? 'Resolved' : t.priority.toUpperCase()}
                  </span>

                  ${t.status === 'open' ? `
                    <button class="btn btn-gold btn-sm" onclick="window.openStudentNotifyModal('${t.id}', '${t.title.replace(/'/g, "\\'")}')">
                      📢 Notify Management
                    </button>
                  ` : `
                    <span style="font-size:11px;color:var(--green);font-weight:600">✓ Completed &amp; Inspected</span>
                  `}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `;
}

// ─── STAFF / ADMIN MAINTENANCE VIEW ───
function renderStaffMaintenance(container) {
  const { tickets } = stateService.state;

  const filteredTickets = tickets.filter(t => {
    if (filterPriority === 'all') return t.status === 'open';
    if (filterPriority === 'resolved') return t.status === 'resolved';
    return t.status === 'open' && t.priority === filterPriority;
  });

  const urgentCount = tickets.filter(t => t.status === 'open' && t.priority === 'urgent').length;

  container.innerHTML = `
    <div class="section-hd">
      <div>
        <div class="section-title">Facilities &amp; Maintenance Operations</div>
        <div class="section-sub">Dispatch technicians, track job orders, and record resolution notes</div>
      </div>
      <button class="btn btn-primary btn-sm" onclick="window.openStaffNewTicketModal()">+ Dispatch Job Order</button>
    </div>

    <!-- Filter Bar -->
    <div style="display:flex;gap:8px;margin-bottom:18px;flex-wrap:wrap">
      <button class="btn ${filterPriority === 'all' ? 'btn-primary' : 'btn-ghost'} btn-sm" onclick="window.setFilter('all')">
        All Open (${tickets.filter(t => t.status === 'open').length})
      </button>
      <button class="btn ${filterPriority === 'urgent' ? 'btn-primary' : 'btn-ghost'} btn-sm" onclick="window.setFilter('urgent')">
        Urgent (${urgentCount})
      </button>
      <button class="btn ${filterPriority === 'medium' ? 'btn-primary' : 'btn-ghost'} btn-sm" onclick="window.setFilter('medium')">
        Medium Priority
      </button>
      <button class="btn ${filterPriority === 'low' ? 'btn-primary' : 'btn-ghost'} btn-sm" onclick="window.setFilter('low')">
        Low Priority
      </button>
      <button class="btn ${filterPriority === 'resolved' ? 'btn-primary' : 'btn-ghost'} btn-sm" onclick="window.setFilter('resolved')">
        Resolved Archive
      </button>
    </div>

    <!-- Tickets List -->
    <div style="display:flex;flex-direction:column;gap:12px">
      ${filteredTickets.length === 0 ? `
        <div class="card" style="text-align:center;padding:32px;color:var(--text-sub)">
          <p>No maintenance tickets match the selected filter.</p>
        </div>
      ` : ''}

      ${filteredTickets.map(t => `
        <div class="card" style="margin-bottom:0;border-left:4px solid ${t.priority === 'urgent' ? 'var(--red)' : t.priority === 'medium' ? 'var(--gold)' : 'var(--blue)'}">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:14px;flex-wrap:wrap">
            <div style="display:flex;gap:14px;align-items:flex-start">
              <div style="width:40px;height:40px;border-radius:var(--radius-sm);background:${t.bg};display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0">
                ${t.icon}
              </div>
              <div>
                <div style="font-weight:700;font-size:14px;color:var(--navy)">${t.title}</div>
                <div style="font-size:12px;color:var(--text-sub);margin:2px 0 6px" class="td-mono">
                  ${t.id} · ${t.location} · Logged by ${t.studentName}
                </div>
                <p style="font-size:13px;color:var(--text-muted)">${t.description}</p>
                ${t.resolutionNote ? `
                  <div style="margin-top:8px;padding:8px 12px;background:var(--green-soft);border-radius:var(--radius-sm);font-size:12px;color:var(--green-hover)">
                    <strong>Resolution Note:</strong> ${t.resolutionNote}
                  </div>
                ` : ''}
              </div>
            </div>

            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
              <span class="pill ${t.status === 'resolved' ? 'pill-green' : t.priority === 'urgent' ? 'pill-red' : 'pill-amber'}">
                ${t.status === 'resolved' ? 'RESOLVED' : t.priority.toUpperCase()}
              </span>

              ${t.status === 'open' ? `
                <button class="btn btn-success btn-sm" onclick="window.openStaffResolveModal('${t.id}')">Mark Resolved</button>
                <button class="btn btn-ghost btn-sm" onclick="window.notifyStudentUpdate('${t.studentName}', '${t.id}')">Notify Student</button>
              ` : ''}
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// ─── Event Handlers ───
window.setFilter = function(p) {
  filterPriority = p;
  const content = document.getElementById('main-content');
  if (content) renderMaintenanceView(content);
};

window.handleStudentTicketSubmit = function(e) {
  e.preventDefault();
  const loc = document.getElementById('st-loc')?.value.trim();
  const cat = document.getElementById('st-cat')?.value;
  const pri = document.getElementById('st-pri')?.value;
  const desc = document.getElementById('st-desc')?.value.trim();

  if (!loc || !desc) {
    showToast('⚠', 'Please provide location and description.', 'error');
    return;
  }

  const { currentUser } = stateService.state;
  const newTicket = stateService.addTicket({
    title: `${cat} issue at ${loc}`,
    location: loc,
    residence: currentUser.residence,
    priority: pri,
    category: cat,
    studentName: currentUser.name,
    studentId: currentUser.studentNumber,
    description: desc
  });

  showToast('✓', `Ticket ${newTicket.id} logged. Facilities team notified.`, 'success');
  const content = document.getElementById('main-content');
  if (content) renderMaintenanceView(content);
};

window.openStudentNotifyModal = function(ticketId, ticketTitle) {
  openModal(`Notify Management — ${ticketId}`, `
    <div style="margin-bottom:14px;font-size:13px;color:var(--text-muted);line-height:1.5">
      Send an instant notification directly to the <strong>Residence Warden</strong> and <strong>Facilities Supervisor</strong> regarding:
      <div style="font-weight:700;color:var(--navy);margin-top:4px">"${ticketTitle}"</div>
    </div>

    <div class="f-group">
      <label class="f-label" for="notify-msg">Message / Follow-up Details</label>
      <textarea class="f-input" id="notify-msg" placeholder="e.g. The leak has worsened this afternoon, please send someone urgently..." rows="3">Urgent update: This issue requires priority attention today.</textarea>
    </div>

    <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:16px">
      <button class="btn btn-ghost" onclick="window.closeModal()">Cancel</button>
      <button class="btn btn-gold" onclick="window.submitStudentNotify('${ticketId}')">Dispatch Notification to Management</button>
    </div>
  `);
};

window.submitStudentNotify = function(ticketId) {
  const msg = document.getElementById('notify-msg')?.value.trim();
  stateService.notifyTicketManagement(ticketId, msg);
  closeModal();
  showToast('📢', `Management alerted for ${ticketId}. Facilities supervisor has received the SMS ping.`, 'success');
  const content = document.getElementById('main-content');
  if (content) renderMaintenanceView(content);
};

window.openStaffResolveModal = function(ticketId) {
  openModal(`Resolve Ticket — ${ticketId}`, `
    <div class="f-group">
      <label class="f-label" for="res-notes">Resolution Work Details <span class="f-required">*</span></label>
      <textarea class="f-input" id="res-notes" placeholder="Describe the parts replaced, technician sign-off, and testing conducted..." rows="3" required></textarea>
    </div>

    <div style="display:flex;gap:10px;justify-content:flex-end">
      <button class="btn btn-ghost" onclick="window.closeModal()">Cancel</button>
      <button class="btn btn-success" onclick="window.confirmStaffResolve('${ticketId}')">Mark as Completed</button>
    </div>
  `);
};

window.confirmStaffResolve = function(ticketId) {
  const notes = document.getElementById('res-notes')?.value.trim();
  if (!notes) {
    showToast('⚠', 'Please enter a resolution note.', 'error');
    return;
  }
  stateService.resolveTicket(ticketId, notes);
  closeModal();
  showToast('✓', `Ticket ${ticketId} resolved and logged in audit trail.`, 'success');
  const content = document.getElementById('main-content');
  if (content) renderMaintenanceView(content);
};

window.notifyStudentUpdate = function(studentName, ticketId) {
  showToast('📧', `Automated SMS & email progress update dispatched to ${studentName} for ticket ${ticketId}.`, 'info');
};

window.openStaffNewTicketModal = function() {
  openModal('Dispatch New Facilities Work Order', `
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
  `);
};

window.submitStaffJobOrder = function() {
  const loc = document.getElementById('ord-loc')?.value || 'Common Area';
  const cat = document.getElementById('ord-cat')?.value || 'Plumbing';
  const desc = document.getElementById('ord-desc')?.value || 'Maintenance job';

  stateService.addTicket({
    title: `${cat} Work Order: ${loc}`,
    location: loc,
    residence: 'GKAS Residence',
    priority: 'medium',
    category: cat,
    studentName: 'Facilities Staff',
    studentId: 'FAC-01',
    description: desc
  });

  closeModal();
  showToast('✓', 'Work order generated and assigned to technician.', 'success');
  const content = document.getElementById('main-content');
  if (content) renderMaintenanceView(content);
};
