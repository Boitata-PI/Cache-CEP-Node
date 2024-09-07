import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";

class firebaseUsuarioModel {
  constructor(db, connectionTime) {
    this.db = db;
    this.connectionTime = connectionTime;
  }

    async register(email, password) {
        const auth = getAuth(this.db.firebaseApp);
        return createUserWithEmailAndPassword(auth, email, password);
    }

    async login(email, password) {
        const auth = getAuth(this.db.firebaseApp);
        return signInWithEmailAndPassword(auth, email, password);
    }

    async logout() {
        const auth = getAuth(this.db.firebaseApp);
        return signOut(auth);
    }

}

export default firebaseUsuarioModel;
