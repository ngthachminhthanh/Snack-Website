const admin = require('firebase-admin');
const fs = require('fs');

// Đọc nội dung JSON từ file
const serviceAccount = JSON.parse(
  fs.readFileSync(process.env.CREDENTIALS_FIREBASEADMINSDK, 'utf8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
