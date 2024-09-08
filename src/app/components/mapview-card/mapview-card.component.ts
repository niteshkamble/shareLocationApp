import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { AppState, modeType } from 'src/app/interface/AppStateInterface';
import {
  userLocationObject,
} from 'src/app/interface/userLocationObject';
import { AppService } from 'src/app/services/AppService/app.service';
import { AuthService } from 'src/app/services/FirebaseService/auth.service';
import { MapService } from 'src/app/services/MapService/map.service';
import { NativeServiceService } from 'src/app/services/NativeSerivce/native-service.service';
import {
  bigMapHeight,
  defaultLocation,
  smallMapHeight,
} from 'src/app/utility/constants';
const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-mapview-card',
  templateUrl: './mapview-card.component.html',
  styleUrls: ['./mapview-card.component.scss'],
})
export class MapviewCardComponent implements OnInit {
  private mapContainerId = 'map';
  mapMode: modeType = 'min-map';
  mapHeight: string = smallMapHeight;
  appState: AppState | undefined;
  userLocation: userLocationObject = {
    ...defaultLocation,
    isDefault: 'NOT_DEFAULT',
  };
  // isRoomActive:boolean|undefined;

  constructor(
    private nativeService: NativeServiceService,
    private authService: AuthService,
    private changeDetRef: ChangeDetectorRef,
    private mapService: MapService,
    private appServive: AppService
  ) { }

  async ngOnInit() {
    this.appServive.appState$.subscribe((state) => {
      // this.isRoomActive = state.isRoomActive;
      this.mapMode = state.mode;
      this.mapHeight = state.mode=='min-map'? smallMapHeight : bigMapHeight;
      this.mapService.reloadMap();
    });
    await this.getUserLocation();
  }

  async toggleMapView() {
    this.appServive.toggleMapMode(this.mapMode === 'min-map' ? 'full-map' : 'min-map')
    // this.appServive.updateRoomStatus(!this.isRoomActive ? true : false)
  }

  openSettings() { }

  logOut() {
    this.authService.logout();
  }

  async getUserLocation() {
    this.userLocation = await this.nativeService.getUserLocation();
    this.mapService.loadMap(this.mapContainerId, this.userLocation);
    this.changeDetRef.detectChanges();
  }
}
