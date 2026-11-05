/* ═══════════════════════════════════════════════════════════
   INITIAL MOCK DATA FOR HTS & GKAS STUDENT RESIDENCES
   Nelspruit / Mbombela, Mpumalanga, South Africa
   Strict Roles: Administrator (L. Marsher) and Students only
═══════════════════════════════════════════════════════════ */

// Static mock users removed in favor of dynamic session-based authentication from backend
export const USERS = null;

export const RESIDENCES = [
  {
    id: 'gkas',
    name: 'GKAS Residence',
    campus: 'Sonheuwel Campus',
    totalBeds: 88,
    occupiedBeds: 76,
    maintenanceBeds: 2,
    availableBeds: 10,
    rateMonthly: 3200.00,
    rooms: [
      { roomNumber: 'G-01', type: 'Double', beds: 2, occupied: 2, residents: ['L. Khumalo', 'J. Sithole'] },
      { roomNumber: 'G-05', type: 'Single', beds: 1, occupied: 1, residents: ['Lwazi Motha'] },
      { roomNumber: 'G-14', type: 'Single', beds: 1, occupied: 1, residents: ['Thandeka Nkosi'] },
      { roomNumber: 'G-22', type: 'Single', beds: 1, occupied: 0, status: 'MOVEINPENDING', residents: ['Amahle Zulu'] },
      { roomNumber: 'G-31', type: 'Double', beds: 2, occupied: 2, residents: ['Zanele Mthembu', 'P. Ndlovu'] },
      { roomNumber: 'G-34', type: 'Single', beds: 1, occupied: 1, residents: ['K. Dube'] },
      { roomNumber: 'G-55', type: 'Single', beds: 1, occupied: 0, status: 'LEASEPENDING', residents: ['Precious Khumalo'] }
    ]
  },
  {
    id: 'hts',
    name: 'HTS Residence',
    campus: 'Stonehenge Campus',
    totalBeds: 20,
    occupiedBeds: 16,
    maintenanceBeds: 1,
    availableBeds: 3,
    rateMonthly: 3400.00,
    rooms: [
      { roomNumber: 'H-03', type: 'Double', beds: 2, occupied: 2, residents: ['Bongani Ntuli', 'M. Sibeko'] },
      { roomNumber: 'H-07', type: 'Single', beds: 1, occupied: 1, residents: ['Sibusiso Dlamini'] },
      { roomNumber: 'H-11', type: 'Single', beds: 1, occupied: 1, residents: ['D. Nzimande'] }
    ]
  }
];

export const INITIAL_TICKETS = [
  {
    id: 'HTS-MNT-2026-0041',
    icon: '🔧',
    bg: '#fee2e2',
    title: 'Burst pipe in bathroom — Room H-7',
    meta: 'HTS Stonehenge · S. Dlamini · 5 hrs ago',
    location: 'Room H-7 Bathroom',
    residence: 'HTS',
    priority: 'urgent',
    status: 'open',
    category: 'Plumbing',
    studentName: 'Sibusiso Dlamini',
    studentId: '21289034',
    createdAt: '2026-04-19T08:30:00Z',
    description: 'High pressure water leaking from the under-sink pipe fitting. Turned off local isolator valve.'
  },
  {
    id: 'HTS-MNT-2026-0040',
    icon: '💡',
    bg: '#fef3c7',
    title: 'Flickering lights in corridor — Block C',
    meta: 'GKAS Sonheuwel · A. Zulu · 1 day ago',
    location: 'GKAS Block C 2nd Floor Corridor',
    residence: 'GKAS',
    priority: 'medium',
    status: 'open',
    category: 'Electrical',
    studentName: 'Amahle Zulu',
    studentId: '22301145',
    createdAt: '2026-04-18T14:15:00Z',
    description: 'Fluorescent tubes in the passage are blinking rapidly at night causing eye strain.'
  },
  {
    id: 'HTS-MNT-2026-0037',
    icon: '🚿',
    bg: '#eff6ff',
    title: 'Low hot water temperature — Ablution Block B',
    meta: 'GKAS Sonheuwel · T. Nkosi · 3 days ago',
    location: 'Ablution Block B (Female)',
    residence: 'GKAS',
    priority: 'low',
    status: 'open',
    category: 'Plumbing',
    studentName: 'Thandeka Nkosi',
    studentId: '21304567',
    createdAt: '2026-04-16T07:45:00Z',
    description: 'Geyser seems to be tripping before water reaches adequate temperature in the mornings.'
  }
];

export const INITIAL_APPLICANTS = [
  {
    id: 'APP-2027-1049',
    initials: 'NS',
    bg: '#eff6ff',
    tc: '#1d4ed8',
    name: 'Nonhlanhla Sibiya',
    meta: 'TUT Nelspruit · NSFAS Approved · 2027 Intake',
    institution: 'TUT',
    studentNumber: '22109438',
    idNumber: '0308150493081',
    bgCheck: 'pending',
    funding: 'nsfas',
    preferredResidence: 'GKAS Sonheuwel',
    roomType: 'Single Room',
    submittedDate: '16 Oct 2026',
    processed: false
  },
  {
    id: 'APP-2027-1048',
    initials: 'KM',
    bg: '#e8f5e9',
    tc: '#15803d',
    name: 'Karabo Mashile',
    meta: 'University of Mpumalanga (UMP) · Self-funded · 2027 Intake',
    institution: 'UMP',
    studentNumber: '21980345',
    idNumber: '0204125890087',
    bgCheck: 'clear',
    funding: 'self',
    preferredResidence: 'HTS Stonehenge',
    roomType: 'Single Room',
    submittedDate: '14 Oct 2026',
    processed: false
  }
];

