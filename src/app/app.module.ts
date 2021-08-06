import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './components/app/app.component';
import { AbilityScoreComponent } from './components/rules/ability-score/ability-score.component';
import { AbilityScoresComponent } from './components/rules/ability-scores/ability-scores.component';
import { ConditionComponent } from './components/rules/condition/condition.component';
import { ConditionsComponent } from './components/rules/conditions/conditions.component';
import { EncountersComponent } from './components/monsters/encounters/encounters.component';
import { EquipmentItemComponent } from './components/equipment-item/equipment-item.component';
import { EquipmentItemsComponent } from './components/equipment-items/equipment-items.component';
import { ImageModalComponent } from './components/monsters/image-modal/image-modal.component';
import { MagicItemComponent } from './components/magic-item/magic-item.component';
import { MagicItemsComponent } from './components/magic-items/magic-items.component';
import { MonsterComponent } from './components/monsters/monster/monster.component';
import { MonsterSearchComponent } from './components/monsters/monster-search/monster-search.component';
import { NamesComponent } from './components/names/names.component';
import { NavTopComponent } from './components/nav-top/nav-top.component';
import { PlayerClassComponent } from './components/rules/player-class/player-class.component';
import { PlayerClassesComponent } from './components/rules/player-classes/player-classes.component';
import { RaceComponent } from './components/rules/race/race.component';
import { RacesComponent } from './components/rules/races/races.component';
import { GeneralRuleComponent } from './components/rules/general-rule/general-rule.component';
import { GeneralRulesComponent } from './components/rules/general-rules/general-rules.component';
import { SpellsComponent } from './components/spells/spells.component';
import { SpellComponent } from './components/spell/spell.component';

import { DataService } from './services/data.service';
@NgModule({
  declarations: [
    AppComponent,
    NavTopComponent,
    AbilityScoreComponent,
    AbilityScoresComponent,
    ConditionComponent,
    ConditionsComponent,
    EncountersComponent,
    EquipmentItemComponent,
    EquipmentItemsComponent,
    GeneralRuleComponent,
    GeneralRulesComponent,
    ImageModalComponent,
    MagicItemComponent,
    MagicItemsComponent,
    MonsterComponent,
    MonsterSearchComponent,
    NamesComponent,
    PlayerClassComponent,
    PlayerClassesComponent,
    RaceComponent,
    RacesComponent,
    SpellComponent,
    SpellsComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
