import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapviewCardComponent } from './mapview-card.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [MapviewCardComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports:[MapviewCardComponent]
})
export class MapviewCardModule { }
