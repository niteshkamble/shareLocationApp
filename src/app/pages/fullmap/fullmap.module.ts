import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FullmapPageRoutingModule } from './fullmap-routing.module';

import { FullmapPage } from './fullmap.page';
import { LocationCodeCardModule } from 'src/app/components/location-code-card/location-code-card.module';
import { MapviewCardModule } from 'src/app/components/mapview-card/mapview-card.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FullmapPageRoutingModule,
    LocationCodeCardModule,
    MapviewCardModule
  ],
  declarations: [FullmapPage]
})
export class FullmapPageModule {}
