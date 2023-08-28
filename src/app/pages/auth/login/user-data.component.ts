import firebase from 'firebase/app';
import { Injectable } from '@angular/core';

@Injectable()
export class UserDataComponent {
    userData: any;
  
    ngOnInit() {
      const userId = 'user-id-here'; // Replace with the actual user ID
  
      const database = firebase.database();
      database.ref('users/' + userId).once('value')
        .then((snapshot) => {
          this.userData = snapshot.val();
          console.log('User data retrieved from the database:', this.userData);
        })
        .catch((error) => {
          console.error('Error retrieving user data from the database:', error);
        });
    }
  }
  