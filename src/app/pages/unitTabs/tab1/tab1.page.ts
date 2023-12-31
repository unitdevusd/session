import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { IonSlides, IonSearchbar, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api-service.service';
import { GlobalService } from 'src/app/services/global.service';
import { LoaderService } from 'src/app/services/loader.service';
import { ToastService } from 'src/app/services/toast.service';
import { Storage } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {
  NativeGeocoder,
  NativeGeocoderResult,
  NativeGeocoderOptions
} from '@ionic-native/native-geocoder/ngx';
import { FiltersPage } from '../filters/filters.page';
import { Platform } from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/database'; // Import AngularFireDatabase


declare var google;

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  
  @ViewChild(IonSlides) slides: IonSlides;
  @ViewChild('searchbar', { static: false }) searchbar: IonSearchbar;
  
  
  spaceType: any[];
  placesList: any = [];
  today: any = Date.now();
  filters: any = {};
  spaceFilters: any = [];
  autocomplete: { input: string; };
  autocompleteItems: any[];
  GoogleAutocomplete: any;
  lat: any;
  long: any;
  address: string;
  hasFilter: boolean = true;
  displayName: boolean;
  size: number = 10;
  sizeFilter : number = 2; 
  token: any;
  orgId: any;
  isEnd : boolean = true;
  isfirst : boolean = false;
  user : string = 'User';
  clearFilter: boolean = false;


  constructor(
    private router: Router,
    private _apiService: ApiService,
    private _loader: LoaderService,
    private _gs: GlobalService,
    private afDB: AngularFireDatabase, // Inject AngularFireDatabase
    private storage : Storage,
    private _toast: ToastService,
    private geolocation : Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private db: AngularFireDatabase, // Add this line
    public zone: NgZone,
    public modalCtrl : ModalController)
     {
      
    // get current location
    setTimeout(() =>{ 
      this.getCurrentLocation();
    }, 1500);
    
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];

     // logout status
     this._gs.getLogOut().subscribe(status =>{
      if(status){
        this.placeMeta();
        this.displayName = true;
        this.getPlacesList(this.filters);
      }
    });
    
    this._gs.getData().subscribe(status =>{
      if(status){
        this.user = status.firstName +' '+ status.lastName;
      }
    });

    this._gs.getUpdatedTabs().subscribe(status => {
      if(status){
        this.token = status.token;
        this.orgId = status.orgId;
        this.displayName = true;
      }
    });
    this._gs.applyFilters().subscribe(filters =>{
      if(filters){
        console.log(filters);
        this.zone.run(()=>{
            this.filters = filters.refresh;
          this.getPlacesList(this.filters);
         this.displayName = true;
         this.clearFilter= false;
       });
      }
    });

    if(this.user == 'User'){
      this.storage.get('user').then((user) => {
        if (user) {
          this.user = user.firstName +''+ user.lastName;
        }
      });
    }
  }
  getCurrentLocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.lat = resp.coords.latitude;
      this.long = resp.coords.longitude;
      this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude);
    });
  }

  useCurrentLocation(){
    if(this.lat && this.long){
      this.filters['location'] = [this.lat,this.long];
    }
  }

  getAddressFromCoords(latitude: number, longitude: number) {
    console.log("getAddressFromCoords " + latitude + " " + longitude);
    if (latitude == undefined) {
      return;
    }
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };
    this.nativeGeocoder.reverseGeocode(latitude, longitude, options)
      .then((result: NativeGeocoderResult[]) => {
        this.address = "";
        let responseAddress = [];
        for (let [key, value] of Object.entries(result[0])) {
          if (value.length > 0)
            responseAddress.push(value);
        }
        responseAddress.reverse();
        for (let value of responseAddress) {
          this.address += value + ", ";
        }
        this.address = this.address.slice(0, -2);
      })
      .catch((error: any) => {
        this.address = "Address Not Available!";
      });
  }

  getPlacesList(filters: any) {
    this._loader.present();
    const params = {
      filters,
    };
    console.log(params);

    // Construct the Firebase Realtime Database query
    const query = this.afDB.database.ref('spaces')
      .orderByChild('filters')
      .equalTo(JSON.stringify(filters));

    // Execute the query
    query.once('value', snapshot => {
      const data = snapshot.val();
      if (data) {
        this.placesList = Object.values(data);
      }
      this._loader.dismiss();
    });
  }
  
  placeMeta() {
    const spaceTypeRef = this.db.list('spaceTypes'); // Reference to the 'spaceTypes' node in your Firebase database
    
    spaceTypeRef.valueChanges().subscribe(
      (spaceTypes: any[]) => {
        this.spaceType = spaceTypes;
      },
      (error) => {
        console.error('Error fetching space types:', error);
        this._toast.presentToast('Error fetching space types');
      }
    );
  }

  ngOnInit() {
    this.placeMeta();
    this.setIcon();
    this.getPlacesList(this.filters);
  }

  setIcon() {
    if (Object.keys(this.filters).length === 0) {
      this.hasFilter = false;
      this.displayName = true;
    } else {
      this.hasFilter = true;
      this.displayName = false;
    }
  }


  searchLocation() {
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
      (predictions, status) => {
        this.autocompleteItems = [];
        this.zone.run(() => {
          predictions.forEach((prediction) => {
            this.autocompleteItems.push(prediction);
          });
        });
      });
  }
  clearAutocomplete() {
    this.autocompleteItems = []
    this.autocomplete.input = '';
  }

  checkFocus() {}
  
  async openFilter() {
    const modal = await this.modalCtrl.create({
      component: FiltersPage,
      cssClass: 'my-custom-modal-css',
      componentProps: {
        filters: JSON.stringify(this.filters)
      }
    });
    return await modal.present();
  }

  place(place) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        special: JSON.stringify(place)
      }
    };
    this.router.navigate(['place-detail'], navigationExtras);
  }


  spaceClick(item) {
    console.log(item);
    this.filters['spaceType'] = item ? item : [];
    console.log(this.filters);
    this.setIcon();
    this.getPlacesList(this.filters);
  }

  selectSearchResult(item) {
    this.address = item.structured_formatting.main_text;
    this.autocomplete.input = this.address;
    this.autocompleteItems = [];
    this.getLatLOng(item.description).then(location =>{
      this.filters['location'] = [location[0]['longitude'],location[0]['latitude']];
      console.log(this.filters);
      this.getPlacesList(this.filters);
    });
  }

  getLatLOng(addressString: any) : Promise<any> {
    console.log(addressString);
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5,
    };
    console.log(options);
    return new Promise((resolve, reject) =>
    {
       this.nativeGeocoder.forwardGeocode(addressString)
       .then((result: NativeGeocoderResult[]) => 
       {
          console.log(result);
          resolve(result);
       })
       .catch((error: any) => 
       {
          reject(error);
       });
    });
  }

  slidePrev() {
    this.slides.slidePrev().then(x =>{
      console.log('x');
    })
  }
  slideNext() {
    this.slides.slideNext().then(X=>{
      console.log('X');
    })  
  }

  clearFilters(){
    this.zone.run(()=>{
       this.spaceType.map( x=> x.status = false);
       this.filters = {};
       this.getPlacesList(this.filters);
      this.displayName = true;
      this.clearFilter= false;
    });
  }

 
}