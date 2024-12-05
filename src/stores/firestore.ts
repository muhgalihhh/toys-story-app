import { db } from '@/utils/firebase';
import { Timestamp, addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc } from 'firebase/firestore';

// Interface untuk data mainan
export interface Toy {
  id: string;
  name: string;
  memory: string;
  createdAt: Timestamp;
}

export const firestoreStore = {
  // Mengambil data mainan dari Firestore
  async getToys() {
    const q = query(collection(db, 'toys'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const toys: Toy[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      toys.push({
        id: doc.id,
        name: data.name,
        memory: data.memory,
        createdAt: data.createdAt,
      });
    });
    return toys;
  },

  // Menambahkan data mainan ke Firestore
  async addToy(name: string, memory: string) {
    await addDoc(collection(db, 'toys'), {
      name,
      memory,
      createdAt: Timestamp.now(),
    });
  },

  // Mengubah data mainan di Firestore
  async updateToy(id: string, name: string, memory: string) {
    const toyRef = doc(db, 'toys', id);
    await updateDoc(toyRef, {
      name,
      memory,
    });
  },

  // Menghapus data mainan di Firestore
  async deleteToy(id: string) {
    const toyRef = doc(db, 'toys', id);
    await deleteDoc(toyRef);
  },
};
