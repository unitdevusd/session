import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api-service.service';
import { GlobalService } from 'src/app/services/global.service';
import { AngularFireDatabase } from '@angular/fire/database'; // Import AngularFireDatabase

@Component({
  selector: 'app-filters',
  templateUrl: './filters.page.html',
  styleUrls: ['./filters.page.scss'],
})
export class FiltersPage implements OnInit {

  @Input() filters: any;

  features: any = [];
  timeSlotTypeList: any = [];
  public dates = {
    startDate: '',
    endDate: ''
  }
  selectedFeaturs: any = [];
  selectedTimeSlot: any = [];
  selectedAccess: any;
  city: any = '';

  constructor(
    private api: ApiService,
    private _gs: GlobalService,
    private modalCtrl: ModalController,
    private db: AngularFireDatabase // Inject AngularFireDatabase
  ) { }

  ngOnInit() {
    // Initialize the filters based on your Firebase data
    this.loadFiltersFromFirebase();
  }

  loadFiltersFromFirebase() {
    // Use AngularFireDatabase to fetch data from Firebase
    this.db.list('features').valueChanges().subscribe(
      (features) => {
        this.features = features;
      }
    );

    // Fetch other filter data from Firebase and set it accordingly
    // You can use db.object() or db.list() depending on your database structure
  }

  onTimeChange(ev) {
    this.selectedTimeSlot = [];
    this.selectedTimeSlot.push(ev.detail.value);
  }

 applyFilters() {
    let filters: any = {};
    if (this.selectedTimeSlot.length) {
      filters['accessTime'] = this.selectedTimeSlot;
    }
    if (this.dates.startDate && this.dates.endDate) {
      filters['selectedDates'] = this.dates;
    }
    if (this.city) {
      filters['city'] = this.city;
    }
    if (this.features.length) {
      let featuresArray = [];
      for (let i = 0; i < this.features.length; i++) {
        featuresArray.push(this.features[i]._id);
      }
      filters['features'] = featuresArray;
    }
    console.log(filters);
    // return;
    this.dismiss();
    this._gs.setFilterRefresh(filters);
  }

  

  clearFilters() {
    this.clearAll();
    this._gs.setFilterRefresh("");
  }
  clearAll() {
    this.selectedFeaturs = [];
    this.dates.startDate = '';
    this.dates.endDate = '';
    this.city = '';
    this.selectedAccess = '';
    this.dismiss();
  }

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

}



