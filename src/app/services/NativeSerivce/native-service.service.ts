import { Injectable } from '@angular/core';
import { CommonServiceService } from '../CommonService/common-service.service';
import { Geolocation, Position } from '@capacitor/geolocation';
import { Platform } from '@ionic/angular';
import { App } from '@capacitor/app';
import { AppLauncher } from '@capacitor/app-launcher';
import { userLocationObject } from 'src/app/interface/userLocationObject';
import { defaultLocation } from 'src/app/utility/constants';

@Injectable({
  providedIn: 'root',
})
export class NativeServiceService {
  constructor(
    private commonService: CommonServiceService,
    private platform: Platform
  ) { }

  copyToClipboard(uniqueCode: string) {
    navigator.clipboard
      .writeText(uniqueCode)
      .then(() => {
        console.log('Code copied to clipboard');
        this.commonService.presentToast(
          'Code copied to clipboard',
          2000,
          'bottom',
          'success'
        );
      })
      .catch((err) => {
        console.error('Failed to copy code to clipboard: ', err);
        this.commonService.presentToast(
          'Failed to copy code to clipboard',
          2000,
          'bottom',
          'danger'
        );
      });
  }

  shareLocation(uniqueCode: string) {
    const code = uniqueCode;
    const shareText = `Please check my live location:\n\nCode: ${code}\n\nMake sure you have the app installed. If not, download it from the Play Store:\nhttps://play.google.com/store/apps/details?id=com.example.app`;

    if (navigator.share) {
      // Web Share API is supported
      navigator
        .share({
          title: 'Share Location Code',
          text: shareText,
        })
        .then(() => console.log('Successful share'))
        .catch((error) => console.error('Error sharing', error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      this.copyToClipboard(shareText);
      console.log('Web Share API not supported. Copied to clipboard.');
    }
  }

  async getUserLocation(): Promise<userLocationObject> {
    try {
      //check persmission
      await this.checkLocationPermission();

      // Get the current position
      const coordinates = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 5000,
      });
      return coordinates
    } catch (error: any) {
      // Handle any errors
      if (error.message == 'Location services are not enabled') {
        await this.commonService.presentToast(`Please turn on location.`, 1500, 'bottom', 'danger');
        //TODO: show location prompt
        this.enableLocation();
      } else {
        await this.commonService.presentToast(`${error.message}.`, 1500, 'bottom', 'danger');
      }
      return defaultLocation;
    }
  }

  async showPermissionAlertDialog(title: string, actionText: string, message: string) {
    await this.commonService.presentAlertWithAction(
      title,
      message,
      actionText,
      async () => {
        console.error("Not Working");
        try {
          await AppLauncher.openUrl({ url: 'app-settings:' });
        } catch (err) {
          console.error('Error opening app settings: ', err);
        }
      }
    )
  }

  enableLocation() {
    if (this.platform.is('android')) {
      //TODO: For Android, open the app-specific settings page
      console.log('Show enable location native dialog');
    }
  }

  async checkLocationPermission() {
    const isPermissionEnabled = await Geolocation.checkPermissions();
    console.log('persmission status : ', isPermissionEnabled);

    switch (isPermissionEnabled.coarseLocation) {
      case 'denied':
        return this.showPermissionAlertDialog("Location Permission", "Open App Settings", "It appears that you denied the location permission, Please enable it.")
      case 'prompt':
        Geolocation.requestPermissions({ permissions: ['coarseLocation'] });
        break;
      case 'prompt-with-rationale':
        Geolocation.requestPermissions({ permissions: ['coarseLocation'] });
        break;
      case 'granted':
        break;
    }

    switch (isPermissionEnabled.location) {
      case 'prompt':
        Geolocation.requestPermissions({ permissions: ['location'] });
        break
      case 'prompt-with-rationale':
        Geolocation.requestPermissions({ permissions: ['location'] });
        break
      case 'granted':
        break
      case 'denied':
        return this.showPermissionAlertDialog("Location precise permission", "Open App Settings", "It appears that you denied the location precise permission, Please enable it.")
    }
  }
}
