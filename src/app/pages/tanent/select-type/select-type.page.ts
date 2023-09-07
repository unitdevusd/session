import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-select-type',
  templateUrl: './select-type.page.html',
  styleUrls: ['./select-type.page.scss'],
})
export class SelectTypePage implements OnInit {
  data: any;
  bookingId: String;
  startDate: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params && params.notification) {
          this.data = JSON.parse(params.notification);
          this.bookingId = this.data.meta.spaceDetails._id;
          this.startDate = this.data.meta.spaceDetails.endDate;
      }
    });
  }

  extend(){
    const navigationExtras : NavigationExtras = {
      queryParams : {
          bookingId : this.bookingId,
          startDate : this.startDate
      }
    };
    this.router.navigate(['extend-booking'], navigationExtras);
  }
  pickUp(){
    const navigationExtras : NavigationExtras = {
      queryParams : {
        bookingId : this.bookingId,
        endDate : this.startDate
      }
    };
    this.router.navigate(['pick-up'], navigationExtras);
  }
  
  back(){
    this.router.navigate(['tabs/tab3']);
  }

}
