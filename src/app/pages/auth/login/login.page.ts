  import { Component, OnInit } from '@angular/core';
  import {
    FormGroup,
    FormBuilder,
    FormControl,
    Validators,
  } from "@angular/forms";
  import { AlertController } from '@ionic/angular';
  import { ApiService } from 'src/app/services/api-service.service';
  import { Storage } from '@ionic/storage';
  import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
  import { GlobalService } from 'src/app/services/global.service';
  import {
    Plugins
  } from '@capacitor/core';
  import firebase from 'firebase/app';
  import 'firebase/database'; // Import the Realtime Database module
  import { AngularFireAuth } from '@angular/fire/auth';
  import { environment } from '../../../../environments/environment';
  import { HttpClient } from '@angular/common/http';
  
  

  const { Device } = Plugins;

  interface AuthResponseData {
    idToken: string;
    // Add other properties if necessary
  }

  @Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
  })
  export class LoginPage {

    private loginForm: FormGroup;
    //  
    // private  loginUrl = URL.signIn;
    priviousUrl: any;
    error: string; 
    // Declare the 'error' property

    constructor(
      private fireauth: AngularFireAuth,
      private formBuilder: FormBuilder,
      private alertCtrl : AlertController,
      private _apiService: ApiService,
      private storage: Storage,
      private router: Router,
      private _gs : GlobalService,
      private http: HttpClient,
      private route: ActivatedRoute,

      ) {

        this.route.queryParams.subscribe((params) => {
          if (params && params.from) {
            this.priviousUrl = params.from;
            console.log( this.priviousUrl );
          }
        });

      this.loginForm = this.formBuilder.group({
        emailId: new FormControl(
          "",
          Validators.compose([
            Validators.required,
            Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"),
          ])
        ),
        password: new FormControl("", Validators.required),
      });
    }

    login() {
      const email = this.loginForm.get('emailId').value;
      const password = this.loginForm.get('password').value;
    
      const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseConfig.apiKey}`;

      const requestBody = {
        email: email,
        password: password,
        returnSecureToken: true
      };
  
      this.http.post<AuthResponseData>(url, requestBody)
        .subscribe(
          (response) => {
            if (response.idToken) {
              console.log('Login successful');
              this.settings(response, email, password);
              this.navigate();
            }
          },
          (error) => {
            console.error('Login failed:', error);
            this.error = error.message;
          }
        );
    }    
    
    navigate() {
      if (this.priviousUrl === 'profile') { // Check if the previous URL was 'profile'
        this.router.navigate(["tabs/tab1"]); // Redirect to tab1
      } else if (this.priviousUrl === 'place-detail') { // Check if the previous URL was 'place-detail'
        let navigationExtras: NavigationExtras = {
          queryParams: {
            from: "place-detail"
          },
        };
        this.router.navigate([this.priviousUrl], navigationExtras);
      } else {
        this.router.navigate([this.priviousUrl]);
      }
      if (!this.priviousUrl) {
        this.router.navigate(["tabs/tab1"]);
      }
    }
    
    settings(data: any, email: string, password: string) {
      const userId = data.localId;
      
    
      // Update the user data in the Firebase Realtime Database
      // const userRef = firebase.database().ref('users/' + userId);
      // userRef.set({
      //   permissions: data.orgs[0].permissions,
      //   session: data.idToken,
      //   orgId: data.orgs[0].id,
      //   // Add other fields as needed
      // });
      // firebase.auth().createUserWithEmailAndPassword(email, password)
      //   .then((userCredential) => {
      //     // User created successfully
      //     console.log('User created:', userCredential.user);
      //     // Add any additional logic you need here
      //   })
      //   .catch((error) => {
      //     // Handle errors here
      //     console.error('Error creating user:', error);
      //   });
    
      // Attach FCM token
      // this.attachFCM(data.token);
      // this.getUserData(userId);
    }

    getUserData(userId: string) {
      const userRef = firebase.database().ref('users/' + userId);
      userRef.on('value', (snapshot) => {
        const userData = snapshot.val();
        console.log(userData);
        // Update your application's UI with userData
      });
    }
    // async attachFCM(token) {
    //   const info = await Device.getInfo();
    //   this.storage.get('fcm_token').then((fcmToken) => {
    //     if(fcmToken){
    //       const params = {
    //         deviceId : info.uuid,
    //         token : token,
    //         deviceType: info.operatingSystem,
    //         enableNotifications : true,
    //         firebaseToken : fcmToken
    //       };

    //       const url = 'https://unit-session-default-rtdb.firebaseio.com/users';
          
    //       // Logic to send POST request using _apiService
    //       this._apiService.postRequest(url, params).subscribe(
    //         (response) => {
    //           //handle successful response
    //           console.log(response);
    //         },
    //         (error) => {
    //           //handle error
    //           console.error('error', error);
    //         }

    //       );
    //     }
    //   });
    // }
  }
