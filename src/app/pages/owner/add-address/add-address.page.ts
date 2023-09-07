import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
declare var google;

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.page.html',
  styleUrls: ['./add-address.page.scss'],
})
export class AddAddressPage implements OnInit {

  @ViewChild('map', { static: false }) mapElement: ElementRef;


  lat: any;
  long: any;
  address: string;
  disable: boolean = true;
  displayMap: boolean = false;
  latlong: any = [];

  map: any;
  latitude: any;
  longitude: any;
  priviousPage: any = '';
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private nativeGeocoder: NativeGeocoder
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params.address) {
        this.address = params.address;
        console.log(params.location);
        this.latlong = JSON.parse(params.location);
        this.displayMap = true;
        let lat = this.latlong[0].latitude;
        let long = this.latlong[0].longitude;
        setTimeout(()=>{
           this.loadMap(lat,long);
        }, 100);
      }
      if(params.priviousPage){
        this.priviousPage = params.priviousPage;
      }
    });
  }

  loadMap(lat?: any, long?: any) {
    
    let coords = new google.maps.LatLng(lat, long);
      let mapOtions = {
        center: coords,
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true,
      } 
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOtions);
      let marker  =  new google.maps.Marker({
        map: this.map,
        position: coords
      });
      google.maps.event.addListener(this.map, "idle", function(){
        google.maps.event.trigger(this.map, 'resize'); 
      });
      this.map.addListener('dragend', () => {
        this.latitude = this.map.center.lat();
        this.longitude = this.map.center.lng();
        this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng())
      });
  }

  getAddressFromCoords(latitude: any, longitude: any) {
    console.log("getAddressFromCoords " + latitude + " " + longitude);
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

  back() {
    console.log(this.priviousPage);
    if(this.priviousPage){
      this.router.navigate([this.priviousPage]);
    }else{
      this.router.navigate(['tabs/my-spaces']);
    }
  }

  async inputClicked() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        from: 'address'
      }
    };
    this.router.navigate(['/location'], navigationExtras);
  }


  next() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        location: JSON.stringify(this.latlong),
        address: this.address
      }
    };
    this.router.navigate(['space-details'], navigationExtras);
  }
}
