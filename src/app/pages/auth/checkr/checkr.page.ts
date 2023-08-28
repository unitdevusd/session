import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api-service.service';
import { LoaderService } from 'src/app/services/loader.service';
import { ToastService } from 'src/app/services/toast.service';
import { Storage } from '@ionic/storage';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-checkr',
  templateUrl: './checkr.page.html',
  styleUrls: ['./checkr.page.scss'],
})
export class CheckrPage implements OnInit {

  checkrForm: FormGroup;
  user: any;
  
  minDate: string = new Date().toISOString();
  token: any;
  orgId: any;
  infoId: any;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private _apiService: ApiService,
    private _toast: ToastService,
    private storage : Storage,
    private _loader : LoaderService,
    private _gs : GlobalService
  ) { 
    this.route.queryParams.subscribe(params => {
      if (params) {
        console.log(params);
      }
      });
     this.initForm();   
  }

  ngOnInit() {
    this.getUserData();
  }
  getUserData() {
    this.storage.get("session").then((session) => {
      if (session) {
        this.storage.get("org").then((org) =>{
          if(org){
            this.token = session;
            this.orgId = org;
            this.getuserAdditionalData();
          }
        });
      }
    });
  }
  
  getuserAdditionalData() {
    this._loader.present();
    if(this.token && this.orgId){
      const params = {
        token: this.token,
        orgId : this.orgId
      }
      this._apiService.postRequest(this.url + UNITURL.getUserInformation,params).subscribe(async (result) => {
        this._loader.dismiss();
          if(result.success){
            console.log('result', result);
            this.setValues(result.data);
          }
        }), (error) => {
          this._loader.dismiss();
          console.log('error', error)
        }
    }
  }

  initForm() {
    this.checkrForm = this.formBuilder.group({
      dob: new FormControl('', Validators.required),
      ssn: new FormControl('', Validators.required),
      zipcode: new FormControl('', Validators.required),
      driver_license_number: new FormControl('', Validators.required),
      driver_license_state: new FormControl('', Validators.required),
    });
  }

  setValues(Info) {
    if(Info.userInfo){
      this.infoId = Info.userInfo._id;
      this.checkrForm.controls['dob'].setValue(Info.userInfo.dob);
      this.checkrForm.controls['ssn'].setValue(Info.userInfo.ssn);
      this.checkrForm.controls['zipcode'].setValue(Info.userInfo.zipcode);
      this.checkrForm.controls['driver_license_number'].setValue(Info.userInfo.driver_license_number);
      this.checkrForm.controls['driver_license_state'].setValue(Info.userInfo.driver_license_state);
      this.checkrForm.controls['dob'].disable();
      this.checkrForm.controls['ssn'].disable();
      this.checkrForm.controls['zipcode'].disable();
      this.checkrForm.controls['driver_license_number'].disable();
      this.checkrForm.controls['driver_license_state'].disable();
    }
  }

  checkr() {
    const param = {
      token: this.token,
      orgId : this.orgId,
      zip :  this.checkrForm.value.zipcode,
      driver_license_number :  this.checkrForm.value.driver_license_number,
      driver_license_state : this.checkrForm.value.driver_license_state,
      dob :this.checkrForm.value.dob,
      ssn : this.checkrForm.value.ssn
    }
    this._loader.present();

    // if(this.infoId){
    //   this._apiService.postRequest(this.url + UNITURL.updateUserInformation,
    //     param).subscribe(
    //       async (result) => {
    //         this._loader.dismiss();
    //         if(result.success){
    //           this._toast.presentToast(result.message);
    //           console.log('result', result);
    //         }
    //       }), (error) => {
    //         this._loader.dismiss();
    //         console.log('error', error)
    //       }
    // }else{
      this._apiService.postRequest(this.url + UNITURL.addUserInformation,
        param).subscribe(
          async (result) => {
            this._loader.dismiss();
            if(result.success){
              console.log('result', result);
              this._gs.sendRefershScreen("refresh");
              this._toast.presentToast(result.message);
            }
          }), (error) => {
            this._loader.dismiss();
            console.log('error', error)
          }
    }
  // }

}
