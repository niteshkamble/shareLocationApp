import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { userLocationObject } from 'src/app/interface/userLocationObject';
import { defaultLocation } from 'src/app/utility/constants';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private map!: L.Map;
  userLocation: userLocationObject = { ...defaultLocation, isDefault: 'NOT_DEFAULT' };


  constructor() { }

  loadMap(containerId: string, userLocation: userLocationObject): L.Map {
    this.userLocation = userLocation;

    if(this.map){
      this.map.remove()
    }

    //init map 
    if (this.map == null) {
      this.map = L.map(containerId).setView([this.userLocation.coords.latitude, this.userLocation.coords.longitude], 13, {
        animate: true,
      });
      this.map.whenReady(() => {
        setTimeout(() => {
          this.map.invalidateSize();
        }, 1000);
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 25,
      }).addTo(this.map);
  
      L.marker([this.userLocation.coords.latitude, this.userLocation.coords.longitude])
        .addTo(this.map)
        .bindPopup(this.getPopupMessage())
        .openPopup();
    }
    return this.map;
  }

  getPopupMessage = () => {
    if (this.userLocation.coords.latitude == defaultLocation.coords.latitude) {
      //default text message
      return 'Location not found!';
    }
    return 'You are here.';
  }

  reloadMap(){
    setTimeout(() => {
      if (this.map) {
        this.map.invalidateSize();
        this.map.setView(
          [this.userLocation.coords.latitude, this.userLocation.coords.longitude],
          this.map.getZoom(),
          { animate: true }
        );
      }
    }, 100);
  }

}
