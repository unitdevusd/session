import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global.service';
import { LoaderService } from 'src/app/services/loader.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Storage } from '@ionic/storage';
import { ToastService } from 'src/app/services/toast.service';
import { AngularFireAuth } from '@angular/fire/auth'; // Import AngularFireAuth
import { AngularFireDatabase } from '@angular/fire/database'; // Import AngularFireDatabase

@Component({
  selector: 'app-my-spaces',
  templateUrl: './my-spaces.page.html',
  styleUrls: ['./my-spaces.page.scss'],
})
export class MySpacesPage implements OnInit {

  private _placesList: any = [];
  private token: any;
  userName: string = '';
  lastName: any;
  orgId: any;
  additionalInfo: boolean = false;

  constructor(
    private router: Router,
    public alrtCtrl: AlertController,
    private _gs: GlobalService,
    private socialSharing: SocialSharing,
    private _loader: LoaderService,
    private storage: Storage,
    private _toast: ToastService,
    private afAuth: AngularFireAuth, // Inject AngularFireAuth
    private db: AngularFireDatabase // Inject AngularFireDatabase
  ) {
        this._gs.getUpdatedTabs().subscribe(status =>{
        if(status){
        this.token = status.token;
        this.orgId = status.orgId;
        this.additionalInfo = true;
        this.getSpaces();
      }
    });


    this._gs.getRefreshScreen().subscribe(x => {
      if (x) {
        this.additionalInfo = true;
        this.getSpaces();
      }
    });

  }

  ngOnInit() {
    this.getUserData();
  }

  getUserData() {
    this.storage.get("session").then((session) => {
      if (session) {
        this.storage.get("user").then((user) => {
          console.log('user', user);
          this.userName = user.firstName;
          this.lastName = user.lastName;
        });
        this.storage.get("org").then((org) => {
          if (org) {
            this.token = session;
            this.orgId = org;
            this.storage.get("permissions").then((permissions) => {
              let havepermission = permissions.includes("unit.space.canRetriveOwn");
              if (havepermission) {
                this.getSpaces();
                this.additionalInfo = true; // Set additionalInfo here
              }
            });
          }
        });
      }
    });
  }

  getSpaces() {
    this._loader.present('Loading Spaces, please wait ...');
    this.db.list('places', ref => ref
      .orderByChild('token').equalTo(this.token)
      .orderByChild('orgId').equalTo(this.orgId)
    ).valueChanges().subscribe(
      async (places) => {
        this._loader.dismiss();
        this._placesList = places; // Update the private property
      },
      (error) => {
        this._loader.dismiss();
        console.log(error.description);
        this._toast.presentToast(error.description);
      }
    );
  }
  

  // Rest of the class remains unchanged

  // Define a public getter method for placesList
  public get getPlacesList(): any[] {
    return this._placesList;
  }

}



