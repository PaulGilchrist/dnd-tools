import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './components/app/app.component';
import { NavTopComponent } from './components/nav-top/nav-top.component';
import { SpellsComponent } from './components/spells/spells.component';
import { SpellComponent } from './components/spell/spell.component';


import { DataService } from './services/data.service';
@NgModule({
  declarations: [
    AppComponent,
    NavTopComponent,
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
