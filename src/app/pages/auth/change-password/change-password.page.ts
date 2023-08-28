import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api-service.service';
import { LoaderService } from 'src/app/services/loader.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {
  passwordForm: FormGroup;
   
  token: any;
  
  constructor(
    private formBuilder: FormBuilder,
    private _apiService: ApiService,
    private loader: LoaderService,
    private alertController: AlertController,
    public storage : Storage
  ) { 
    this.passwordForm = this.formBuilder.group({
      password: new FormControl('', Validators.required),
      newPassword: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
    this.storage.get("session").then((session) => {
      if (session) {
        this.token = session.token;
      }
    });
  }

  async presentAlert(options) {
    const alert = await this.alertController.create({
      header: options.header ? options.header : 'Alert',
      message: options.message ? options.message : '',
      buttons: options.buttons
    });
    await alert.present();
  }

  changePassword() {
    this.loader.present();
    const params = {
      "auth": {
        "type": "token",
        "token": this.token,
      },
      "currentPassword": this.passwordForm.value.password,
      "newPassword": this.passwordForm.value.newPassword
    }
    this._apiService.postRequest(this.url + URL.changePassword,
      params).subscribe(
        async (result) => {
          if (result.success) {
            this.presentAlert({header: "Error", message: result.message, buttons: ["Close"]});
          }else{
            this.presentAlert({header: "Error", message: result.message, buttons: ["Close"]});
          }
         
        }
      ), (error) => {
        this.loader.dismiss();
        this.presentAlert({header: "Error", message: "Unable to process your request. Please try again later", buttons: ["Close"]});
      }
  }
}

