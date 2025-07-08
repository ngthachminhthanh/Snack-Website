const admin = require('firebase-admin');

const serviceAccount = JSON.parse(process.env.CREDENTIALS_FIREBASEADMINSDK);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
