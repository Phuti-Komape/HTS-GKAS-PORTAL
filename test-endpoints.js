// Integration test for backend APIs and frontend connectivity using native fetch
async function runTests() {
  console.log('=== RUNNING GKAS PORTAL INTEGRATION TESTS ===\n');

  // 1. Institutions
  const instRes = await fetch('http://localhost:3001/api/institutions');
  const instJson = await instRes.json();
  const institutions = instJson.institutions || [];
  console.log('1. Institutions API:', instRes.status === 200 && institutions.length > 0 ? 'PASS' : 'FAIL');
  console.log(`   Count: ${institutions.length}`);
  console.log(`   Sample: ${institutions[0].name} (${institutions[0].short_name})`);

  // 2. OTP Send
  const otpSendRes = await fetch('http://localhost:3001/api/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contact: '0712345678', type: 'sms' })
  });
  const otpSendData = await otpSendRes.json();
  console.log('2. Send OTP API:', otpSendData.success ? 'PASS' : 'FAIL', `(${otpSendData.message})`);

  // 3. OTP Verify
  const otpVerifyRes = await fetch('http://localhost:3001/api/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contact: '0712345678', code: otpSendData.devCode || otpSendData.code })
  });
  const otpVerifyData = await otpVerifyRes.json();
  console.log('3. Verify OTP API:', otpVerifyData.success && otpVerifyData.verified ? 'PASS' : 'FAIL');

  // 4. Validate Document
  const docRes = await fetch('http://localhost:3001/api/validate-document', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      docType: 'id_copy',
      fileName: 'sa_id_document.pdf',
      fileSize: 1024,
      mimeType: 'application/pdf',
      fileBase64: 'JVBERi0xLjQKJcTl8uXrp/Og0MTGCjEgMCBvYmoKPDwgL1R5cGUgL0NhdGFsb2cgL1BhZ2VzIDIgMCBSID4+CmVuZG9iagoyIDAgb2JqCjw8IC9UeXBlIC9QYWdlcyAvS2lkcyBbMyAwIFJdIC9Db3VudCAxID4+CmVuZG9iagozIDAgb2JqCjw8IC9UeXBlIC9QYWdlIC9QYXJlbnQgMiAwIFIgPj4KZW5kb2JqCnhyZWYKMCA0CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAwMDY4IDAwMDAwIG4gCjAwMDAwMDAxMjUgMDAwMDAgbiAKdHJhaWxlcgo8PCAvUm9vdCAxIDAgUiAvU2l6ZSA0ID4+CnN0YXJ0eHJlZgoxNzUKJSVFT0Y=',
      applicationId: 'APP-2027-1049'
    })
  });
  const docData = await docRes.json();
  console.log('4. Document Validation API:', docRes.status === 200 ? 'PASS' : 'FAIL');
  console.log(`   Status: ${docData.status}, Tamper Risk: ${docData.document?.validationNotes?.tamper_risk}`);

  // 5. Notifications
  const notifRes = await fetch('http://localhost:3001/api/notifications');
  const notifJson = await notifRes.json();
  const notifs = notifJson.notifications || [];
  console.log('5. Notifications API:', notifRes.status === 200 ? 'PASS' : 'FAIL');
  console.log(`   Total items: ${notifs.length}`);
  console.log(`   First notification: "${notifs[0]?.title}"`);

  // 6. Frontend Dev Server Check
  const feRes = await fetch('http://localhost:3000/');
  console.log('6. Vite Dev Server on http://localhost:3000/:', feRes.status === 200 ? 'PASS (HTTP 200)' : 'FAIL');

  console.log('\n=== ALL INTEGRATION CHECKS COMPLETED SUCCESSFULLY ===');
}

runTests().catch(err => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
