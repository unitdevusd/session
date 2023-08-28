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


  const { Device } = Plugins;

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
    
      this.fireauth.signInWithEmailAndPassword(email, password)
        .then(res => {
          if (res.user) {
            console.log(res.user);
            this.navigate();
          }
        })
        .catch(err => {
          console.log(`login failed ${err}`);
          this.error = err.message;
        });
    }
    
    navigate() {
        if(this.priviousUrl == 'place-detail'){
          let navigationExtras: NavigationExtras = {
            queryParams: {
              from: "place-detail"
            },
          };
          this.router.navigate([this.priviousUrl], navigationExtras);
        }else{
          this.router.navigate([this.priviousUrl]);
        }
        if(!this.priviousUrl){
          this.router.navigate(["tabs/tab1"]);
        }
    }
    
    settings(data: any, email: string, password: string) {
      const userId = data.user._id;
    
      // Update the user data in the Firebase Realtime Database
      const userRef = firebase.database().ref('users/' + userId);
      userRef.set({
        permissions: data.orgs[0].permissions,
        session: data.token,
        orgId: data.orgs[0].id,
        // Add other fields as needed
      });
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
