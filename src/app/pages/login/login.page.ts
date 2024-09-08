import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/FirebaseService/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private authService:AuthService) { }

  ngOnInit() {
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle();   
  }

  loginAnonymously(){
    this.authService.loginAnonymously();
  }

}
