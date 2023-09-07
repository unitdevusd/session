import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api-service.service';
import { GlobalService } from 'src/app/services/global.service';
import { LoaderService } from 'src/app/services/loader.service';
import { ToastService } from 'src/app/services/toast.service';
import { Storage } from '@ionic/storage';
import { AngularFireAuth } from '@angular/fire/auth';



declare var google;

@Component({
  selector: 'app-booking-detail',
  templateUrl: './booking-detail.page.html',
  styleUrls: ['./booking-detail.page.scss'],
})
export class BookingDetailPage implements OnInit {

  @ViewChild("map", { static: false }) mapElement: ElementRef;

  bookingData: any;
  // Define URLs directly here, replace them with your actual URLs
  url: any = {
    placeMeta: 'https://unit-session-default-rtdb.firebaseio.com/meta',
    bookingDetails: 'https://unit-session-default-rtdb.firebaseio.com/booking',
    cancelBooking: 'https://unit-session-default-rtdb.firebaseio.com/cancel',
    checkin: 'https://unit-session-default-rtdb.firebaseio.com/checkin',
  };
  type: any = "";
  isCheckin: boolean = false;
  status: any;
  dataReturned: any;
  profileImage: any;
  tabType: any;
  notificationData: any;
  bookingId: any;
  displayMap: boolean;
  map: any;
  token: any;
  orgId: any;
  priviousUrl: any;
  text: string;
  amenities: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _api: ApiService,
    private alert: ToastService,
    private refresh: GlobalService,
    private alrtCtrl: AlertController,
    private loader: LoaderService,
    private storage: Storage,
    private navController: NavController,
    private _gs: GlobalService,
    private afAuth: AngularFireAuth
  ) {
    this.route.params.subscribe(params => {
      this.bookingId = params.id;
    });
    this.route.queryParams.subscribe(qParams => {
      this.type = qParams.type;
      if (qParams.from) {
        this.priviousUrl = qParams.from;
      }
    });
  }

  ngOnInit() {
    this.placeMeta();
    this.getUserData();
  }

  placeMeta() {
    const params = {
      apiKey: 'YOUR_API_KEY', // Replace with your API key
    };
    this._api.postRequest(this.url.placeMeta, params).subscribe(
      (result) => {
        if (result.success) {
          this.amenities = result.data.list.amenities;
          console.log(this.amenities);
        }
      }, (error) => {
        console.log(error.description);
      });
  }

  getUserData() {
    this.storage.get("session").then((session) => {
      if (session) {
        this.storage.get("org").then((org) => {
          if (org) {
            this.token = session;
            this.orgId = org;
            this.getBookingDetails();
          }
        });
      }
    });
  }

  getBookingDetails() {
    this.loader.present();
    const params = {
      token: this.token,
      orgId: this.orgId,
      bookingId: this.bookingId
    };
    console.log(params);
    this._api.postRequest(this.url.bookingDetails, params).subscribe(
      async (result) => {
        console.log(result);
        if (result.success) {
          console.log(result.data);
          if (result.data.bookingDetails) {
            this.bookingData = result.data.bookingDetails;
            if (this.bookingData.place.loc) {
              this.displayMap = true;
              let lat = this.bookingData.place.loc.coordinates[1];
              let long = this.bookingData.place.loc.coordinates[0];
              setTimeout(() => {
                this.loadMap(lat, long);
              }, 100);
            }
            if (this.bookingData.place.amenities && this.bookingData.place.amenities.length) {
              let amenties = this.bookingData.place.amenities.map(x => {
                return { '_id': x }
              });
              let result2 = [];
              if (this.amenities.length) {
                this.amenities.map(x => {
                  amenties.map(y => {
                    if (y._id == x._id) {
                      result2.push(x);
                    }
                  })
                });
              }
              this.amenities = result2;
            }
            if (this.bookingData.tenantInfo.profile.profilePic != null && this.type == 'Tenant') {
              this.profileImage = this.bookingData.tenantInfo.profile.profilePic;
            }
            else if (this.bookingData.ownerInfo.profile.profilePic != null && this.type == 'Owner') {
              this.profileImage = this.bookingData.ownerInfo.profile.profilePic;
            } else {
              this.profileImage = "/assets/imgs/dummyUser.png";
            }
          } else {
            this.text = "Place Data not Found!";
          }
        }
        this.loader.dismiss();
      }, (error) => {
        this.loader.dismiss();
        console.log(error.description);
        this.alert.presentToast(error.description);
      });
  }

  loadMap(lat: any, long: any) {
    let coords = new google.maps.LatLng(lat, long);
    let mapOtions = {
      center: coords,
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true,
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOtions);
    let marker = new google.maps.Marker({
      map: this.map,
      position: coords,
    });
    google.maps.event.addListener(this.map, "idle", function () {
      google.maps.event.trigger(this.map, "resize");
    });
  }

  async cancelBookingAlrt() {
    const alert = await this.alrtCtrl.create({
      header: 'Lose your data',
      message: 'Are you sure that you want to cancel your booking ?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => { }
        }, {
          text: 'ok',
          handler: () => {
            this.cancelBooking();
          }
        }
      ]
    });
    await alert.present();
  }

  cancelBooking() {
    // Check if the user is authenticated
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        const params = {
          // Use user.uid as the token
          token: user.uid,
          bookingId: this.bookingData._id,
          orgId: this.orgId
        };
        this._api.postRequest(this.url.cancelBooking, params).subscribe(
          async (result) => {
            if (result.success) {
              this.refresh.refreshMyStays("refresh");
              this.alert.presentToast(result.message);
              this.router.navigate(['tabs/tab1']);
            }
          }
        ), (error) => {
          console.log(error.description);
          this.alert.presentToast(error.description);
        }
      }
    });
  }

  checkin(url) {
    if (this.token) {
      let placeid = "";
      if (this.type == true) {
        placeid = this.bookingData._id;
      } else {
        placeid = this.bookingData.place._id;
      }
      const params = {
        token: this.token,
        bookingid: placeid,
        orgId: this.orgId
      }
      console.log(params);
      this._api.postRequest(this.url.checkin, params).subscribe(
        async (result) => {
          if (result.success) {
            this.refresh.refreshMyStays("refresh");
            this.alert.presentToast(result.message);
          }
        }
      ), (error) => {
        console.log(error.description);
        this.alert.presentToast(error.description);
      }
    }
  }

  async postReview() { }

  back() {
    console.log(this.priviousUrl);
    if (this.priviousUrl) {
      console.log(this.priviousUrl);
      this.navController.navigateRoot([this.priviousUrl]);
    } else {
      this.navController.navigateRoot(["tabs/tab2"]);
    }
  }
}
