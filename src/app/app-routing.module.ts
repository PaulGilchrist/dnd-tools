import { NgModule } from '@angular/core';
import { Routes, RouterModule, NoPreloading } from '@angular/router';

import { MonstersComponent } from './components/monsters/monsters.component';
import { SpellsComponent } from './components/spells/spells.component';

const routes: Routes = [
    // Static Loading
    { path: '', redirectTo: '/spells', pathMatch: 'full' },
    { path: 'spells', component: SpellsComponent },
    { path: 'monsters', component: MonstersComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: NoPreloading, relativeLinkResolution: 'legacy' })
],
  exports: [RouterModule]
})
export class AppRoutingModule { }
