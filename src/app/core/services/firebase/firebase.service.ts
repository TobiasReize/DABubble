import { Injectable, inject, signal } from '@angular/core';
import { addDoc, collection, doc, Firestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  firestore: Firestore = inject(Firestore);
 
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


}