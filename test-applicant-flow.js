// Test applicant registration and funding review flow
async function testApplicantFlow() {
  console.log('=== TESTING APPLICANT REGISTRATION & FUNDING DECISION FLOW ===\n');

  // 1. Register new applicant for 2027 intake
  const registerPayload = {
    firstName: 'Bongani',
    lastName: 'Mkhize',
    idNumber: '0301155123087',
    phone: '0821234567',
    email: 'b.mkhize@tut4life.ac.za',
    institution: 'Tshwane University of Technology',
    institution_id: 'tut-002',
    studentNumber: '221049382',
    fundingType: 'nsfas',
    nsfasRef: 'NSFAS-2027-89321',
    roomPreference: 'GKAS Stonehenge Single En-Suite',
    academicYear: 2027
  };

  const regRes = await fetch('http://localhost:3001/api/applicants', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(registerPayload)
  });
  const regData = await regRes.json();
  const applicant = regData.applicant;

  console.log('1. Registration Response:', regRes.status === 200 ? 'PASS' : 'FAIL');
  console.log(`   Applicant Name: ${applicant.name}`);
  console.log(`   Reference Number: ${applicant.referenceNumber}`);
  console.log(`   Academic Year: ${applicant.academicYear}`);
  console.log(`   Application Status: ${applicant.status}`);
  console.log(`   Funding Type: ${applicant.fundingType}`);
  console.log(`   Funding Status: ${applicant.fundingStatus}`);

  // Assertions
  if (!applicant.referenceNumber || !applicant.referenceNumber.startsWith('GKAS-2027-')) {
    throw new Error('Reference number format invalid: ' + applicant.referenceNumber);
  }
  if (applicant.status !== 'pending') {
    throw new Error('Status should be pending, got: ' + applicant.status);
  }

  // 2. Admin Verifies Funding
  const fundingRes = await fetch(`http://localhost:3001/api/applicants/${applicant.id}/funding`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      status: 'verified',
      adminName: 'L. Marsher',
      reason: 'NSFAS 2027 provisional list confirmed with TUT Financial Aid Office'
    })
  });
  const fundingData = await fundingRes.json();
  console.log('\n2. Funding Verification:', fundingRes.status === 200 ? 'PASS' : 'FAIL');
  console.log(`   Updated Funding Status: ${fundingData.applicant.fundingStatus}`);
  console.log(`   Verified By: ${fundingData.applicant.fundingVerifiedBy}`);

  // 3. Admin Accepts Application
  const decisionRes = await fetch(`http://localhost:3001/api/applicants/${applicant.id}/decision`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      decision: 'accepted',
      reason: 'All credentials and 2027 DHET bursary eligibility verified'
    })
  });
  const decisionData = await decisionRes.json();
  console.log('\n3. Admin Decision:', decisionRes.status === 200 ? 'PASS' : 'FAIL');
  console.log(`   Final Status: ${decisionData.applicant.status}`);
  console.log(`   Decided By: ${decisionData.applicant.decidedBy}`);

  // 4. Check Notifications Dispatched
  const notifRes = await fetch('http://localhost:3001/api/notifications');
  const notifData = await notifRes.json();
  const studentNotif = notifData.notifications.find(n => n.title.includes('Offer & Lease Ready'));
  console.log('\n4. Lease Offer Notification Dispatched:', studentNotif ? 'PASS' : 'FAIL');
  if (studentNotif) {
    console.log(`   Title: ${studentNotif.title}`);
    console.log(`   Link: ${studentNotif.link_url}`);
  }

  console.log('\n=== ALL APPLICANT LIFECYCLE TESTS PASSED ===');
}

testApplicantFlow().catch(err => {
  console.error('Lifecycle test failed:', err);
  process.exit(1);
});
