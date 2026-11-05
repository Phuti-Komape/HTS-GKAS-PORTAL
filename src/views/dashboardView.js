/* ═══════════════════════════════════════════════════════════
   DASHBOARD VIEW (EXECUTIVE & STUDENT)
   - Student view: Completely clean with balance paid removed!
   - Admin view: Comprehensive residence operations & analytics
═══════════════════════════════════════════════════════════ */

import { stateService } from '../services/state.js';
import { showToast } from '../components/toast.js';

export function renderDashboardView(container) {
  const { currentRole } = stateService.state;

  if (currentRole === 'student') {
    renderStudentDashboard(container);
  } else {
    renderAdminDashboard(container);
  }
}

// ─── STUDENT DASHBOARD (BALANCE PAID REMOVED) ───
function renderStudentDashboard(container) {
  const { currentUser, tickets, notices } = stateService.state;
  const user = currentUser || {};
  const myTickets = tickets.filter(t => (user.studentNumber && t.studentId === user.studentNumber) || (user.name && t.studentName === user.name));

  container.innerHTML = `
    <!-- Student Hero Card (NO BALANCE PAID) -->
    <div class="student-hero" role="region" aria-label="Student Information">
      <div class="sh-inner">
        <div class="sh-badge">Accredited Resident · 2027 Academic Year</div>
        <div class="sh-name">Sawubona, ${(user.name || 'Resident').split(' ')[0]}.</div>
        <div class="sh-room">Room ${user.room || 'Pending'} (${user.bed || 'Bed A'}) · ${user.residence || 'GKAS Residence'} · ${user.institution || 'Accredited Institution'}</div>
        
        <div class="sh-stats">
          <div class="sh-stat">
            <div class="sh-stat-val">${user.room || 'Pending'}</div>
            <div class="sh-stat-lbl">Allocated Room</div>
          </div>
          <div class="sh-stat">
            <div class="sh-stat-val">${user.funding || 'NSFAS Accredited'}</div>
            <div class="sh-stat-lbl">Funding Status</div>
          </div>
          <div class="sh-stat">
            <div class="sh-stat-val">${user.leaseEnd || '30 Nov 2027'}</div>
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
          ${notices.slice(0, 3).map(n => `
            <div style="display:flex;gap:12px;align-items:flex-start;padding:12px 0;border-bottom:1px solid var(--border-subtle)">
              <span style="font-size:20px;flex-shrink:0">${n.icon}</span>
              <div style="flex:1;min-width:0">
                <div style="font-weight:600;font-size:13px;color:var(--navy)">${n.title}</div>
                <div style="font-size:11px;color:var(--text-sub);margin-top:2px">${n.date} · ${n.residence}</div>
              </div>
              ${n.severity === 'urgent' ? '<span class="pill pill-red">Urgent</span>' : ''}
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- Student Maintenance Requests & Notify -->
    <div class="card">
      <div class="card-title">
        My Active Maintenance Requests
        <button class="btn btn-primary btn-sm" onclick="stateService.setActiveModule('maintenance')">+ New Request</button>
      </div>
      
      ${myTickets.length === 0 ? `
        <p style="font-size:13px;color:var(--text-sub);padding:12px 0">You currently have no open maintenance tickets.</p>
      ` : `
        <div style="display:flex;flex-direction:column;gap:10px">
          ${myTickets.map(t => `
            <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 16px;background:var(--bg-alt);border:1px solid var(--border);border-radius:var(--radius-md);gap:12px;flex-wrap:wrap">
              <div style="display:flex;align-items:center;gap:12px">
                <div style="width:38px;height:38px;border-radius:var(--radius-sm);background:${t.bg};display:flex;align-items:center;justify-content:center;font-size:18px">${t.icon}</div>
                <div>
                  <div style="font-weight:600;font-size:13px;color:var(--navy)">${t.title}</div>
                  <div style="font-size:11px;color:var(--text-sub)" class="td-mono">${t.id} · ${t.location} · ${t.category}</div>
                </div>
              </div>

              <div style="display:flex;align-items:center;gap:10px">
                <span class="pill ${t.status === 'resolved' ? 'pill-green' : t.priority === 'urgent' ? 'pill-red' : 'pill-amber'}">
                  ${t.status === 'resolved' ? 'Resolved' : t.priority.toUpperCase()}
                </span>
                ${t.status === 'open' ? `
                  <button class="btn btn-gold btn-xs" onclick="window.handleNotifyMaintenance('${t.id}')">
                    📢 Notify Management
                  </button>
                ` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `;
}

// ─── ADMIN / STAFF DASHBOARD ───
function renderAdminDashboard(container) {
  const { tickets, applicants, residences, auditLog } = stateService.state;

  const pendingApps = applicants.filter(a => !a.processed).length;
  const urgentTickets = tickets.filter(t => t.status === 'open' && t.priority === 'urgent').length;
  const openTickets = tickets.filter(t => t.status === 'open').length;

  container.innerHTML = `
    <!-- Action Queue Banner -->
    <div class="card" style="background:#ffffff;border-left:5px solid var(--navy);margin-bottom:22px">
      <div style="font-size:11px;font-weight:700;color:var(--text-sub);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:12px">Operations Queue &amp; Action Items</div>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn btn-ghost btn-sm" onclick="stateService.setActiveModule('applications')">
          <span>📋</span> Applications Awaiting Review
          <span class="pill pill-amber" style="margin-left:4px">${pendingApps}</span>
        </button>
        <button class="btn btn-ghost btn-sm" onclick="stateService.setActiveModule('maintenance')">
          <span>🚨</span> Urgent Maintenance Requests
          <span class="pill ${urgentTickets > 0 ? 'pill-red' : 'pill-green'}" style="margin-left:4px">${urgentTickets}</span>
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
        <div class="stat-val">${openTickets}</div>
        <div class="stat-bar"><div class="stat-fill" style="width:35%;background:var(--red)"></div></div>
        <div class="stat-sub ${urgentTickets > 0 ? 'down' : ''}">
          ${urgentTickets > 0 ? `▲ ${urgentTickets} Urgent priority` : '✓ No urgent emergencies'}
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
          ${Array.from({ length: 88 }, (_, i) => `
            <div style="height:12px;border-radius:2px;background:${i < 76 ? (i === 30 || i === 44 ? 'var(--gold)' : 'var(--navy)') : '#e2e8f0'}" title="Bed ${i + 1}: ${i < 76 ? (i === 30 || i === 44 ? 'Maintenance' : 'Occupied') : 'Available'}"></div>
          `).join('')}
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
          ${Array.from({ length: 20 }, (_, i) => `
            <div style="height:12px;border-radius:2px;background:${i < 16 ? (i === 6 ? 'var(--gold)' : 'var(--navy)') : '#e2e8f0'}" title="Bed ${i + 1}: ${i < 16 ? (i === 6 ? 'Maintenance' : 'Occupied') : 'Available'}"></div>
          `).join('')}
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
        ${auditLog.slice(0, 4).map(a => `
          <div style="display:flex;gap:12px;align-items:center;padding:10px 0;border-bottom:1px solid var(--border-subtle)">
            <div style="width:34px;height:34px;border-radius:var(--radius-sm);background:${a.bg};display:flex;align-items:center;justify-content:center;font-size:16px">${a.type}</div>
            <div style="flex:1;min-width:0">
              <div style="font-weight:600;font-size:13px;color:var(--navy)">${a.action}</div>
              <div style="font-size:11px;color:var(--text-sub)" class="td-mono">${a.meta}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// Window helper for student ticket notification
window.handleNotifyMaintenance = function(ticketId) {
  stateService.notifyTicketManagement(ticketId, 'Student requested an urgent status update via portal');
  showToast('📢', `Facilities manager and warden notified for ticket ${ticketId}. Alert sent via SMS & dashboard.`, 'success');
};
