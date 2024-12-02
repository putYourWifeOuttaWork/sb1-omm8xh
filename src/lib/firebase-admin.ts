import * as admin from 'firebase-admin';

const serviceAccount = {
  "type": "service_account",
  "project_id": "deflationproof",
  "private_key_id": "cdf0270b8308df9c4dfc4d9b19a9ce3a7d65eded",
  "private_key": process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  "client_email": "firebase-adminsdk-2l8gs@deflationproof.iam.gserviceaccount.com",
  "client_id": "118135916925124590199",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-2l8gs%40deflationproof.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

if (!process.env.FIREBASE_PRIVATE_KEY) {
  throw new Error('FIREBASE_PRIVATE_KEY environment variable is required');
}

try {
  // Initialize Firebase Admin if not already initialized
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
    });
    console.log('Firebase Admin SDK initialized successfully');
  }
} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
  throw error;
}

export const adminDb = admin.firestore();