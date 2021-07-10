import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './components/app/app.component';
import { ConditionComponent } from './components/condition/condition.component';
import { ConditionsComponent } from './components/conditions/conditions.component';
import { MagicItemComponent } from './components/magic-item/magic-item.component';
import { MagicItemsComponent } from './components/magic-items/magic-items.component';
import { MonsterComponent } from './components/monster/monster.component';
import { MonstersComponent } from './components/monsters/monsters.component';
import { NavTopComponent } from './components/nav-top/nav-top.component';
import { SkillComponent } from './components/skill/skill.component';
import { SkillsComponent } from './components/skills/skills.component';
import { SpellsComponent } from './components/spells/spells.component';
import { SpellComponent } from './components/spell/spell.component';


import { DataService } from './services/data.service';
@NgModule({
  declarations: [
    AppComponent,
    NavTopComponent,
    ConditionComponent,
    ConditionsComponent,
    MagicItemComponent,
    MagicItemsComponent,
    MonsterComponent,
    MonstersComponent,
    SkillComponent,
    SkillsComponent,
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
