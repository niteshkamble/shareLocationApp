import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/AppService/app.service';
import { RoomService } from 'src/app/services/FirebaseService/room.service';
import { LocationTypesService } from 'src/app/services/LocationTypes/location-types.service';
import { NativeServiceService } from 'src/app/services/NativeSerivce/native-service.service';

@Component({
  selector: 'app-location-code-card',
  templateUrl: './location-code-card.component.html',
  styleUrls: ['./location-code-card.component.scss'],
})
export class LocationCodeCardComponent implements OnInit {
  uniqueCode: string | any;
  description: string | any;
  isRoomActive: boolean | undefined;
  userId: string | null = null;
  spectators = [
    {
      name: 'Alice Johnson',
      lastOnline: '2 minutes ago'
    },
    {
      name: 'Michael Smith',
      lastOnline: '5 minutes ago'
    },
    {
      name: 'Emma Brown',
      lastOnline: '10 minutes ago'
    },
    {
      name: 'John Doe',
      lastOnline: '15 minutes ago'
    },
    {
      name: 'Sophia Davis',
      lastOnline: '20 minutes ago'
    },
    {
      name: 'Liam Wilson',
      lastOnline: '25 minutes ago'
    },
    {
      name: 'Olivia Martinez',
      lastOnline: '30 minutes ago'
    },
    {
      name: 'Noah Taylor',
      lastOnline: '35 minutes ago'
    },
    {
      name: 'Ava Anderson',
      lastOnline: '40 minutes ago'
    },
    {
      name: 'James Moore',
      lastOnline: '45 minutes ago'
    }
  ];
  constructor(
    private locationTypeServie: LocationTypesService,
    private nativeService: NativeServiceService,
    private roomService: RoomService,
    private appStateService: AppService
  ) { }

  async ngOnInit() {
    this.appStateService.appState$.subscribe(state => {
      this.isRoomActive = state.isRoomActive,
        this.userId = state.uid
    })
    await this.getPersonalCodeData();
  }

  async refreshCode() {
    await this.getPersonalCodeData();
  }

  async getPersonalCodeData() {
    let personalLocation = await this.locationTypeServie.getLocationTypes();
    //0th for personal location
    this.uniqueCode = personalLocation[0].id;
    this.description = personalLocation[0].description;
    //1th  for like group location (not yet designed)
  }

  copyToClipboard() {
    this.nativeService.copyToClipboard(this.uniqueCode);
  }

  async shareLocation() {
    //get code
    //check & create firestore doc in room collection
    await this.roomService.createRoom(this.uniqueCode).then(() => {
      this.nativeService.shareLocation(this.uniqueCode);
    }).catch(err => {
      console.log("error creating room:", err);
    })

  }

  async stopLocationShare() {
    if (this.userId != null) {
      await this.roomService.stopSharingAndDeleteRoom(this.userId)
    } else {
      console.error("Oops, something went wrong.");
    }
  }

  getInitial(name: string): string {
    return name.charAt(0).toUpperCase();
  }
}
