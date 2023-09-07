import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { IonSearchbar } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';

declare var google;

@Component({
  selector: 'app-location-select',
  templateUrl: './location-select.page.html',
  styleUrls: ['./location-select.page.scss'],
})
export class LocationSelectPage implements OnInit {

  autocomplete: { input: string; };
  autocompleteItems: any[];
  GoogleAutocomplete: any;
  lat: any;
  long: any;
  address: string;
  fromPage: string;
  @ViewChild('searchbar', { static: false }) searchbar: IonSearchbar;
 
  
  constructor(
    private geolocation: Geolocation,
    public zone: NgZone,
    private router: Router,
    private nativeGeocoder: NativeGeocoder,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(params => {
      this.fromPage = params.from;
    });
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];

  }
     
  ionViewWillEnter() {
    setTimeout(() =>
      this.setFocus()
      , 300);
  }
  setFocus(): void {
    this.searchbar.setFocus();
  }

  ngOnInit() {
    console.log('@@@');
    this.getCurrentLocation();
  }

  getCurrentLocation() {

    this.geolocation.getCurrentPosition().then((resp) => {
      console.log('@@',resp);
      this.lat = resp.coords.latitude;
      this.long = resp.coords.longitude;
      this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude);
    });
  }



  close() {
    if (this.fromPage == 'address') {
      this.router.navigate(['/add-address']);
    } else {
      this.router.navigate(['tabs/tab1']);
    }
  }

  useCurrentLoaction() {
    if (this.fromPage == 'address') {
      this.navigateToAddress();
    } else {
      let locationLatLong = [];
      let latlong = {
        latitude: this.lat,
        longitude : this.long
      }
       locationLatLong.push(latlong);
      let navigationExtras: NavigationExtras = {
        queryParams: {
          location: JSON.stringify(locationLatLong)
        }
      };
      this.router.navigate(['/category'], navigationExtras);
    }
  }

  selectSearchResult(item) {
    console.log(item);
    if (this.fromPage == 'address') {
      this.navigateToAddress(item);
    } else {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          location: JSON.stringify(item)
        }
      };
      this.router.navigate(['/category'], navigationExtras);
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
            console.log('@@', this.autocompleteItems);
          });
        });
      });
  }

  clearAutocomplete() {
    this.autocompleteItems = []
    this.autocomplete.input = '';
  }

  navigateToAddress(item?) {
    let locationLatLong = [];
     
      let latlong = {
        latitude: this.lat,
        longitude : this.long
      }
       locationLatLong.push(latlong);
    if (item) {
      console.log(this.getLatLOng(item.description));
     this.getLatLOng(item.description).then(location =>{
  
          let navigationExtras: NavigationExtras = {
            queryParams: {
              location: JSON.stringify(location),
              address: item.description
            }
          };
          this.router.navigate(['/add-address'], navigationExtras);
      });
    } else {
      console.log('In 149');
      let inFo = this.getAddressFromCoords(this.lat, this.long);
      console.log(inFo);
      if(this.address){
        let navigationExtras: NavigationExtras = {
          queryParams: {
            location: JSON.stringify(locationLatLong),
            address: this.address 
          }
        };
        this.router.navigate(['/add-address'], navigationExtras);
      }
    }
  }

  getAddressFromCoords(latitude: number, longitude: number) {
    
    console.log("getAddressFromCoords " + latitude + " " + longitude);
    if(latitude == undefined){
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
}
