import { NgModule } from '@angular/core';
import { Routes, RouterModule, NoPreloading } from '@angular/router';

import { AbilityScoresComponent } from './components/rules/ability-scores/ability-scores.component';
import { ConditionsComponent } from './components/rules/conditions/conditions.component';
import { EncountersComponent } from './components/monsters/encounters/encounters.component';
import { EquipmentItemsComponent } from './components/equipment-items/equipment-items.component';
import { MagicItemsComponent } from './components/magic-items/magic-items.component';
import { MonsterSearchComponent } from './components/monsters/monster-search/monster-search.component';
import { NamesComponent } from './components/names/names.component';
import { PlayerClassesComponent } from './components/rules/player-classes/player-classes.component';
import { RacesComponent } from './components/rules/races/races.component';
import { GeneralRulesComponent } from './components/rules/general-rules/general-rules.component';
import { SkillsComponent } from './components/rules/skills/skills.component';
import { SpellsComponent } from './components/spells/spells.component';
import { TraitsComponent } from './components/rules/traits/traits.component';

const routes: Routes = [
    // Static Loading
    { path: '', redirectTo: '/spells', pathMatch: 'full' },
    { path: 'monster/encounters', component: EncountersComponent },
    { path: 'equipment-items', component: EquipmentItemsComponent },
    { path: 'magic-items', component: MagicItemsComponent },
    { path: 'monster/search', component: MonsterSearchComponent },
    { path: 'names', component: NamesComponent },
    { path: 'rules/ability-scores', component: AbilityScoresComponent },
    { path: 'rules/conditions', component: ConditionsComponent },
    { path: 'rules/classes', component: PlayerClassesComponent },
    { path: 'rules/races', component: RacesComponent },
    { path: 'rules/general', component: GeneralRulesComponent },
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
