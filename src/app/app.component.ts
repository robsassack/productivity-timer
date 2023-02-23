import { Component, ViewChild } from '@angular/core';
import { SettingsMenuComponent } from './settings-menu/settings-menu.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild(SettingsMenuComponent) settingsMenu!: SettingsMenuComponent;

  callToggleSettingsMenu() {
    this.settingsMenu.toggleSettingsMenu();
  }

  title = 'productivity-timer';
}
