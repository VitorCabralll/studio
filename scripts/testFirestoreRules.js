
const admin = require('firebase-admin');
const serviceAccount = require('../functions/functions/auth_config.json'); // Assuming this path is correct for your service account

// Initialize Firebase Admin SDK with emulator settings
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'lexai-ef0ab', // Replace with your project ID
  });
}

const db = admin.firestore();
db.settings({
  host: 'localhost:8080', // Firestore emulator host
  ssl: false,
});

async function testFirestoreAccess() {
  const uid = 'non_existent_user_123'; // A UID que certamente não existe
  const collection = 'usuarios';
  const docRef = db.collection(collection).doc(uid);

  console.log(`Attempting to read document: ${collection}/${uid}`);

  try {
    const docSnap = await docRef.get();
    if (docSnap.exists) {
      console.log('Document exists:', docSnap.data());
    } else {
      console.log('Document does not exist.');
    }
  } catch (error) {
    console.error('Error accessing Firestore:', {
      code: error.code,
      message: error.message,
    });
  } finally {
    // Exit the process after the test
    process.exit(0);
  }
}

testFirestoreAccess();
