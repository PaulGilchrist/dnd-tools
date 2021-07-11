import { NgModule } from '@angular/core';
import { Routes, RouterModule, NoPreloading } from '@angular/router';

import { AbilityScoresComponent } from './components/ability-scores/ability-scores.component';
import { ConditionsComponent } from './components/conditions/conditions.component';
import { EquipmentItemsComponent } from './components/equipment-items/equipment-items.component';
import { MagicItemsComponent } from './components/magic-items/magic-items.component';
import { MonstersComponent } from './components/monsters/monsters.component';
import { RacesComponent } from './components/races/races.component';
import { SkillsComponent } from './components/skills/skills.component';
import { SpellsComponent } from './components/spells/spells.component';

const routes: Routes = [
    // Static Loading
    { path: '', redirectTo: '/spells', pathMatch: 'full' },
    { path: 'rules/ability-scores', component: AbilityScoresComponent },
    { path: 'rules/conditions', component: ConditionsComponent },
    { path: 'equipment-items', component: EquipmentItemsComponent },
    { path: 'magic-items', component: MagicItemsComponent },
    { path: 'monsters', component: MonstersComponent },
    { path: 'rules/races', component: RacesComponent },
    { path: 'rules/skills', component: SkillsComponent },
    { path: 'spells', component: SpellsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: NoPreloading, relativeLinkResolution: 'legacy' })
],
  exports: [RouterModule]
})
export class AppRoutingModule { }
