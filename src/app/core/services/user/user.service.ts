import { computed, inject, Injectable, OnDestroy, Signal, signal } from '@angular/core';
import { doc, onSnapshot, setDoc, Unsubscribe } from '@angular/fire/firestore';
import { FirebaseService } from '../firebase/firebase.service';
import { ChatUser } from '../../models/user.class';
import { Auth, getAuth, signOut, updateEmail, User, user } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnDestroy {

  introDone: boolean = false;
  firebaseService = inject(FirebaseService);
  private auth = inject(Auth);
  newUser = new ChatUser();
  private allUsersSignal= signal<ChatUser[]>([]);
  readonly allUsers = this.allUsersSignal.asReadonly();
  unsubUserCol: Unsubscribe;
  user$ = user(this.auth);
  userSubscription!: Subscription;
  currentUserUIDSignal = signal<string>('');
  readonly currentUserUID = this.currentUserUIDSignal.asReadonly();

  readonly currentOnlineUser: Signal<ChatUser> = computed(() => {
    if (this.currentUserUID() !== '0' && this.allUsers().length > 0) {
      return this.allUsers()[this.getUserIndexWithUID(this.currentUserUID())];
    } else {
      return new ChatUser({
        name: 'Gast',
        avatar: 'assets/img/profile.svg',
        userUID: '0'
      });
    }
  });


  constructor(private router: Router) {
    this.unsubUserCol = this.subUserCol();
    this.userSubscription = this.user$.subscribe((currentUser: User | null) => {
      if (currentUser) {
        this.currentUserUIDSignal.set(currentUser.uid);
        // console.log('currentUser', currentUser);
      } else {
        this.currentUserUIDSignal.set('0');
      }
    });
  }


  subUserCol() {
    return onSnapshot(this.firebaseService.getCollectionRef('users'), usersCollection => {
      this.allUsersSignal.set([]);
      usersCollection.forEach(user => {
        this.allUsersSignal().push(new ChatUser(user.data()));
      });
      // console.log('All users', this.allUsers());
    });
  }


  async addUser(userUID: string, data: object) {
    await setDoc(doc(this.firebaseService.getCollectionRef('users'), userUID), data)
    .then(
      (result) => {console.log('User erfolgreich hinzugefügt!')}
    ).catch(
      (err) => {console.error('User hinzufügen error:', err)});
  }


  async updateUserEmailandName(userUID: string, data = {name: '', email: ''}) {
    await this.firebaseService.updateDocData('users', userUID, data)
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


  getUserIndexWithUID(userUID: string) {
    return this.allUsers().findIndex(singleUser => singleUser.userUID == userUID);
  }


  signOutUser() {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log('Sign-out successful');
        this.router.navigateByUrl('');
      }).catch((error) => {
        console.log('Error:', error);
      })
  }


  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
    this.unsubUserCol();
  }


}