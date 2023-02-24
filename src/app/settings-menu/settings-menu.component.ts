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
    // update times if menu gets closed
    if (this.workTime >= 1 && this.breakTime >= 1 && this.longBreakTime >= 1) {
      const times = {
        work: this.workTime * 60,
        break: this.breakTime * 60,
        longBreak: this.longBreakTime * 60
      };
      this.settingsService.updateTime(times);
    }
    // close menu
    this.showSettingsMenu = !this.showSettingsMenu;
  }

  updateTimes(event: Event) {
    const input = event.target as HTMLInputElement;
    // if input is zero or empty, do not update
    if (input.value === '0' || input.value === '') {
      return;
    }

    const times = {
      work: this.workTime * 60,
      break: this.breakTime * 60,
      longBreak: this.longBreakTime * 60
    };
    this.settingsService.updateTime(times);
  }

  inputValidation(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    const keyPressed = event.key;

    // prevent all negative numbers
    if (keyPressed === '-') {
      event.preventDefault();
      return;
    }

    // do not allow decimals
    if (keyPressed === '.') {
      event.preventDefault();
      return;
    }
  }

  resetTimes() {
    this.settingsService.updateTime({ work: 1500, break: 300, longBreak: 900 });
  }
}