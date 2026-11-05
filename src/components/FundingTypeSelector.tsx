/* ═══════════════════════════════════════════════════════════
   FUNDING TYPE SELECTOR COMPONENT (TSX / Web Component)
   Segmented card selector with conditional fields & dynamic helper text
   for NSFAS, External Bursary, Self-Funded, and Bank Student Loans
═══════════════════════════════════════════════════════════ */

export interface FundingFormData {
  fundingType: 'nsfas' | 'external_bursary' | 'self_funded' | 'student_loan';
  bursarySponsorName: string;
  fundingReferenceNumber: string;
  guardianName: string;
  guardianContact: string;
  agreementAccepted: boolean;
  proofDocumentAttached: boolean;
  proofDocumentName?: string;
}

export function renderFundingTypeSelector(
  containerId: string,
  initialData: Partial<FundingFormData> = {},
  onChange?: (data: FundingFormData) => void
) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const current: FundingFormData = {
    fundingType: initialData.fundingType || 'nsfas',
    bursarySponsorName: initialData.bursarySponsorName || '',
    fundingReferenceNumber: initialData.fundingReferenceNumber || '',
    guardianName: initialData.guardianName || '',
    guardianContact: initialData.guardianContact || '',
    agreementAccepted: initialData.agreementAccepted ?? true,
    proofDocumentAttached: initialData.proofDocumentAttached || false,
    proofDocumentName: initialData.proofDocumentName || ''
  };

  function update() {
    render();
    if (onChange) onChange(current);
  }

  function render() {
    container.innerHTML = `
      <div class="funding-selector-wrap">
        <label class="f-label" style="margin-bottom:8px">
          Select Funding Mechanism <span class="f-required">*</span>
        </label>
        
        <!-- Segmented 4-Card Option Grid -->
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:10px;margin-bottom:16px">
          
          <!-- Option 1: NSFAS -->
          <div class="funding-card ${current.fundingType === 'nsfas' ? 'selected' : ''}" 
               onclick="window.selectFundingOption('nsfas')"
               style="cursor:pointer;border:2px solid ${current.fundingType === 'nsfas' ? 'var(--blue)' : 'var(--border)'};background:${current.fundingType === 'nsfas' ? '#f0f7ff' : 'var(--bg-alt)'};border-radius:var(--radius-md);padding:14px;transition:all 0.15s ease">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
              <span style="font-size:20px">🏛️</span>
              <strong style="color:var(--navy);font-size:13px">NSFAS Direct</strong>
            </div>
            <p style="font-size:11px;color:var(--text-sub);margin:0;line-height:1.4">Requires myNSFAS status screenshot or provisionally funded letter.</p>
          </div>

          <!-- Option 2: External Bursary -->
          <div class="funding-card ${current.fundingType === 'external_bursary' ? 'selected' : ''}" 
               onclick="window.selectFundingOption('external_bursary')"
               style="cursor:pointer;border:2px solid ${current.fundingType === 'external_bursary' ? 'var(--blue)' : 'var(--border)'};background:${current.fundingType === 'external_bursary' ? '#f0f7ff' : 'var(--bg-alt)'};border-radius:var(--radius-md);padding:14px;transition:all 0.15s ease">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
              <span style="font-size:20px">💼</span>
              <strong style="color:var(--navy);font-size:13px">External Bursary</strong>
            </div>
            <p style="font-size:11px;color:var(--text-sub);margin:0;line-height:1.4">Corporate, Mining, or Provincial Government Bursary scheme.</p>
          </div>

          <!-- Option 3: Self-Funded / Private -->
          <div class="funding-card ${current.fundingType === 'self_funded' ? 'selected' : ''}" 
               onclick="window.selectFundingOption('self_funded')"
               style="cursor:pointer;border:2px solid ${current.fundingType === 'self_funded' ? 'var(--blue)' : 'var(--border)'};background:${current.fundingType === 'self_funded' ? '#f0f7ff' : 'var(--bg-alt)'};border-radius:var(--radius-md);padding:14px;transition:all 0.15s ease">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
              <span style="font-size:20px">👨‍👩‍👧</span>
              <strong style="color:var(--navy);font-size:13px">Self-Funded / Private</strong>
            </div>
            <p style="font-size:11px;color:var(--text-sub);margin:0;line-height:1.4">Parent, Guardian, or Self-paying monthly tenant fee.</p>
          </div>

          <!-- Option 4: Bank Student Loan -->
          <div class="funding-card ${current.fundingType === 'student_loan' ? 'selected' : ''}" 
               onclick="window.selectFundingOption('student_loan')"
               style="cursor:pointer;border:2px solid ${current.fundingType === 'student_loan' ? 'var(--blue)' : 'var(--border)'};background:${current.fundingType === 'student_loan' ? '#f0f7ff' : 'var(--bg-alt)'};border-radius:var(--radius-md);padding:14px;transition:all 0.15s ease">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
              <span style="font-size:20px">🏦</span>
              <strong style="color:var(--navy);font-size:13px">Bank Student Loan</strong>
            </div>
            <p style="font-size:11px;color:var(--text-sub);margin:0;line-height:1.4">Fundi, Standard Bank, ABSA, Nedbank, FNB, etc.</p>
          </div>
        </div>

        <!-- Dynamic Contextual Helper Notice -->
        <div style="margin-bottom:16px;padding:12px 14px;border-radius:var(--radius-sm);font-size:12px;display:flex;gap:10px;align-items:flex-start;${
          current.fundingType === 'nsfas' 
            ? 'background:#ecfdf5;border:1px solid #a7f3d0;color:#065f46'
            : current.fundingType === 'external_bursary'
            ? 'background:#eff6ff;border:1px solid #bfdbfe;color:#1e40af'
            : current.fundingType === 'self_funded'
            ? 'background:#fffbeb;border:1px solid #fde68a;color:#92400e'
            : 'background:#faf5ff;border:1px solid #e9d5ff;color:#6b21a8'
        }">
          <span style="font-size:16px">ℹ️</span>
          <div>
            ${
              current.fundingType === 'nsfas'
                ? '<strong>NSFAS Accreditation Check:</strong> Accommodation allowance approval will be automatically cross-verified against the DHET/institution residence quota for the 2027 academic year.'
                : current.fundingType === 'external_bursary'
                ? '<strong>Bursary Verification Protocol:</strong> Provide an official award letter containing the financial administrator contact and confirmation of accommodation payment coverage.'
                : current.fundingType === 'self_funded'
                ? '<strong>Private Tenancy Terms:</strong> Requires verifiable parent or guarantor South African contact details and agreement to the monthly billing schedule due on the 1st of each calendar month.'
                : '<strong>Student Loan Disbursement:</strong> Upload pre-approval or sanction letter specifying accommodation disbursement to HTS &amp; GKAS Student Residences.'
            }
          </div>
        </div>

        <!-- Conditional Fields Based On Selected Funding Type -->
        <div class="conditional-fields-box" style="background:var(--bg-alt);border:1px solid var(--border);border-radius:var(--radius-md);padding:16px;margin-bottom:16px">
          ${renderConditionalInputs(current)}
        </div>
      </div>
    `;
  }

  function renderConditionalInputs(d: FundingFormData): string {
    switch (d.fundingType) {
      case 'nsfas':
        return `
          <div class="f-group" style="margin-bottom:12px">
            <label class="f-label" for="nsfas-ref-input">myNSFAS Application Reference (Optional if known)</label>
            <input class="f-input td-mono" type="text" id="nsfas-ref-input" 
                   placeholder="e.g. NSFAS-2027-MP-9012" value="${d.fundingReferenceNumber}"
                   oninput="window.handleFundingInputChange('fundingReferenceNumber', this.value)">
            <span class="f-hint">If your 2027 funding is already provisionally approved, provide your myNSFAS reference number.</span>
          </div>
        `;

      case 'external_bursary':
        return `
          <div class="f-row" style="margin-bottom:12px">
            <div class="f-group">
              <label class="f-label" for="bursary-sponsor-input">Bursary / Corporate Sponsor Name <span class="f-required">*</span></label>
              <input class="f-input" type="text" id="bursary-sponsor-input" 
                     placeholder="e.g. Sasol Foundation, Glencore, Mpumalanga Provincial Bursary" 
                     value="${d.bursarySponsorName}"
                     oninput="window.handleFundingInputChange('bursarySponsorName', this.value)">
            </div>
            <div class="f-group">
              <label class="f-label" for="bursary-ref-input">Contract / Student Bursary Reference <span class="f-required">*</span></label>
              <input class="f-input td-mono" type="text" id="bursary-ref-input" 
                     placeholder="e.g. BUR-SAS-2027-042" 
                     value="${d.fundingReferenceNumber}"
                     oninput="window.handleFundingInputChange('fundingReferenceNumber', this.value)">
            </div>
          </div>
        `;

      case 'self_funded':
        return `
          <div class="f-row" style="margin-bottom:12px">
            <div class="f-group">
              <label class="f-label" for="guardian-name-input">Parent / Sponsor Full Name <span class="f-required">*</span></label>
              <input class="f-input" type="text" id="guardian-name-input" 
                     placeholder="e.g. Sipho Nkosi" 
                     value="${d.guardianName}"
                     oninput="window.handleFundingInputChange('guardianName', this.value)">
            </div>
            <div class="f-group">
              <label class="f-label" for="guardian-contact-input">Parent / Sponsor Mobile Number <span class="f-required">*</span></label>
              <input class="f-input td-mono" type="tel" id="guardian-contact-input" 
                     placeholder="e.g. 082 345 6789" 
                     value="${d.guardianContact}"
                     oninput="window.handleFundingInputChange('guardianContact', this.value)">
            </div>
          </div>

          <label class="f-checkbox" style="font-size:12px">
            <input type="checkbox" id="funding-agreement-chk" ${d.agreementAccepted ? 'checked' : ''}
                   onchange="window.handleFundingInputChange('agreementAccepted', this.checked)">
            <span>I and my guarantor agree to pay the monthly rental fee (R3,200 GKAS / R3,400 HTS) on or before the 1st of each calendar month.</span>
          </label>
        `;

      case 'student_loan':
        return `
          <div class="f-row" style="margin-bottom:12px">
            <div class="f-group">
              <label class="f-label" for="loan-bank-input">Student Loan Financier Name <span class="f-required">*</span></label>
              <input class="f-input" type="text" id="loan-bank-input" 
                     placeholder="e.g. Fundi Student Loans / Standard Bank Student Loan" 
                     value="${d.bursarySponsorName}"
                     oninput="window.handleFundingInputChange('bursarySponsorName', this.value)">
            </div>
            <div class="f-group">
              <label class="f-label" for="loan-ref-input">Loan Approval Quotation Ref <span class="f-required">*</span></label>
              <input class="f-input td-mono" type="text" id="loan-ref-input" 
                     placeholder="e.g. FND-2027-QUO-819" 
                     value="${d.fundingReferenceNumber}"
                     oninput="window.handleFundingInputChange('fundingReferenceNumber', this.value)">
            </div>
          </div>
        `;
    }
  }

  // Bind global window helpers for DOM interaction
  (window as any).selectFundingOption = (type: FundingFormData['fundingType']) => {
    current.fundingType = type;
    update();
  };

  (window as any).handleFundingInputChange = (key: keyof FundingFormData, value: any) => {
    (current as any)[key] = value;
    if (onChange) onChange(current);
  };

  render();
}
