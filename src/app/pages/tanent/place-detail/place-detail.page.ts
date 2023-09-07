import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { LoaderService } from 'src/app/services/loader.service';
import { AngularFireAuth } from '@angular/fire/auth'; // Import AngularFireAuth for Firebase Authentication
import { Storage } from '@ionic/storage';
import { CalendarResult } from 'ion2-calendar';
import { StartBookingPage } from '../start-booking/start-booking.page';
import { GlobalService } from 'src/app/services/global.service';
import { ApiService } from 'src/app/services/api-service.service';



declare var google;

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {
  @ViewChild("map", { static: false }) mapElement: ElementRef;

  image: any;
  amenities: any = [];
  reviewList: any = [];
  hostImage: any;
  data: any;
  displayMap: boolean = false;
  map: any;
  latlong: any;
  dates: any = [];
  token: any;
  orgId: any;
  reviewCount: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalCtrl: ModalController,
    private loader: LoaderService,
    private storage: Storage,
    private _gs: GlobalService,
    private afAuth: AngularFireAuth,
    private _api: ApiService
  ) {
    this.route.queryParams.subscribe((params) => {
      if (params && params.special) {
        this.data = JSON.parse(params.special);
        console.log(this.data);
        this.image = this.data.images;
        if (this.data.loc) {
          console.log(this.data.loc.coordinates);
          this.displayMap = true;
          let lat = this.data.loc.coordinates[1];
          let long = this.data.loc.coordinates[0];
          setTimeout(() => {
            this.loadMap(lat, long);
          }, 100);
        }
        if (this.data.videos && this.data.videos.length) {
          this.data.videos.map((x) => {
            let id = this.getEmbedUrl(x.url);
            x.url = `//www.youtube.com/embed/${id}`;
            return x;
          });
          this.image = this.image.concat(this.data.videos);
        }
        this.getTimings();
      }
      if (params && params.from) {
        this.getTimings();
      }
    });

    // Subscribe to authentication state changes
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        // User is authenticated, you can perform actions accordingly
        console.log('User is authenticated:', user);
        this.getUserData(); // Call this function when the user is authenticated
      } else {
        // User is not authenticated, handle this case
        console.log('User is not authenticated');
      }
    });
  }

  ngOnInit() {
    this.getUserData();
  }

  getUserData() {
    this.getReviews();
    this.storage.get("session").then((session) => {
      if (session) {
        this.storage.get("org").then((org) => {
          if (org) {
            this.token = session;
            this.orgId = org;
            this.getTimings();
          }
        });
      }
    });
  }

  getTimings() {
    if (this.token) {
      this.loader.present("Getting timeSlots ..");
      const params = {
        placeId: this.data._id,
        token: this.token,
        orgId: this.orgId
      };
      // Replace this.url with the actual URL
      this._api.postRequest('https://unit-session-default-rtdb.firebaseio.com', params).subscribe(
        async (result) => {
          this.loader.dismiss();
          if (result.success) {
            if (result.data && result.data.dates) {
              this.dates = result.data.dates;
            }
          } else {
            console.log('Error');
            this.loader.dismiss();
          }
        });
    }
  }

  async booking(place) {
    console.log(this.token);
    if (this.token) {
      // ... (your existing code)
    } else {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          from: "place-detail"
        },
      };
      this.router.navigate(["login"], navigationExtras);
    }
  }

  hostInfo() {
    console.log("@@hostInfo");
  }

  loadMap(lat?: any, long?: any) {
    let coords = new google.maps.LatLng(lat, long);
    let mapOptions = {
      center: coords,
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true,
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    let marker = new google.maps.Marker({
      map: this.map,
      position: coords,
    });
    google.maps.event.addListener(this.map, "idle", function () {
      google.maps.event.trigger(this.map, "resize");
    });
  }

  back() {
    this.router.navigate(["tabs/tab1"]);
  }

  // async review(e, unit) {
  //   e.stopPropagation();
  //   const modal = await this.modalCtrl.create({
  //     component: RatingPage,
  //     cssClass: '',
  //     componentProps: {
  //       'unitId': unit._id,
  //       'unitName': unit.name
  //     }
  //   });
  //   return await modal.present();
  // }

  // Implement getEmbedUrl and getReviews functions
  getEmbedUrl(url: string): string {
    // Implement your getEmbedUrl logic
    return '';
  }

  getReviews() {
    // Implement your getReviews logic
  }
}
