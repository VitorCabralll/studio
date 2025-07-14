

const admin = require('firebase-admin');

// IMPORTANT: Download your service account key from Firebase Console
// and place it in the root of your project as 'serviceAccountKey.json'
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function testFirestore() {
  try {
    console.log('Attempting to read from Firestore with admin privileges...');
    const snapshot = await db.collection('usuarios').limit(1).get();
    if (snapshot.empty) {
      console.log('Firestore connection successful, but no documents found in "usuarios".');
    } else {
      console.log('Firestore connection successful! Found documents:');
      snapshot.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
      });
    }
    console.log('\nTest passed: Firestore API is likely enabled and working.');
  } catch (error) {
    console.error('\nTest failed: Could not connect to Firestore.');
    console.error('Error:', error.message);
    console.error('This strongly suggests the Cloud Firestore API is disabled in your Google Cloud project.');
  }
}

testFirestore();

