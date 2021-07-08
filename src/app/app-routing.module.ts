import { NgModule } from '@angular/core';
import { Routes, RouterModule, NoPreloading } from '@angular/router';

import { SpellsComponent } from './components/spells/spells.component';

const routes: Routes = [
    // Static Loading
    { path: '', component: SpellsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: NoPreloading, relativeLinkResolution: 'legacy' })
],
  exports: [RouterModule]
})
export class AppRoutingModule { }
