import { inject, Injectable, OnDestroy } from '@angular/core';
import { addDoc, onSnapshot, Unsubscribe, updateDoc } from '@angular/fire/firestore';
import { FirebaseService } from '../firebase/firebase.service';
import { User } from '../../models/user.class';
import { getAuth, signOut, updateEmail } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnDestroy {

  introDone: boolean = false;
  firebaseService = inject(FirebaseService);
  newUser = new User();
  allUsers: User[] = [];
  unsubUserCol!: Unsubscribe;
  currentOnlineUser = new User({
    name: 'Gast',
    avatar: 'assets/img/profile.svg',
    userUID: '0'
  });


  constructor() {
    this.unsubUserCol = this.subUserCol();
  }


  async addUser(data: object) {
    await addDoc(this.firebaseService.getCollectionRef('users'), data)
    .then(
      (result) => {console.log('User erfolgreich hinzugefügt!')}
    ).catch(
      (err) => {console.error('User hinzufügen error:', err)});
  }


  async updateUserEmailandName(userId: string, data = {name: '', email: ''}) {
    await this.firebaseService.updateDocData('users', userId, data)
      .then(() => {
        this.updateUserAuthEmail(data.email);
      })
      .catch((error) => {
        console.log('Update User Error:', error);
      })
  }


  updateUserAuthEmail(newEmail: string) {
    const auth = getAuth();
    if (auth.currentUser) {
      updateEmail(auth.currentUser, newEmail)
        .then(() => {
          console.log('Email updated!');
        })
        .catch((error) => {
          console.log('Email Update Error:', error);
        });
    } else {
      console.log('Aktuell kein User eingeloggt!');
    }
  }


  subUserCol() {
    return onSnapshot(this.firebaseService.getCollectionRef('users'), usersCollection => {
      this.allUsers = [];
      usersCollection.forEach(user => {
        this.allUsers.push(new User(user.data(), user.id));
      });
      console.log('Alle User:', this.allUsers);
    });
  }


  getUserIndexWithUID(userUID: string) {
    return this.allUsers.findIndex(singleUser => singleUser.userUID == userUID);
  }


  signOutUser() {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log('Sign-out successful');
      }).catch((error) => {
        console.log('Error:', error);
      })
  }


  ngOnDestroy(): void {
    this.unsubUserCol();
  }


}