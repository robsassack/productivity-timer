import { Component } from '@angular/core';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-settings-menu',
  templateUrl: './settings-menu.component.html',
  styleUrls: ['./settings-menu.component.css']
})
export class SettingsMenuComponent {
  showSettingsMenu = false;

  workTime!: number;
  breakTime!: number;
  longBreakTime!: number;

  constructor(private settingsService: SettingsService) {}

  ngOnInit() {
    this.settingsService.times$.subscribe(times => {
      this.workTime = times.work / 60;
      this.breakTime = times.break / 60;
      this.longBreakTime = times.longBreak / 60;
    });
  }

  toggleSettingsMenu() {
    this.showSettingsMenu = !this.showSettingsMenu;
  }

  updateTimes() {
    const times = {
      work: this.workTime * 60,
      break: this.breakTime * 60,
      longBreak: this.longBreakTime * 60
    };
    this.settingsService.updateTime(times);
  }

  resetTimes() {
    this.settingsService.updateTime({ work: 1500, break: 300, longBreak: 900 });
  }
}