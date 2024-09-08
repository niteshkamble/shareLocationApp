import { Component, OnInit } from '@angular/core';
import { getAuth } from 'firebase/auth';
import { AppService } from 'src/app/services/AppService/app.service';
import { RoomService } from 'src/app/services/FirebaseService/room.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  isRoomActive: boolean | undefined;

  constructor(private appStateService: AppService, private roomService: RoomService) { }

  ngOnInit() {
    this.appStateService.appState$.subscribe(state => {
      this.isRoomActive = state.isRoomActive
    })
  }



  async ionViewWillEnter() {
    //get user data 
    let user = getAuth().currentUser;
    if (user) {
      //get status of room data
      const status = await this.roomService.isRoomActive();
      if (status !== null) {
        this.appStateService.updateRoomStatus(status)
      }
      //online status data
    }
  }

  async checkRoomIsActive(uid: string) {

  }

}