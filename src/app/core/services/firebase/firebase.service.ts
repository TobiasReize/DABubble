import { Injectable, inject, signal } from '@angular/core';
import { collection, doc, Firestore } from '@angular/fire/firestore';
import { getDownloadURL, ref, Storage, uploadBytesResumable } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  firestore: Firestore = inject(Firestore);
  private readonly storage: Storage = inject(Storage);
  private uploadProgressSignal = signal<number>(0);
  readonly uploadProgress = this.uploadProgressSignal.asReadonly();
  downloadURL: string = '';

 
  getDocRef(docId: string, collectionName: string) {
    return doc(this.getCollectionRef(collectionName), docId);
  }

  getDocRefInSubcollection(docId1: string, collectionName: string, subcollectionName: string, docId2: string) {
    return doc(this.firestore, collectionName, docId1, subcollectionName, docId2);
  }

  getCollectionRef(collectionName: string) {
    return collection(this.firestore, collectionName);
  }

  getSubcollectionRef(docId: string, collectionName: string, subcollectionName: string) {
    return collection(this.getDocRef(docId, collectionName), subcollectionName);
  }

  async uploadFileToStorage(file: File, path: string) {
    const storageRef = ref(this.storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    await new Promise( (resolve, reject) => {
      uploadTask.on('state_changed', (snapshot) => {
        this.uploadProgressSignal.set((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      }, (error) => {
        reject(error.code);
      }, async () => {
        resolve(this.downloadURL = await getDownloadURL(uploadTask.snapshot.ref));
      })
    })
  }


}