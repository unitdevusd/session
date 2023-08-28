import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth'; // Import AngularFireAuth
import { ApiService } from 'src/app/services/api-service.service';
import { GlobalService } from 'src/app/services/global.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  token: any;
  profileImage: any = "/assets/imgs/dummyUser.png";

  private adminPages = [
    // ... (unchanged)
  ];
  email: any;
  name: any;
  contact: any;
  orgId: any;

  constructor(
    private _gs: GlobalService,
    private navController: NavController,
    public alertController: AlertController,
    private api: ApiService,
    private storage: Storage,
    private afAuth: AngularFireAuth // Inject AngularFireAuth
  ) { }

  ngOnInit() {
    this.getUserData();
  }

  getUserData() {
    this.storage.get("session").then((session) => {
      if (session) {
        this.storage.get("org").then((org) => {
          if (org) {
            this.token = session;
            this.orgId = org;
          }
        });
        this.storage.get("user").then((user) => {
          if (user) {
            this.email = user.email;
            this.name = user.firstName;
            this.contact = user.phone;
            if (user.profilePic == null) {
              this.profileImage = "/assets/imgs/dummyUser.png";
            } else {
              this.profileImage = user.profilePic;
            }
          }
        });
      }
    });
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'LogOut',
      message: 'Are you sure, you want to logout?',
      buttons: [
        // ...
      ]
    });

    await alert.present();
  }

  async clearAll() {
    // Sign out from AngularFireAuth
    try {
      await this.afAuth.signOut();
      this.storage.clear().then(() => {
        console.log('all keys cleared');
      });
      this._gs.logOut();
      this.navController.navigateRoot(['tabs/tab1']);
    } catch (error) {
      console.error('Error while signing out:', error);
    }
  }
}
