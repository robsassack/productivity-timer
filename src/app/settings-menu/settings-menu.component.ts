import { Component } from '@angular/core';
import { SettingsService } from '../settings.service';
import { sounds } from '../sounds';

@Component({
  selector: 'app-settings-menu',
  templateUrl: './settings-menu.component.html',
  styleUrls: ['./settings-menu.component.css'],
})
export class SettingsMenuComponent {
  showSettingsMenu = false;
  playSound = new Audio();
  playButtonSound = new Audio();

  workTime!: number;
  breakTime!: number;
  longBreakTime!: number;

  soundList = sounds.map((sound) => sound.name);
  selectedSound!: string;

  buttonSound!: boolean;

  constructor(private settingsService: SettingsService) {}

  ngOnInit() {
    this.settingsService.times$.subscribe((times) => {
      this.workTime = times.work / 60;
      this.breakTime = times.break / 60;
      this.longBreakTime = times.longBreak / 60;
    });

    this.settingsService.sound$.subscribe((sound) => {
      this.selectedSound = sound;
    });

    this.settingsService.buttonSound$.subscribe((sound) => {
      this.buttonSound = sound;
    });
  }

  toggleSettingsMenu() {
    // close menu
    this.showSettingsMenu = !this.showSettingsMenu;
  }

  updateTimes(event: Event, type: string) {
    if (Number(event) < 1 || String(event) === '') {
      switch (type) {
        case 'work':
          this.workTime = 1;
          break;
        case 'break':
          this.breakTime = 1;
          break;
        case 'longBreak':
          this.longBreakTime = 1;
          break;
      }
    }

    if (Number(event) > 999) {
      switch (type) {
        case 'work':
          this.workTime = 999;
          break;
        case 'break':
          this.breakTime = 999;
          break;
        case 'longBreak':
          this.longBreakTime = 999;
          break;
      }
    }

    const times = {
      work: this.workTime * 60,
      break: this.breakTime * 60,
      longBreak: this.longBreakTime * 60,
    };
    this.settingsService.updateTime(times);
  }

  updateSound(event: Event) {
    const input = event.target as HTMLInputElement;
    const sound = this.soundList.find((sound) => sound === input.value);
    // get sound path from sounds array
    const soundPath = sounds.find((sound) => sound.name === input.value)?.path;
    this.playSound.src = soundPath!;
    if (soundPath) {
      this.playSound.load();
      this.playSound.play();
    }
    this.settingsService.updateSound(sound);
  }

  updateButtonSound(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.playButtonSound.src = 'assets/button.wav';
      this.playButtonSound.load();
      this.playButtonSound.play();
    }
    this.settingsService.updateButtonSound(checked);
  }

  inputValidation(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    const keyPressed = event.key;

    if (
      event.code === 'Backspace' ||
      event.code === 'Delete' ||
      event.code === 'ArrowLeft' ||
      event.code === 'ArrowRight'
    ) {
      return;
    }

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

    // prevent numbers bigger than 999
    if (value.length >= 3) {
      // if user has highlighted text, allow them to replace it
      if (window.getSelection()?.toString().length) {
        return;
      }
      event.preventDefault();
      return;
    }
  }

  resetTimes() {
    this.settingsService.updateTime({ work: 1500, break: 300, longBreak: 900 });
  }
}
