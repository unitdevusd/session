import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database'; // Import AngularFireDatabase
import { Storage } from '@ionic/storage';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {

  placeData: any = [];
  token: any;
  orgId: any;

  constructor(
    private router: Router,
    private storage: Storage,
    private _toast: ToastService,
    private afDB: AngularFireDatabase // Inject AngularFireDatabase
  ) { }

  ngOnInit() {
    this.getUserData();
  }

  async getUserData() {
    const session = await this.storage.get("session");
    const org = await this.storage.get("org");
    
    if (session && org) {
      this.token = session;
      this.orgId = org;
      this.getMybookedPlaces();
    }
  }

  async getMybookedPlaces() {
    try {
      if (this.token) {
        // Construct the Firebase Realtime Database query
        const query = this.afDB.database.ref('bookedPlaces')
          .orderByChild('token')
          .equalTo(this.token);

        // Execute the query
        query.once('value', snapshot => {
          const data = snapshot.val();
          if (data) {
            this.placeData = Object.values(data);
          }
        });
      }
    } catch (error) {
      console.error(error.description);
      this._toast.presentToast(error.description);
    }
  }

  viewDetails(Id) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        type: "Tenant",
        from: "tabs/tab4"
      }
    };
    this.router.navigate(['booking-detail', Id], navigationExtras);
  }

}
