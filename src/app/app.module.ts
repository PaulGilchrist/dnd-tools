import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './components/app/app.component';
import { AbilityScoreComponent } from './components/ability-score/ability-score.component';
import { AbilityScoresComponent } from './components/ability-scores/ability-scores.component';
import { ConditionComponent } from './components/condition/condition.component';
import { ConditionsComponent } from './components/conditions/conditions.component';
import { EncountersComponent } from './components/encounters/encounters.component';
import { EquipmentItemComponent } from './components/equipment-item/equipment-item.component';
import { EquipmentItemsComponent } from './components/equipment-items/equipment-items.component';
import { ImageModalComponent } from './components/image-modal/image-modal.component';
import { MagicItemComponent } from './components/magic-item/magic-item.component';
import { MagicItemsComponent } from './components/magic-items/magic-items.component';
import { MonsterComponent } from './components/monster/monster.component';
import { MonstersComponent } from './components/monsters/monsters.component';
import { NavTopComponent } from './components/nav-top/nav-top.component';
import { PlayerClassComponent } from './components/player-class/player-class.component';
import { PlayerClassesComponent } from './components/player-classes/player-classes.component';
import { RaceComponent } from './components/race/race.component';
import { RacesComponent } from './components/races/races.component';
import { RuleComponent } from './components/rule/rule.component';
import { RulesComponent } from './components/rules/rules.component';
import { SkillComponent } from './components/skill/skill.component';
import { SkillsComponent } from './components/skills/skills.component';
import { SpellsComponent } from './components/spells/spells.component';
import { SpellComponent } from './components/spell/spell.component';
import { TraitComponent } from './components/trait/trait.component';
import { TraitsComponent } from './components/traits/traits.component';

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
    ImageModalComponent,
    MagicItemComponent,
    MagicItemsComponent,
    MonsterComponent,
    MonstersComponent,
    PlayerClassComponent,
    PlayerClassesComponent,
    RaceComponent,
    RacesComponent,
    RuleComponent,
    RulesComponent,
    SkillComponent,
    SkillsComponent,
    SpellComponent,
    SpellsComponent,
    TraitComponent,
    TraitsComponent
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
