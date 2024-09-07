import DatabaseInterface from "./databaseInterface.js";
import admin from 'firebase-admin';
import 'firebase-admin/auth';
import { getFirestore } from 'firebase/firestore';

import serviceAccount from '../serviceAccount.json' assert { type: 'json' };

import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

class FirebaseDatabase extends DatabaseInterface {

    constructor(config) {
        super();
        this.firebaseConfig = {
          apiKey: config.API_KEY,

          authDomain: config.AUTH_DOMAIN,

          projectId: config.PROJECT_ID,

          storageBucket: config.STORAGE_BUCKET,

          messagingSenderId: config.MESSAGING_SENDER_ID,

          appId: config.APP_ID,
        };
        this.firebaseApp = null;
        this.auth = null;
    }

    async connect() {
        // this.firebaseApp = admin.initializeApp({
        //     credential: admin.credential.cert(serviceAccount),
        //     firebaseConfig: this.firebaseConfig,
        // });
        this.firebaseApp = initializeApp(this.firebaseConfig);

        console.log("Firebase connected");
        return this.firebaseApp;
    }

    async getConnection() {
        const db = getFirestore(this.firebaseApp);
        return db;
    }

    // async getAuth() {
    //     this.auth = getAuth(this.firebaseApp);
    //     return this.auth;
    // }

    async getAuthState() {
        this.auth = getAuth(this.firebaseApp);
        return onAuthStateChanged(this.auth, (user) => {
            if (user) {
              user.getIdToken().then((token) => {
                admin
                  .auth()
                  .verifyIdToken(token)
                  .then((decodedToken) => {
                    const uid = decodedToken.uid;
                    console.log("uid"+uid);
                    console.log("decodedToken"+decodedToken);
                  });
              });

              return user;
            } else {
              return null;
            }
        });
    }

}

export default FirebaseDatabase;
