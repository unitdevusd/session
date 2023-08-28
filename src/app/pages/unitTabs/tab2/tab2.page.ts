import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api-service.service';
import { GlobalService } from 'src/app/services/global.service';
import { LoaderService } from 'src/app/services/loader.service';
import { Storage } from '@ionic/storage';
import { ToastService } from 'src/app/services/toast.service';
import { segment,getDays } from 'src/app/utilities/mainfunction';
import { IonSlides } from '@ionic/angular';
import * as moment from 'moment';
import { AngularFireDatabase } from '@angular/fire/database'; // Import AngularFireDatabase


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page  implements OnInit {

  segment = 0;
  
  placeData: any;
  bookedlist: any;
  price: number;
  logged: boolean = false;
  numberOfMonths: any;
  token: any;
  orgId: any;
  selectedSlider: any;

  constructor(
    private router: Router,
    private _apiService: ApiService,
    private _loader: LoaderService,
    private _gs: GlobalService,
    private storage : Storage,
    private _toast: ToastService,
    private db: AngularFireDatabase // Inject AngularFireDatabase

  ) {

    this._gs.getUpdatedTabs().subscribe(status => {
      if(status){
        this.token = status.token;
        this.orgId = status.orgId;
        this.logged = true;
        this.getBookingInfo();
      }
    });
    
    this._gs.getMyStaysRefresh().subscribe(status =>{
      if(status){
        this.getBookingInfo();
      }
    });
    // logout status
    this._gs.getLogOut().subscribe(status =>{
      if(status){
        this.logged = false;
      }
    });
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
            this.logged = true;
            this.getBookingInfo();
          }
        });
      }
    });
  }

  getBookingInfo() {
    this.getMyStays();
  }

  getMyStays() {
    this._loader.present();
    if (this.token && this.orgId) {
      this.db.list('mybookings').valueChanges().subscribe(
        (result: any) => {
          console.log(result);
          if (result && result.data && result.data.bookingList) {
            this.placeData = segment(result.data.bookingList);
            if (this.placeData.bookedlist.length || this.placeData.cancledList.length || this.placeData.completedList.length) {
              this.placeData.bookedlist.reverse();
              this.placeData.cancledList.reverse();
              this.placeData.completedList.reverse();
            }
          } else {
            this.placeData = null;
          }
          this._loader.dismiss();
        },
        (error) => {
          this._loader.dismiss();
          this._toast.presentToast(error.description);
        }
      );
    }
  }
  
  logIn() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        from: 'tabs/tab2'
      }
    }
    this.router.navigate(['login'], navigationExtras);
  }

  async segmentChanged(ev: any) {
    await this.selectedSlider.slideTo(this.segment);
  }

  async slideChanged(slider : IonSlides) {
    this.selectedSlider = slider;
    slider.getActiveIndex().then((value) =>{
      console.log(value);
      this.segment = value;
    });
  }

  bookingDeatils(place, tabType) {
    if (place.bookedStatus == "canceled" || place.bookedStatus == "complete") {
      this.navigateToDetails(place, tabType);
    } else {
      if(place.bookedStatus == "confirm"){
        if (place.paymentStatus == "notPaid") {
          this.navigateToPayment(place);
        } else {
          this.navigateToDetails(place, tabType);
        }
      }else{
        if (place.paymentStatus == "notPaid") {
          this.navigateToPayment(place);
        } else {
          this.navigateToDetails(place, tabType);
        }
      }
      
    }
  }
  navigateToPayment(place: any) {
    let newStartDate = moment(place.startDate).format('YYYY-MM-DD');
    let newEndDate = moment(place.endDate).format('YYYY-MM-DD');
    let noOfDays: number = getDays(newStartDate, newEndDate);
    console.log(noOfDays);
    let params = {
      endDate: place.endDate,
      placeId: place._id,
      startDate: place.startDate
    };
    let navigationExtras: NavigationExtras = {
      queryParams: {
        bookPlaceParams: JSON.stringify(params),
        placeData: JSON.stringify(place),
        from: 'tabs/tab2'
      }
    }
    this.router.navigate(['show-payment-info'], navigationExtras);
  }
  navigateToDetails(place: any, tabType: any) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        type: "Owner",
        tabType: tabType
      }
    };
    this.router.navigate(['booking-detail',place._id], navigationExtras);
  } 
}
