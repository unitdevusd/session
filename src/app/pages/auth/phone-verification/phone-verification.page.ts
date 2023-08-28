import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api-service.service';
import { LoaderService } from 'src/app/services/loader.service';
import { ToastService } from 'src/app/services/toast.service';
import { countryCode } from 'src/app/utilities/countrycode';

@Component({
  selector: 'app-phone-verification',
  templateUrl: './phone-verification.page.html',
  styleUrls: ['./phone-verification.page.scss'],
})
export class PhoneVerificationPage implements OnInit {

  contactForm: FormGroup;
  isOTP: boolean = false;
  
  countryList = countryCode;
  text: string;
  otpForm : FormGroup;
  countryCode: any;
  mobileNum: any;
  hash: any;

  constructor(
    private formBuilder: FormBuilder,
    private _api: ApiService,
    public router: Router,
    private _loader: LoaderService,
    private alertCtrl : AlertController,
    private _toast : ToastService
  ) { 
    this.contactForm = this.formBuilder.group({
      country_code: new FormControl('', Validators.required),
      mobile: new FormControl('', Validators.required)
    });
    this.otpForm = this.formBuilder.group({
      firstDigit: new FormControl('', Validators.required),
      secondDigit: new FormControl('', Validators.required),
      thirdDigit: new FormControl('', Validators.required),
      forthDigit: new FormControl('', Validators.required)
    });

    // this.smsRetriever.getAppHash()
    // .then((res: any) => {
    //   console.log(res);
    //   alert(res);
    //   this.hash = res;
    // })
    // .catch((error: any) => console.error(error));
    // this.smsRetriever.startWatching()
    //   .then((res: any) => {
    //     console.log(res);
    //     //  <#> 323741 is your 6 digit OTP for MyApp. LDQEGVDEvcl
    //     const otp = res.Message.toString().substr(4, 6);
    //     alert(`OTP Received - ${otp}`);
    //   })
    //   .catch((error: any) => console.error(error));
  }

  ngOnInit() {
   
  }

  getOtp() {
    this.isOTP = true;
    this._loader.present();
    this._api.postRequest(this.url + UNITURL.sendOtp,
      this.contactForm.value).subscribe(
        async (result) => {
          if (result.success) {
            this.isOTP = true;
            this._loader.dismiss();
          } else {
            this._loader.dismiss();
          }
        }
      ), (error) => {
        console.log('error', error)
      }
  }

  otpVerify() {
    if(!this.contactForm.value.country_code){
      console.log(this.countryCode);
    }else{
      this.countryCode = this.contactForm.value.country_code;
      this.mobileNum = this.contactForm.value.mobile;
    }
    this._loader.present();
    let str1 = '';
    let newstr  = str1.concat(this.otpForm.value.firstDigit);
     let newstr2  = newstr.concat(this.otpForm.value.secondDigit);
    let newstr3  = newstr2.concat(this.otpForm.value.thirdDigit);
    let  mainStr  = newstr3.concat(this.otpForm.value.forthDigit);
    const params  = {
      country_code : this.contactForm.value.country_code ? this.contactForm.value.country_code : this.countryCode,
      mobile : this.contactForm.value.mobile? this.contactForm.value.mobile :this.mobileNum,
      otp: parseInt(mainStr)
    }
    this._api.postRequest(this.url + UNITURL.verifyOtp,
     params).subscribe(
        async (result) => {
          if (result.success) {
            console.log(result);
            this.isOTP = false;
            this._loader.dismiss();
            this.otpForm.reset();
            this._toast.presentToast(result.message);
            let contact = {
              countryCode: this.contactForm.value.country_code,
              contact: this.contactForm.value.mobile
            }
            this.itemDetailNavigation(contact);
          } else {
            this._loader.dismiss();
            this.otpForm.reset();
            this.contactForm.reset();
            this.presentAlert("Error", result.message);
          }
        }
      ), (error) => {
        this.contactForm.reset();
        this.otpForm.reset();
        console.log('error', error)
      }
  }
  async presentAlert(header, message) {
    const alert = await  this.alertCtrl.create({
      header: header,
      message: message,
      buttons: [
        {
          text: 'ok',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => { }
        }, {
          text: 'Login',
          handler: () => {
            this.loginPage();
          }
        }
      ]
    });
    return await alert.present();

  }

  
  itemDetailNavigation(contact) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        special: JSON.stringify(contact)
      }
    };
    this.router.navigate(['signup'], navigationExtras);
  };

  otpController(event,next,prev){
    if(event.target.value.length < 1 && prev){
      prev.setFocus();
    }
    else if(next && event.target.value.length>0){
      next.setFocus();
    }
  }


  loginPage(){
    this.isOTP = false;
    this.router.navigate(['login']);
  }
}
