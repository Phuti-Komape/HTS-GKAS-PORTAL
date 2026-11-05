/* ═══════════════════════════════════════════════════════════
   PORTAL TYPES & CONTRACT DEFINITIONS
   Supabase / PostgreSQL Schema Mapping, Application Lifecycles,
   Funding Validation, and Client-Side Verification Schemas
═══════════════════════════════════════════════════════════ */

export type FundingType = 'nsfas' | 'external_bursary' | 'self_funded' | 'student_loan';
export type FundingVerificationStatus = 'pending_verification' | 'verified' | 'rejected';
export type DocumentValidationStatus = 'processing' | 'valid' | 'flagged_mismatch' | 'tampered' | 'rejected';
export type ApplicationStatus = 'pending' | 'under_review' | 'approved' | 'rejected' | 'waitlisted';
export type NotificationType = 'info' | 'success' | 'warning' | 'action_required' | 'urgent';

export interface Institution {
  id: string;
  name: string;
  short_name: string;
  type: 'Public University' | 'TVET' | 'Private';
  campus?: string;
  province?: string;
  is_active: boolean;
}

export interface ApplicationDocument {
  id: string;
  application_id: string;
  document_type: 'id_copy' | 'proof_of_registration' | 'funding_letter' | 'lease_agreement';
  file_url: string;
  file_name: string;
  file_size_bytes: number;
  mime_type: string;
  validation_status: DocumentValidationStatus;
  validation_notes: {
    name_match?: boolean;
    id_match?: boolean;
    institution_match?: boolean;
    academic_year_match?: boolean;
    metadata_producer?: string;
    tamper_risk?: 'low' | 'medium' | 'high';
    extracted_id?: string;
    extracted_name?: string;
    extracted_student_number?: string;
    confidence_score?: number;
    details?: string;
  };
  extracted_text?: string;
  tamper_score?: number;
  verified_at?: string;
  verified_by?: string;
  created_at: string;
}

export interface Application {
  id: string;
  user_id?: string;
  academic_year: number; // default 2027
  reference_number: string; // e.g. GKAS-2027-10492
  first_name: string;
  last_name: string;
  id_number: string;
  dob: string;
  gender: 'Male' | 'Female';
  is_citizen: boolean;
  email: string;
  phone: string;
  is_phone_verified: boolean;
  is_email_verified: boolean;
  
  // Institution details
  institution_id?: string;
  institution?: Institution;
  is_other_institution: boolean;
  other_institution_name?: string;
  other_institution_campus?: string;
  student_number: string;
  year_of_study?: string;

  // Residence preference
  preferred_residence: string;
  room_type: string;

  // Structured Funding
  funding_type: FundingType;
  funding_status: FundingVerificationStatus;
  bursary_sponsor_name?: string;
  funding_reference_number?: string;
  proof_of_funding_url?: string;
  guardian_name?: string;
  guardian_contact?: string;
  funding_agreement_agreed?: boolean;
  funding_verified_at?: string;
  funding_verified_by?: string;
  funding_rejection_reason?: string;

  // Documents
  documents: ApplicationDocument[];

  // Lifecycle
  status: ApplicationStatus;
  background_check: 'pending' | 'clear' | 'flagged';
  decision?: 'accepted' | 'declined';
  decision_reason?: string;
  decided_by?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at?: string;
}

export interface StudentNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  link_url?: string;
  is_read: boolean;
  read_at?: string;
  created_at: string;
}

/* ═══════════════════════════════════════════════════════════
   LIGHTWEIGHT ZOD-EQUIVALENT CLIENT VALIDATOR
   Enforces required fields conditionally without bundle bloat
═══════════════════════════════════════════════════════════ */

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export class ApplicationValidator {
  static validateFunding(data: Partial<Application>): ValidationResult {
    const errors: Record<string, string> = {};

    if (!data.funding_type) {
      errors.funding_type = 'Funding type is required.';
      return { isValid: false, errors };
    }

    switch (data.funding_type) {
      case 'nsfas':
        if (!data.id_number || data.id_number.length !== 13) {
          errors.id_number = 'A valid 13-digit South African ID is required for NSFAS DHET cross-check.';
        }
        if (!data.proof_of_funding_url && !data.funding_reference_number) {
          errors.proof_of_funding_url = 'Mandatory myNSFAS status letter or application ref is required.';
        }
        break;

      case 'external_bursary':
        if (!data.bursary_sponsor_name || data.bursary_sponsor_name.trim().length < 2) {
          errors.bursary_sponsor_name = 'Official corporate or provincial bursary sponsor name is required.';
        }
        if (!data.funding_reference_number || data.funding_reference_number.trim().length < 3) {
          errors.funding_reference_number = 'Bursary award/contract reference number is required.';
        }
        if (!data.proof_of_funding_url) {
          errors.proof_of_funding_url = 'Official bursary award letter (PDF/PNG) must be uploaded.';
        }
        break;

      case 'self_funded':
        if (!data.guardian_name || data.guardian_name.trim().length < 2) {
          errors.guardian_name = 'Parent or financial sponsor full name is required.';
        }
        if (!data.guardian_contact || !/^(?:\+27|0)[6-8]\d{8}$/.test(data.guardian_contact.replace(/\s+/g, ''))) {
          errors.guardian_contact = 'Valid South African contact number for sponsor/parent is required.';
        }
        if (!data.funding_agreement_agreed) {
          errors.funding_agreement_agreed = 'Parent/Sponsor agreement to residence payment schedule is required.';
        }
        break;

      case 'student_loan':
        if (!data.bursary_sponsor_name || data.bursary_sponsor_name.trim().length < 2) {
          errors.bursary_sponsor_name = 'Financial institution / bank name is required (e.g. Standard Bank, Fundi).';
        }
        if (!data.proof_of_funding_url) {
          errors.proof_of_funding_url = 'Bank student loan pre-approval letter must be uploaded.';
        }
        break;
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}
