import { Injectable, inject, signal } from '@angular/core';
import {
 
  collection,
  doc,
  Firestore,
  getDocs,
  query,
  updateDoc,
} from '@angular/fire/firestore';
import { getDownloadURL, ref, Storage, uploadBytesResumable } from '@angular/fire/storage';
import { ChatService } from '../chat/chat.service';

@Injectable({
  providedIn: 'root',
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

  getDocRefInSubcollection(
    docId1: string,
    collectionName: string,
    subcollectionName: string,
    docId2: string
  ) {
    return doc(
      this.firestore,
      collectionName,
      docId1,
      subcollectionName,
      docId2
    );
  }

  getCollectionRef(collectionName: string) {
    return collection(this.firestore, collectionName);
  }

  getSubcollectionRef(
    docId: string,
    collectionName: string,
    subcollectionName: string
  ) {
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

  getSubSubcollectionRef(collectionName: string, docId1: string, subcollectionName: string, docId2: string, subSubCollectionName: string) {
    return collection(this.firestore, collectionName, docId1, subcollectionName, docId2, subSubCollectionName);
  }

  getDocRefInSubSubcollection(collectionName: string, docId1: string, subcollectionName: string, docId2: string, subSubCollectionName: string, docId3: string) {
    return doc(this.firestore, collectionName, docId1, subcollectionName, docId2, subSubCollectionName, docId3);
  }
}