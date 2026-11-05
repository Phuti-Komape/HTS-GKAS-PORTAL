# HTS & GKAS Student Residence Portal Application

An elevated, modern, mobile-first web application designed for accredited South African student housing operations at **GKAS Residence (Sonheuwel — 88 beds)** and **HTS Residence (Stonehenge — 20 beds)** in Mbombela / Nelspruit, Mpumalanga.

---

## Key Customizations Implemented

1. **myNSFAS Student/Housing Portal Registration System**:
   - 5-step registration flow directly on the authentication page:
     - **Step 1**: 13-digit South African ID number with real-time Luhn algorithm validation, automatic DOB and gender derivation, and full legal name capture.
     - **Step 2**: South African cellphone number with SMS OTP verification simulation, institutional email, and secure password criteria.
     - **Step 3**: Academic institution selection (TUT Nelspruit, UMP, TVET), student registration number, year of study, and NSFAS funding scheme reference.
     - **Step 4**: Residence and room allocation preference (GKAS Sonheuwel vs HTS Stonehenge, Single vs Double Sharing) and certified document upload check (ID copy, Proof of Registration, NSFAS bursary letter).
     - **Step 5**: Statutory POPIA (Protection of Personal Information Act) compliance declaration and residence rules consent, generating a unique tracking reference (e.g. `APP-2026-XXXX`).
   - **Track My Application**: Quick lookup tool for prospective students to check their real-time accreditation and placement progress.

2. **Student Dashboard Cleanup**:
   - Completely removed all balance paid, account balance, and billing statistics from the student dashboard view.
   - Clean, student-focused hero card with room allocation, funding scheme, and lease expiration date.

3. **Complete Removal of Student Payments Page**:
   - Removed the "My Payments" page and navigation item from the student portal entirely.
   - Retained the financial ledger and reconciliations exclusively for accredited staff in the "Finance & Reports" module.

4. **Maintenance Page (Student Side)**:
   - Students can **only** submit/request maintenance tickets and **notify management**.
   - Added a dedicated **"📢 Notify Management"** button on open tickets that triggers an immediate alert to facilities supervisors and the residence warden.
   - Admin controls (resolving tickets, reassigning, priority filtering) are restricted to staff roles.

5. **Activity Hub Cleanup**:
   - Completely removed the "Transport Request" card and modal.
   - Removed the "Upcoming Bookings" list on the student activity view to eliminate clutter.
   - Preserved on-campus amenity booking (Swimming Pool, Multi-Sport Turf & Soccer Field, 24/7 Academic Study Lab, Fitness Centre).

6. **Bursary Portal Cleanup**:
   - Completely removed the "Admin Review" queue and table from the student view.
   - Students have access to the bursary application form, document upload criteria, and their personal application status tracker.
   - Staff roles retain full verification, approval, and quota allocation capabilities.

7. **Visual & Architectural Elevation**:
   - Responsive multi-role switching directly from the top bar (Student, Admin, Warden, Finance, Facilities, Auditor).
   - South African university residence design language: Deep Navy (`#0B192C`), Brushed Gold (`#C8933A`), Ivory Canvas (`#F4F6F9`).
   - Reactive persistent state with `localStorage`.
   - WCAG AA accessibility compliance with screen reader announcements and keyboard navigation.

---

## Running the Application

### Development Server
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```
