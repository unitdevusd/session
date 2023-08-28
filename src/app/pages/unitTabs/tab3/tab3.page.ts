import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api-service.service';
import { GlobalService } from 'src/app/services/global.service';
import { ToastService } from 'src/app/services/toast.service';
import { Storage } from '@ionic/storage';
import { AngularFireDatabase } from '@angular/fire/database'; // Import AngularFireDatabase


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  notificationList: any = [];
  loading: boolean;
  logged: boolean = false;
  token: any;
  orgId: any;
  text: string = `No notifications.`;
  msg: string = `No messages Yet.`;
  segment: string = 'notifications';
  constructor(
    private router: Router,
    private _apiService: ApiService,
    private _gs: GlobalService,
    private storage: Storage,
    private _toast: ToastService,
    private db: AngularFireDatabase // Inject AngularFireDatabase
  ) {
    this._gs.getUpdatedTabs().subscribe(status => {
      if (status) {
        this.token = status.token;
        this.orgId = status.orgId;
        this.logged = true;
        this.notifications();
      }
    });
    // logout status
    this._gs.getLogOut().subscribe(status => {
      if (status) {
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
        this.storage.get("org").then((org) => {
          if (org) {
            this.token = session;
            this.orgId = org;
            this.logged = true;
            this.notifications();
          }
        });
      }
    });
  }

  logIn() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        from: 'tabs/tab3'
      }
    }
    this.router.navigate(['login'], navigationExtras);
  }

  doRefresh(ev) {
    this.notifications();
    setTimeout(() => {
      console.log('Async operation has ended');
      ev.target.complete();
    }, 1000);
  }

  notifications() {
    this.loading = true;
    const params = {
      token: this.token,
      orgId: this.orgId
    };
    this.db.list('notifications').valueChanges().subscribe( // Use AngularFireDatabase to retrieve data
      (result) => {
        console.log(result);
        // Process the result data
        if (result && result.length) {
          this.notificationList = result;
          this.notificationList.reverse();
        }
        setTimeout(() => {
          this.loading = false;
        }, 1000);
      },
      (error) => {
        this.loading = false;
        this._toast.presentToast(error.description);
      }
    );
  }

  markasRead(noti, index) {
    this.markasReaded(noti._id, index);
  }

  markasReaded(_id: any, index: any) {
    // Implement the logic to mark the notification as read in Firebase
  }

  archive() {
    console.log('archive');
    // Implement the logic to archive notifications in Firebase
  }

  onNotiClick(noti, index) {
    console.log(noti);
    setTimeout(() => {
      // Handle different notification types based on your logic
      // For example, navigating to booking details, etc.
    }, 100);
  }

  segmentChanged(ev) {
    console.log(ev.detail.value);
    this.segment = ev.detail.value;
  }
}
