import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { LocationCodeCardModule } from '../../components/location-code-card/location-code-card.module';
import { EnterCodeCardModuleModule } from 'src/app/components/enter-code-card/enter-code-card-module.module';
import { MapviewCardModule } from 'src/app/components/mapview-card/mapview-card.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    LocationCodeCardModule,
    EnterCodeCardModuleModule,
    MapviewCardModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
