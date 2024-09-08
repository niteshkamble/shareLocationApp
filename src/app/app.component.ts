import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/FirebaseService/auth.service';
import { Router } from '@angular/router';
import { getAuth } from '@angular/fire/auth';
import { isPlatform, Platform } from '@ionic/angular';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { environment } from 'src/environments/environment.prod';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  loading = true;

  constructor(private authService: AuthService, private router: Router,private platform:Platform) {
    if(!isPlatform("capacitor")){
      // this.initializeApp();
    }
  }
//for google auth
  initializeApp() {
    this.platform.ready().then(() => {
      GoogleAuth.initialize(
        {
          clientId: environment.GoogleAuth.clientId,
          scopes: ['profile', 'email'],
          grantOfflineAccess: false,
        }
      )
    })
  }

  ngOnInit() {
    this.authService.user.subscribe({
      next: (user) => {
        if (user !== undefined) {
          this.loading = false;
          if (user) {
            // User is logged in, navigate to home page
            this.router.navigate(['/home'],{ replaceUrl: true });
          } else {
            // User is not logged in, navigate to login page
            this.router.navigate(['/login'],{ replaceUrl: true });
          }
        }
      },
      error: (error) => {
        this.loading = false;
        this.router.navigate(['/login']);
        console.error('Error getting user:', error);
      },
    });
  }
}
