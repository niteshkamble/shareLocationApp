import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnterCodeCardComponent } from './enter-code-card.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [EnterCodeCardComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ],
  exports:[EnterCodeCardComponent]
})
export class EnterCodeCardModuleModule { }
