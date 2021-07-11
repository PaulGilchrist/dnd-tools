import { NgModule } from '@angular/core';
import { Routes, RouterModule, NoPreloading } from '@angular/router';

import { AbilityScoresComponent } from './components/ability-scores/ability-scores.component';
import { ConditionsComponent } from './components/conditions/conditions.component';
import { EquipmentItemsComponent } from './components/equipment-items/equipment-items.component';
import { MagicItemsComponent } from './components/magic-items/magic-items.component';
import { MonstersComponent } from './components/monsters/monsters.component';
import { RacesComponent } from './components/races/races.component';
import { RulesComponent } from './components/rules/rules.component';
import { SkillsComponent } from './components/skills/skills.component';
import { SpellsComponent } from './components/spells/spells.component';
import { TraitsComponent } from './components/traits/traits.component';

const routes: Routes = [
    // Static Loading
    { path: '', redirectTo: '/spells', pathMatch: 'full' },
    { path: 'equipment-items', component: EquipmentItemsComponent },
    { path: 'magic-items', component: MagicItemsComponent },
    { path: 'monsters', component: MonstersComponent },
    { path: 'rules/ability-scores', component: AbilityScoresComponent },
    { path: 'rules/conditions', component: ConditionsComponent },
    { path: 'rules/races', component: RacesComponent },
    { path: 'rules/general', component: RulesComponent },
    { path: 'rules/skills', component: SkillsComponent },
    { path: 'spells', component: SpellsComponent },
    { path: 'rules/traits', component: TraitsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: NoPreloading, relativeLinkResolution: 'legacy' })
],
  exports: [RouterModule]
})
export class AppRoutingModule { }
