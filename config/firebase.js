const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccount");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount.config),
  storageBucket: serviceAccount.storageBucket,
  databaseURL: serviceAccount.databaseURL, 
});

console.log("Firebase Admin Initialized",admin.apps.length!==0);

const bucket = admin.storage().bucket();



module.exports = { admin, bucket };
// module.exports = admin;
