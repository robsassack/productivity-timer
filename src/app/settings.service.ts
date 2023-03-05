import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private defaultTimes = {
    focus: 1500,
    break: 300,
    longBreak: 900
  };
  private defaultSound = "Synth";
  private defaultButtonSound = false;

  private timesSubject = new BehaviorSubject(this.defaultTimes);
  times$ = this.timesSubject.asObservable();

  private soundSubject = new BehaviorSubject(this.defaultSound);
  sound$ = this.soundSubject.asObservable();

  private buttonSoundSubject = new BehaviorSubject(this.defaultButtonSound);
  buttonSound$ = this.buttonSoundSubject.asObservable();

  constructor() {
    const storage = JSON.parse(localStorage.getItem('times') || '{}');
    if (storage && Object.keys(storage).length !== 0) {
      // if any of the times are missing or NaN, use the default times
      if (!storage.focus || !storage.break || !storage.longBreak || isNaN(storage.focus) || isNaN(storage.break) || isNaN(storage.longBreak)) {
        localStorage.setItem('times', JSON.stringify(this.defaultTimes));
        this.timesSubject.next(this.defaultTimes);
      } else {
        this.timesSubject.next(storage);
      }
    } else {
      localStorage.setItem('times', JSON.stringify(this.defaultTimes));
    }

    const sound = JSON.parse(localStorage.getItem('sound') || '{}');
    if (sound && Object.keys(sound).length !== 0) {
      this.soundSubject.next(sound);
    } else {
      localStorage.setItem('sound', JSON.stringify(this.defaultSound));
    }

    const button = localStorage.getItem('buttonSound');
    if (button !== null) {
      this.buttonSoundSubject.next(JSON.parse(button));
    } else {
      localStorage.setItem('buttonSound', String(this.defaultButtonSound));
    }
  }

  updateTime(newTime: any) {
    localStorage.setItem('times', JSON.stringify(newTime));
    this.timesSubject.next(newTime);
  }

  updateSound(newSound: any) {
    localStorage.setItem('sound', JSON.stringify(newSound));
    this.soundSubject.next(newSound);
  }

  updateButtonSound(newButtonSound: any) {
    localStorage.setItem('buttonSound', JSON.stringify(newButtonSound));
    this.buttonSoundSubject.next(newButtonSound);
  }
}