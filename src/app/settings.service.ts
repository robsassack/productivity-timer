import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  constructor() { }

  times = {
    work: 1500,
    break: 300,
    longBreak: 900
  }

  settingsUpdated = new EventEmitter();

  updateTime(name: string, time: number) {
    switch (name) {
      case 'work':
        this.times.work = time;
        break;
      case 'break':
        this.times.break = time;
        break;
      case 'longBreak':
        this.times.longBreak = time;
        break;
    }
    this.settingsUpdated.emit(this.times);
  }

  saveSettings() {
    // use local storage
    localStorage.setItem('times', JSON.stringify(this.times));
  }
}
