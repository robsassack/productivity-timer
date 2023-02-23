import { Component } from '@angular/core';

@Component({
  selector: 'app-settings-menu',
  templateUrl: './settings-menu.component.html',
  styleUrls: ['./settings-menu.component.css']
})
export class SettingsMenuComponent {
  showSettingsMenu = true;

  constructor() { }

  toggleSettingsMenu() {
    this.showSettingsMenu = !this.showSettingsMenu;
  }
}