export const RESIDENCE_AMENITIES = [
  {
    id: 'pool',
    name: 'Swimming Pool & Sun Deck',
    residence: 'GKAS Sonheuwel',
    icon: '🏊',
    bg: '#dbeafe',
    info: 'Max 25 swimmers · Open 06:00 – 20:00 Daily',
    slots: ['06:00 - 08:00', '08:00 - 10:00', '10:00 - 12:00', '14:00 - 16:00', '16:00 - 18:00', '18:00 - 20:00'],
    description: 'Chlorinated 20m lap pool with sun loungers and perimeter safety fence.'
  },
  {
    id: 'field',
    name: 'Multi-Sport Turf & Soccer Field',
    residence: 'Stonehenge Sports Grounds',
    icon: '⚽',
    bg: '#dcfce7',
    info: 'Open 07:00 – 19:00 Daily · Floodlit',
    slots: ['07:00 - 09:00', '09:00 - 11:00', '14:00 - 16:00', '16:00 - 18:00', '18:00 - 19:30'],
    description: 'All-weather 5-a-side soccer and multi-purpose recreational field.'
  },
  {
    id: 'study',
    name: '24/7 Academic Study Lab',
    residence: 'GKAS & HTS Facilities',
    icon: '📚',
    bg: '#f3e8ff',
    info: 'Silent study · High-speed fibre · Generator backed',
    slots: ['Morning Session (08:00 - 13:00)', 'Afternoon Session (13:00 - 18:00)', 'Evening Session (18:00 - 23:00)', 'Night Owl (23:00 - 05:00)'],
    description: 'Sound-dampened individual study cubicles, group project rooms, and printing terminals.'
  },
  {
    id: 'gym',
    name: 'Residence Fitness Centre',
    residence: 'GKAS Ground Floor',
    icon: '🏋️',
    bg: '#fef3c7',
    info: 'Capacity 20 · Open 05:30 – 21:30 Daily',
    slots: ['Early Bird (05:30 - 07:30)', 'Morning (08:00 - 11:00)', 'Afternoon (14:00 - 17:00)', 'Peak Evening (17:00 - 19:30)', 'Late (19:30 - 21:30)'],
    description: 'Equipped with cardio treadmills, rowing machines, dumbbells, and functional workout mats.'
  }
];

export const INITIAL_NOTICES = [
  {
    id: 'notif_1',
    severity: 'urgent',
    icon: '🚨',
    title: 'Water Supply Disruption — GKAS Block C',
    body: 'Scheduled municipal pressure maintenance on Tuesday 21 April 2026 from 09:00 to 11:30. Backup water tanks are connected to main ground taps.',
    date: '19 Apr 2026',
    author: 'L. Marsher (Admin)',
    residence: 'GKAS Sonheuwel',
    smsDispatched: true
  },
  {
    id: 'notif_2',
    severity: 'normal',
    icon: '📖',
    title: 'Mid-Year Exam Quiet Hours Commencing 5 May',
    body: 'Strict 24-hour study quiet periods will take effect from 5 May to 15 June 2026. Communal recreation rooms close at 21:00 during this window.',
    date: '18 Apr 2026',
    author: 'L. Marsher (Admin)',
    residence: 'All Residences',
    smsDispatched: false
  }
];

export const INITIAL_AUDIT_LOG = [
  {
    id: 'aud_1',
    type: '🔐',
    bg: '#eff6ff',
    action: 'Admin L. Marsher signed in securely from authenticated session',
    meta: 'admin / 2026-04-19 08:14'
  },
  {
    id: 'aud_2',
    type: '✍️',
    bg: '#e8f5e9',
    action: 'DocuSign lease envelope DSENV-2842 verified & counter-signed for T. Nkosi (Room G-14)',
    meta: 'system / 2026-04-19 10:32'
  }
];

export const HOUSE_RULES = [
  {
    cat: 'Quiet Hours & Study Environment',
    text: 'Standard quiet hours are 22:00 to 06:00 Sunday through Thursday, and 23:00 to 07:00 Friday & Saturday. During examination periods, quiet hours are enforced 24/7 to protect students academic focus.'
  },
  {
    cat: 'Visitor Policy & Security',
    text: 'All guests must sign in at the security guardhouse with a valid SA National ID or passport. No overnight visitors are permitted without 24-hour advance written registration with the residence warden (maximum 2 nights per calendar month).'
  },
  {
    cat: 'Prohibited Substances & Fire Safety',
    text: 'HTS and GKAS residences are strictly non-smoking, drug-free, and alcohol-free zones. Open flames, candles, shisha pipes, and unauthorized high-draw hotplates are strictly prohibited due to municipal fire bylaws.'
  }
];
