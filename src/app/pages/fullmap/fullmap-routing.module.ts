import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FullmapPage } from './fullmap.page';

const routes: Routes = [
  {
    path: '',
    component: FullmapPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FullmapPageRoutingModule {}
