import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { TimerComponent } from './timer/timer.component';
import { SettingsMenuComponent } from './settings-menu/settings-menu.component';

@NgModule({
  declarations: [
    AppComponent,
    TimerComponent,
    SettingsMenuComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
