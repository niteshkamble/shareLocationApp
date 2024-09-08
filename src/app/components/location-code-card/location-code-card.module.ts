import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationCodeCardComponent } from './location-code-card.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [LocationCodeCardComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ],
  exports:[LocationCodeCardComponent]
})
export class LocationCodeCardModule { }
