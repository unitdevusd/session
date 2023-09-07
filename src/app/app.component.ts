
import { Platform, LoadingController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Plugins, NetworkStatus, PluginListenerHandle } from '@capacitor/core';

import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

const { Network } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit{

  networkStatus: NetworkStatus;
  networkListener: PluginListenerHandle;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private afAuth: AngularFireAuth,
    private router: Router,
    private _loader: LoadingController,
  ) {
    this.initializeApp();
  }


  ngOnInit() {  // Added this ngOnInit method
    this.afAuth.authState.subscribe(user => {
      if (user) {
        // User is logged in, you can navigate to tabs or another page
        this.router.navigate(['/tabs']);
      } else {
        // User is not logged in, you can navigate to the login page
        this.router.navigate(['/login']);
      }
    });
  }
  
  async initializeApp() {
    await this.platform.ready();

    this.statusBar.styleDefault();
    this.splashScreen.hide();

    this.networkListener = Network.addListener('networkStatusChange', (status) => {
      this.networkStatus = status;
      if (this.networkStatus.connected) {
        this._loader.dismiss();
      } else {
        this.presentLoading('You are offline. Waiting for internet connection.');
      }
    });

    this.networkStatus = await Network.getStatus();
  }

  async presentLoading(message) {
    const loading = await this._loader.create({
      message,
    });
    return await loading.present();
  }
}
