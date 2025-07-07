const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(require('./credential_firebaseAdminSDK/snack-website-70d57-firebase-adminsdk-fbsvc-9694f84a20.json')),
});

module.exports = admin;
