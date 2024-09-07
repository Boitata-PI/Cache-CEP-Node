
import {
    collection,
    query, 
    getDocs, 
    getDoc,
    addDoc,
    setDoc,
    deleteDoc, 
    doc
} from "firebase/firestore";

class FirebaseClienteModel {
  constructor(db, connectionTime) {
    this.db = db;
    this.connectionTime = connectionTime;
  }

  async getAll() {
    const connection = await this.db.getConnection();
    const q = query(collection(connection, "clientes"));
    const data = await getDocs(q);
    const clientes = [];
    data.forEach((doc) => {
      clientes.push({
        id: doc.id,
        nome: doc.get("nome"),
        idade: doc.get("idade"),
        sexo: doc.get("sexo"),
        cep: doc.get("cep"),
        logradouro: doc.get("logradouro"),
        bairro: doc.get("bairro"),
        cidade: doc.get("cidade"),
        estado: doc.get("estado")
      });
    });
    return clientes;
  }

  async getById(id) {
    const connection = await this.db.getConnection();
    const docRef = doc(connection, "clientes", id);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  }

  async create(cliente) {
    const connection = await this.db.getConnection();
    await addDoc(collection(connection, "clientes"), cliente);
  }

  async update(id, cliente) {
    const connection = await this.db.getConnection();
    const docRef = doc(connection, "clientes", id);
    await setDoc(docRef, cliente);
  }

  async delete(id) {
    const connection = await this.db.getConnection();
    await deleteDoc(doc(connection, "clientes", id));
  }
}

export default FirebaseClienteModel;
