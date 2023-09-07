import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api-service.service';
import { LoaderService } from 'src/app/services/loader.service';
import { ToastService } from 'src/app/services/toast.service';
import { AngularFireAuth } from '@angular/fire/auth'; // Import AngularFireAuth for Firebase Authentication

@Component({
  selector: 'app-select-role',
  templateUrl: './select-role.page.html',
  styleUrls: ['./select-role.page.scss'],
})
export class SelectRolePage implements OnInit {
  signInData: any;
  roles: any = [];
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _apiService: ApiService,
    private alertCtrl: AlertController,
    private _toast: ToastService,
    private _loader: LoaderService,
    private afAuth: AngularFireAuth // Inject AngularFireAuth
  ) {
    this.route.queryParams.subscribe(params => {
      if (params && params.special) {
        this.signInData = JSON.parse(params.special);
        console.log(this.signInData);
      }
    });
  }

  async presentAlert(options) {
    const alert = await this.alertCtrl.create({
      header: options.header ? options.header : 'Alert',
      message: options.message ? options.message : '',
      buttons: options.buttons
    });
    await alert.present();
  }

  ngOnInit() {
    this.getRoles();
  }

  getRoles() {
    this._apiService
      .postRequest('https://your-firebase-url.com/getOnboardRoles', {}) // Replace with your Firebase Realtime Database URL
      .subscribe(async (res) => {
        if (res.success) {
          this.roles = res.data.roles;
          if (this.roles.length) {
            for (let i = 0; i < this.roles.length; i++) {
              this.roles[1].image = '../../../../assets/imgs/tanent.png';
              this.roles[1].text = 'Rent a Unit';
              this.roles[0].image = '../../../../assets/imgs/owner.png';
              this.roles[0].text = 'Host your Unit';
            }
          }
        } else {
          this.presentAlert({ header: 'Error', message: res.message, buttons: ['Close'] });
        }
      }, (err) => {
        this.presentAlert({
          header: 'Error',
          message: 'Unable to process your request. Please try again later',
          buttons: ['Close'],
        });
      });
  }

  selectRole(roleId) {
    this.signUp(roleId);
  }

  signUp(roleId) {
    this._loader.present('');
    if (this.signInData) {
      const params = {
        roleId: roleId,
        firstName: this.signInData.firstName,
        lastName: this.signInData.lastName,
        password: this.signInData.password,
        email: this.signInData.email,
      };
      console.log(params);
      this.afAuth.createUserWithEmailAndPassword(params.email, params.password)
        .then((userCredential) => {
          this._loader.dismiss();
          this._toast.presentToast('User created successfully.');
          this.router.navigate(['login']);
          // Optionally, you can call additional functions here
        })
        .catch((error) => {
          this._loader.dismiss();
          this.presentAlert({ header: 'Error', message: error.message, buttons: ['Close'] });
        });
    }
  }

  openAdditionalDataform(){
    const user = {
      firstName: this.signInData.firstName,
      lastName:  this.signInData.lastName,
      phoneno:  this.signInData.phoneno
    };
    let navigationExtras: NavigationExtras = {
      queryParams: {
        special: JSON.stringify(user)
      }
    };
    // this.router.navigate(['checkr'], navigationExtras);
  }
}
