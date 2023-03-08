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
  focusTime!: number;
  breakTime!: number;
  longBreakTime!: number;
  soundList = sounds.map((sound) => sound.name);
  selectedSound!: string;
  buttonSound!: boolean;
  volume!: number;
  intervalCount!: number;

  constructor(private settingsService: SettingsService) {}

  ngOnInit() {
    this.settingsService.times$.subscribe((times) => {
      this.focusTime = times.focus / 60;
      this.breakTime = times.break / 60;
      this.longBreakTime = times.longBreak / 60;
    });

    this.settingsService.soundSettings$.subscribe((settings) => {
      this.selectedSound = settings.sound;
      this.buttonSound = settings.buttonSound;
      this.volume = settings.volume;
    });

    this.settingsService.intervalCount$.subscribe((count) => {
      this.intervalCount = count;
    });
  }

  toggleSettingsMenu() {
    // close menu
    this.showSettingsMenu = !this.showSettingsMenu;
  }

  updateTimes(event: Event, type: string) {
    if (Number(event) < 1 || String(event) === '') {
      switch (type) {
        case 'focus':
          this.focusTime = 1;
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
        case 'focus':
          this.focusTime = 999;
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
      focus: this.focusTime * 60,
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

    const newSettings = {
      sound: sound!,
      buttonSound: this.buttonSound,
      volume: this.volume,
    }
    this.settingsService.updateSoundSettings(newSettings);
  }

  updateButtonSound(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.playButtonSound.src = 'assets/button.wav';
      this.playButtonSound.load();
      this.playButtonSound.play();
    }

    const newSettings = {
      sound: this.selectedSound,
      buttonSound: checked,
      volume: this.volume,
    }
    this.settingsService.updateSoundSettings(newSettings);
  }

  updateVolume(event: Event) {
    const volume = Number(event);

    const newSettings = {
      sound: this.selectedSound,
      buttonSound: this.buttonSound,
      volume: volume,
    }
    this.playSound.volume = volume;
    this.playButtonSound.volume = volume;
    this.settingsService.updateSoundSettings(newSettings);
  }

  updateIntervalCount(event: Event) {
    let value = Number(event);
    if (value < 1) {
      value = 1;
    } else if (value > 20) {
      value = 20;
    }
    this.settingsService.updateIntervalCount(value);
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
    this.settingsService.updateTime({
      focus: 1500,
      break: 300,
      longBreak: 900,
    });
  }
}
