import { inject, Injectable } from '@angular/core';
import { addDoc } from '@angular/fire/firestore';
import { FirebaseService } from '../firebase/firebase.service';
import { User } from '../../models/user.class';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  introDone: boolean = false;
  firebaseService = inject(FirebaseService);
  user = new User();

  currentOnlineUser = {
    email: '',
    password: ''
  };


  async addUser(data: object) {
    await addDoc(this.firebaseService.getCollectionRef('users'), data)
    .then(
      (result) => {console.log('User hinzugefügt:', result)}
    ).catch(
      (err) => {console.error('User hinzufügen error:', err)});
  }


}