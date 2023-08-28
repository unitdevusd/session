import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api-service.service';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  private fp: FormGroup;
   
  
  
  constructor(
    private formBuilder: FormBuilder,
    private _apiService : ApiService,
    private alertCtrl : AlertController
  ) { 

    this.fp = this.formBuilder.group({
      email: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ])
      )
    });

  }

  ngOnInit() {
  }

  async presentAlert(options) {
    const alert = await this.alertCtrl.create({
      header: options.header ? options.header : 'Alert',
      message: options.message ? options.message : '',
      buttons: options.buttons
    });
    await alert.present();
  }

  forgotPassword(data) {
    let params = {
      email: data.email
    };

    if (configEmail.siteName) {
      params["siteName"] = configEmail.siteName;
    }
    if (configEmail.from) {
      params["from"] = configEmail.from;
    }
    if (configEmail.subject) {
      params["subject"] = configEmail.subject;
    }
    if (configEmail.resetUrl) {
      params["resetUrl"] = configEmail.resetUrl;
    }
    if (configEmail.team) {
      params["team"] = configEmail.team;
    }
    this._apiService.postRequest(this.url + URL.forgotPassword, params).subscribe((res) => {
      if (res.success) {
        // this.storage.set("forgot", res.data);
        this.fp.reset();
      } else {
        this.presentAlert({ header: "Error", message: res.message, buttons: ["Close"] });
      }
    }, (err) => {
      this.presentAlert({ header: "Error", message: "Unable to process your request. Please try again later", buttons: ["Close"] });
    });
  }
}
