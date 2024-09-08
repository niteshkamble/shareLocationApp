import { Injectable } from '@angular/core';
import { getAuth } from '@angular/fire/auth';
import {
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Geolocation } from '@capacitor/geolocation';
import { NativeServiceService } from '../NativeSerivce/native-service.service';
import { CommonServiceService } from '../CommonService/common-service.service';
import { AlertController } from '@ionic/angular';
import { AppService } from '../AppService/app.service';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  constructor(
    private firestore: Firestore,
    private nativeService: NativeServiceService,
    private commonService: CommonServiceService,
    private alertController: AlertController,
    private appStateService: AppService,
  ) { }

  async createRoom(uniqueCode: string) {
    try {
      const user = getAuth().currentUser;
      if (!user) {
        throw new Error('User not logged in');
      }

      const roomDocRef = doc(this.firestore, 'rooms', user.uid);
      const docSnapshot = await getDoc(roomDocRef);

      if (docSnapshot.exists()) {
        this.commonService.presentToast("Room already exists.", 1500, "bottom", 'danger');
        throw new Error('Room code already exists');
      }

      await setDoc(roomDocRef, {
        uniqueCode,
        userId: user.uid,
        location: {
          latitude: null,
          longitude: null,
        },
      });
      // Update the state to indicate room is active
      this.appStateService.updateAppState({ isRoomActive: true });

      // Start tracking user location
      this.trackUserLocation(user.uid);
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  }

  async isRoomActive(): Promise<boolean | null> {
    try {
      const user = getAuth().currentUser;
      if (!user) {
        throw new Error('User not logged in');
      }

      const roomDocRef = doc(this.firestore, 'rooms', user.uid);
      const docSnapshot = await getDoc(roomDocRef);

      return docSnapshot.exists();
    } catch (error) {
      console.error("Failed to check : if room is active.", error);
      return null;
    }
  }

  async trackUserLocation(userId: string) {
    await this.nativeService.checkLocationPermission();
    try {
      Geolocation.watchPosition({ enableHighAccuracy: true }, (position) => {
        console.log('Got new location:', position);

        const userDocRef = doc(this.firestore, 'rooms', userId);
        if (position) {
          updateDoc(userDocRef, {
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
          });
        } else {
          console.warn('Not getting geo-location');
        }
      });
    } catch (error: any) {
      // Handle any errors
      if (error.message == 'Location services are not enabled') {
        await this.commonService.presentToast(
          `Please turn on location.`,
          1500,
          'bottom',
          'danger'
        );
        //TODO: show location prompt
        this.nativeService.enableLocation();
      } else {
        await this.commonService.presentToast(
          `${error.message}.`,
          1500,
          'bottom',
          'danger'
        );
      }
      console.log('Failed to location', error);
    }
  }

  async stopSharingAndDeleteRoom(userId: string) {
    const alert = await this.alertController.create({
      header: 'Confirm',
      message: 'Are you sure you want to stop location sharing?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Delete canceled');
          }
        },
        {
          text: 'Delete',
          handler: async () => {
            try {
              const roomDocRef = doc(this.firestore, 'rooms', userId);
              const docSnapshot = await getDoc(roomDocRef);
              if (docSnapshot.exists()) {
                await deleteDoc(roomDocRef);
                //updating room status: app state
                this.appStateService.updateRoomStatus(false);
                console.log('Room deleted successfully.');
              } else {
                console.log('No room found to delete.');
              }
            } catch (error) {
              console.error('Error deleting room:', error);
            }
          }
        }
      ]
    });

    await alert.present();
  }
}
