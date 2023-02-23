import { Component } from '@angular/core';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-settings-menu',
  templateUrl: './settings-menu.component.html',
  styleUrls: ['./settings-menu.component.css']
})
export class SettingsMenuComponent {
  showSettingsMenu = true;

  constructor(private settingsService: SettingsService) {}

  toggleSettingsMenu() {
    this.showSettingsMenu = !this.showSettingsMenu;
  }
}
