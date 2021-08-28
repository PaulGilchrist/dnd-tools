import { NgModule } from '@angular/core';
import { Routes, RouterModule, NoPreloading } from '@angular/router';

import { AbilityScoresComponent } from './components/rules/ability-scores/ability-scores.component';
import { ConditionsComponent } from './components/rules/conditions/conditions.component';
import { EncountersComponent } from './components/monsters/encounters/encounters.component';
import { EquipmentItemsComponent } from './components/equipment-items/equipment-items.component';
import { FeatsComponent } from './components/rules/feats/feats.component';
import { LocationsComponent } from './components/locations/locations.component';
import { MagicItemsComponent } from './components/magic-items/magic-items.component';
import { MonsterLoreComponent } from './components/monsters/monster-lore/monster-lore.component';
import { MonsterSearchComponent } from './components/monsters/monster-search/monster-search.component';
import { NamesComponent } from './components/names/names.component';
import { PlayerClassesComponent } from './components/rules/player-classes/player-classes.component';
import { RacesComponent } from './components/rules/races/races.component';
import { GeneralRulesComponent } from './components/rules/general-rules/general-rules.component';
import { SpellsComponent } from './components/spells/spells.component';

const routes: Routes = [
    // Static Loading
    { path: '', redirectTo: '/spells', pathMatch: 'full' },
    { path: 'equipment-items', component: EquipmentItemsComponent },
    { path: 'locations', component: LocationsComponent },
    { path: 'magic-items', component: MagicItemsComponent },
    { path: 'monster/encounters', component: EncountersComponent },
    { path: 'monster/lore', component: MonsterLoreComponent },
    { path: 'monster/search', component: MonsterSearchComponent },
    { path: 'names', component: NamesComponent },
    { path: 'rules/ability-scores', component: AbilityScoresComponent },
    { path: 'rules/conditions', component: ConditionsComponent },
    { path: 'rules/classes', component: PlayerClassesComponent },
    { path: 'rules/feats', component: FeatsComponent },
    { path: 'rules/races', component: RacesComponent },
    { path: 'rules/general', component: GeneralRulesComponent },
    { path: 'spells', component: SpellsComponent },
 ];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: NoPreloading, relativeLinkResolution: 'legacy' })
],
  exports: [RouterModule]
})
export class AppRoutingModule { }
