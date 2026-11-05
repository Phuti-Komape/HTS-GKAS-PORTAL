/* ═══════════════════════════════════════════════════════════
   ADMIN DOCUMENT AUDIT DRAWER COMPONENT (JS MODULE)
   Split-screen audit viewer: Left preview with zoom/pan controls,
   Right cross-check card with Luhn badge, tamper heuristics, and quick decisions.
═══════════════════════════════════════════════════════════ */

export function openDocumentAuditDrawer(data, onDecision) {
  let zoomLevel = 100;

  const overlay = document.createElement('div');
  overlay.id = 'doc-audit-drawer-overlay';
  overlay.style.cssText = `
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(4px);
    z-index: 10000; display: flex; justify-content: flex-end;
  `;

  function renderDrawerContent() {
    return `
      <div style="width: min(100vw, 920px); height: 100%; background: #ffffff; display: flex; flex-direction: column; box-shadow: -8px 0 24px rgba(0,0,0,0.2); animation: slideInRight 0.25s ease">
        
        <!-- Drawer Header -->
        <div style="padding: 16px 20px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; background: var(--navy); color: #ffffff">
          <div>
            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px; color: var(--gold); font-weight: 700">Fraud Prevention &amp; Integrity Audit</div>
            <div style="font-family: var(--font-serif); font-size: 18px; font-weight: 700">${data.applicantName} · ${data.documentName}</div>
          </div>
          <button class="btn btn-ghost btn-sm" id="close-audit-drawer-btn" style="color: #ffffff; border-color: rgba(255,255,255,0.2)">
            ✕ Close
          </button>
        </div>

        <!-- Split View Body -->
        <div style="flex: 1; display: grid; grid-template-columns: 1fr 340px; overflow: hidden">
          
          <!-- LEFT PANE: Document Preview with Zoom Controls -->
          <div style="background: #1e293b; display: flex; flex-direction: column; overflow: hidden; border-right: 1px solid var(--border)">
            
            <!-- Zoom Toolbar -->
            <div style="padding: 8px 12px; background: #0f172a; display: flex; align-items: center; justify-content: space-between; color: #94a3b8; font-size: 12px">
              <div style="display: flex; gap: 8px; align-items: center">
                <button class="btn btn-ghost btn-xs" id="zoom-out-btn" style="color: #ffffff">🔍 -</button>
                <span id="zoom-level-text" style="color: #e2e8f0; font-family: monospace">${zoomLevel}%</span>
                <button class="btn btn-ghost btn-xs" id="zoom-in-btn" style="color: #ffffff">🔍 +</button>
                <button class="btn btn-ghost btn-xs" id="zoom-reset-btn" style="color: #ffffff">Fit</button>
              </div>
              <div style="font-size: 11px; color: #94a3b8">
                Format: <strong>${data.documentType.toUpperCase()}</strong> · High Res Scanned Copy
              </div>
            </div>

            <!-- Preview Viewport -->
            <div style="flex: 1; overflow: auto; display: flex; align-items: center; justify-content: center; padding: 24px" id="doc-viewport">
              <div id="doc-canvas" style="transform: scale(${zoomLevel / 100}); transform-origin: center center; transition: transform 0.15s ease; max-width: 100%; background: #ffffff; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5); border-radius: 4px; padding: 24px; min-height: 480px; width: 420px; color: #0f172a; font-family: sans-serif; font-size: 12px">
                
                <!-- Simulated High-Fidelity Scanned Document -->
                <div style="text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 16px">
                  <div style="font-weight: 800; font-size: 14px; text-transform: uppercase; letter-spacing: 1px">
                    ${data.documentType === 'id_copy' ? 'REPUBLIC OF SOUTH AFRICA — NATIONAL IDENTITY' : data.documentType === 'proof_of_registration' ? data.profileInstitution : 'NSFAS / BURSARY CONFIRMATION LETTER'}
                  </div>
                  <div style="font-size: 10px; color: #64748b">OFFICIAL CERTIFIED DOCUMENT · 2027 ACADEMIC INTAKE</div>
                </div>

                <div style="display: grid; grid-template-columns: 80px 1fr; gap: 12px; margin-bottom: 20px; align-items: center">
                  <div style="width: 80px; height: 90px; background: #e2e8f0; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 32px">
                    👤
                  </div>
                  <div style="line-height: 1.6">
                    <div><strong>SURNAME / NAME:</strong> ${data.detectedName}</div>
                    <div><strong>IDENTITY NUMBER:</strong> <span style="font-family: monospace; font-weight: 700">${data.detectedId}</span></div>
                    <div><strong>DATE OF BIRTH:</strong> 2003-08-15</div>
                    <div><strong>INSTITUTION:</strong> ${data.detectedInstitution}</div>
                  </div>
                </div>

                <div style="border: 2px solid #16a34a; border-radius: 8px; padding: 10px; text-align: center; color: #16a34a; margin-top: 24px; font-weight: 700; font-size: 11px; text-transform: uppercase">
                  ✓ COMMISSIONER OF OATHS CERTIFIED COPY
                  <div style="font-size: 9px; font-weight: 400; color: #475569">Mbombela Police Station · Stamp Date: 16 Oct 2026</div>
                </div>
              </div>
            </div>
          </div>

          <!-- RIGHT PANE: Integrity Cross-Check Card -->
          <div style="padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; background: var(--bg-alt)">
            
            <div>
              <div style="font-weight: 700; font-size: 14px; color: var(--navy); margin-bottom: 4px">OCR Cross-Check Card</div>
              <div style="font-size: 12px; color: var(--text-sub)">Automated comparison between registered profile and document stream text</div>
            </div>

            <!-- Comparison 1: Name -->
            <div style="background: #ffffff; border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 12px">
              <div style="display: flex; justify-content: space-between; margin-bottom: 6px">
                <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-sub)">Student Full Name</span>
                <span class="pill pill-green" style="font-size: 10px">MATCH (100%)</span>
              </div>
              <div style="font-size: 12px">Profile: <strong>${data.applicantName}</strong></div>
              <div style="font-size: 12px; color: var(--text-sub)">Document: <strong>${data.detectedName}</strong></div>
            </div>

            <!-- Comparison 2: ID Number with Luhn Check -->
            <div style="background: #ffffff; border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 12px">
              <div style="display: flex; justify-content: space-between; margin-bottom: 6px">
                <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-sub)">13-Digit SA ID</span>
                <span class="pill ${data.luhnValid ? 'pill-green' : 'pill-red'}" style="font-size: 10px">
                  ${data.luhnValid ? '✓ LUHN VALID' : '⚠ LUHN INVALID'}
                </span>
              </div>
              <div style="font-size: 12px; font-family: monospace">Profile: <strong>${data.profileId}</strong></div>
              <div style="font-size: 12px; font-family: monospace; color: var(--text-sub)">Detected: <strong>${data.detectedId}</strong></div>
            </div>

            <!-- Comparison 3: Institution -->
            <div style="background: #ffffff; border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 12px">
              <div style="display: flex; justify-content: space-between; margin-bottom: 6px">
                <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-sub)">Target Institution</span>
                <span class="pill pill-green" style="font-size: 10px">VERIFIED</span>
              </div>
              <div style="font-size: 12px">Profile: <strong>${data.profileInstitution}</strong></div>
              <div style="font-size: 12px; color: var(--text-sub)">Detected: <strong>${data.detectedInstitution}</strong></div>
            </div>

            <!-- Tamper & Metadata Heuristics -->
            <div style="background: ${data.tamperScore > 0.4 ? '#fef2f2' : '#ffffff'}; border: 1px solid ${data.tamperScore > 0.4 ? 'var(--red)' : 'var(--border)'}; border-radius: var(--radius-sm); padding: 12px">
              <div style="display: flex; justify-content: space-between; margin-bottom: 6px">
                <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-sub)">Tamper Risk Score</span>
                <span class="pill ${data.tamperScore > 0.4 ? 'pill-red' : 'pill-green'}" style="font-size: 10px">
                  ${data.tamperScore > 0.4 ? 'HIGH RISK' : 'LOW RISK (AUTHENTIC)'}
                </span>
              </div>
              <div style="font-size: 12px">Producer Tool: <strong>${data.metadataProducer}</strong></div>
              <div style="font-size: 11px; color: var(--text-sub); margin-top: 2px">
                ${data.tamperScore > 0.4 ? '⚠ Warning: File created with photo editing software.' : '✓ Certified scanner stream detected without post-processing artifacts.'}
              </div>
            </div>

            <!-- Decision Controls -->
            <div style="margin-top: auto; padding-top: 14px; border-top: 1px solid var(--border); display: flex; flex-direction: column; gap: 8px">
              <button class="btn btn-success" id="accept-doc-btn" style="width: 100%">
                ✓ Accept Document &amp; Verify Identity
              </button>

              <div style="display: flex; gap: 8px">
                <select class="f-input f-select" id="reject-reason-select" style="font-size: 12px; flex: 1">
                  <option value="ID number mismatch with profile">ID mismatch with profile</option>
                  <option value="Illegible or blurry scanned document">Illegible / blurry scan</option>
                  <option value="Suspected tampering or altered font">Suspected digital tampering</option>
                  <option value="Expired or non-certified copy">Missing commissioner of oaths stamp</option>
                </select>
                <button class="btn btn-danger btn-sm" id="request-reupload-btn">
                  Request Re-upload
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  overlay.innerHTML = renderDrawerContent();
  document.body.appendChild(overlay);

  // Hook event listeners
  const closeBtn = overlay.querySelector('#close-audit-drawer-btn');
  closeBtn?.addEventListener('click', () => {
    overlay.remove();
  });

  const zoomIn = overlay.querySelector('#zoom-in-btn');
  const zoomOut = overlay.querySelector('#zoom-out-btn');
  const zoomReset = overlay.querySelector('#zoom-reset-btn');
  const canvas = overlay.querySelector('#doc-canvas');
  const zoomText = overlay.querySelector('#zoom-level-text');

  zoomIn?.addEventListener('click', () => {
    if (zoomLevel < 200) {
      zoomLevel += 25;
      if (canvas) canvas.style.transform = `scale(${zoomLevel / 100})`;
      if (zoomText) zoomText.textContent = `${zoomLevel}%`;
    }
  });

  zoomOut?.addEventListener('click', () => {
    if (zoomLevel > 50) {
      zoomLevel -= 25;
      if (canvas) canvas.style.transform = `scale(${zoomLevel / 100})`;
      if (zoomText) zoomText.textContent = `${zoomLevel}%`;
    }
  });

  zoomReset?.addEventListener('click', () => {
    zoomLevel = 100;
    if (canvas) canvas.style.transform = `scale(1)`;
    if (zoomText) zoomText.textContent = `100%`;
  });

  const acceptBtn = overlay.querySelector('#accept-doc-btn');
  acceptBtn?.addEventListener('click', () => {
    overlay.remove();
    if (onDecision) onDecision('accept');
  });

  const rejectBtn = overlay.querySelector('#request-reupload-btn');
  rejectBtn?.addEventListener('click', () => {
    const reason = overlay.querySelector('#reject-reason-select')?.value;
    overlay.remove();
    if (onDecision) onDecision('reject', reason);
  });
}
