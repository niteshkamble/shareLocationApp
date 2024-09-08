import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
type PositionType = 'top' | 'bottom' | 'middle' | undefined;

@Injectable({
  providedIn: 'root'
})

export class CommonServiceService {
  constructor(private toastController:ToastController,private alertController: AlertController) { }

  async presentToast(message: string,duration:number,position:PositionType,color:string) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      position: position,
      color: color
    });
    toast.present();
  }

  async presentAlertWithAction(header:string,message: string, actionText: string, actionHandler: () => void) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      backdropDismiss: false,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: actionText,
          handler: actionHandler
        }
      ]
    });
  
    await alert.present();
  }
}
