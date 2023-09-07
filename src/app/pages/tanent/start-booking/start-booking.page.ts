import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ModalController, NavParams } from '@ionic/angular';
import { CalendarComponentOptions } from 'ion2-calendar';
import { ToastService } from 'src/app/services/toast.service';
import { AngularFireAuth } from '@angular/fire/auth'; // Import AngularFireAuth for Firebase Authentication

@Component({
  selector: 'app-start-booking',
  templateUrl: './start-booking.page.html',
  styleUrls: ['./start-booking.page.scss'],
})
export class StartBookingPage implements OnInit {

  @Input() placeInfo: any;
  @Input() editInfo : any;
  @Input() dates : any;

  dateRange: { from: string; to: string; };
  optionsRange: CalendarComponentOptions = {
    pickMode: 'range',
    daysConfig: []
  };
  event: any;
  description: any;
  placeDetails: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public navParams: NavParams,
    public modalCtrl : ModalController,
    public toast : ToastService,
    private afAuth: AngularFireAuth
  ) {
    if(navParams.get('placeInfo')){
      this.placeInfo = JSON.parse(navParams.get('placeInfo'));
      console.log(this.placeInfo);
    }
    if(navParams.get('editInfo')){
      let params = navParams.get('editInfo');
      this.description = params.desc;
      this.dateRange = {
        from: params.startDate,
        to : params.endDate
      };
    };
    if(navParams.get('dates')){
      console.log(JSON.parse(navParams.get('dates')));
      Object.assign(this.optionsRange, { daysConfig: JSON.parse(navParams.get('dates')) });
    }
    let d = new Date();
    let year = d.getFullYear();
    if (year) {
      year = year + 1;
    }
    Object.assign(this.optionsRange, { to: new Date(year, 11.1) });
    this.route.queryParams.subscribe(params => {
      if (params.place)
        this.placeDetails = JSON.parse(params.place);
    });
  }

  ngOnInit() {
    // You can use afAuth to check if the user is authenticated
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        // User is authenticated, you can perform actions accordingly
        console.log('User is authenticated:', user);
      } else {
        // User is not authenticated, handle this case
        console.log('User is not authenticated');
      }
    });
  }

  onChange(event) {
    this.event = event;
  }

  async book() {
    if (!this.event) {
      this.toast.presentToast('Please select start Date and end Date');
      return;
    }

    let params = {};
    if (this.event) {
      params = {
        startDate: this.event.from._i,
        endDate: this.event.to._i,
        desc: this.description
      };
    } else {
      params = {
        startDate: this.dateRange.from,
        endDate: this.dateRange.to,
        desc: this.description
      };
    }

    console.log('@@', params);
    
    let navigationExtras: NavigationExtras = {
      queryParams: {
        bookPlaceParams: JSON.stringify(params),
        placeDetails: this.placeInfo
      }
    };
    
    this.router.navigate(['show-payment-info'], navigationExtras);
    this.dismissModal();
  }

  dismissModal() {
    console.log('dismiss');
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  async signInWithFirebase() {
    // Implement Firebase sign-in logic here, such as email/password authentication
    try {
      // Example: Sign in with email and password
      const { email, password } = getUserCredentials(); // Replace with actual credentials
      await this.afAuth.signInWithEmailAndPassword(email, password);
      console.log('User signed in with Firebase');
    } catch (error) {
      console.error('Firebase sign-in error:', error);
      // Handle sign-in error, display a message to the user, etc.
    }
  }

  async signOutFromFirebase() {
    // Implement Firebase sign-out logic here
    try {
      await this.afAuth.signOut();
      console.log('User signed out from Firebase');
    } catch (error) {
      console.error('Firebase sign-out error:', error);
      // Handle sign-out error, display a message to the user, etc.
    }
  }
}



function getUserCredentials(): { email: string, password: string } | null {
  // Implement logic to get user credentials (email and password)
  // You can fetch these values from a form, input fields, or any other source.
  // Perform necessary validation.
  // Return an object with email and password properties if valid.
  // Return null if credentials are not available or invalid.

  const email = 'user@example.com'; // Replace with your logic to obtain the email
  const password = 'user_password'; // Replace with your logic to obtain the password

  // Example validation:
  if (!email || !password) {
    return null; // Return null for incomplete credentials
  }

  return { email, password }; // Return the user's credentials as an object
};
