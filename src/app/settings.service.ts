import { Injectable } from '@angular/core';
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
  private defaultSoundSettings = {
    sound: "Synth",
    buttonSound: false,
    // volume: 0.5
  }
  private defaultIntervalCount = 4;

  private timesSubject = new BehaviorSubject(this.defaultTimes);
  times$ = this.timesSubject.asObservable();

  private soundSettingsSubject = new BehaviorSubject(this.defaultSoundSettings);
  soundSettings$ = this.soundSettingsSubject.asObservable();

  private intervalCountSubject = new BehaviorSubject(this.defaultIntervalCount);
  intervalCount$ = this.intervalCountSubject.asObservable();

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

    const soundSettings = JSON.parse(localStorage.getItem('soundSettings') || '{}');
    if (soundSettings && Object.keys(soundSettings).length !== 0) {
      this.soundSettingsSubject.next(soundSettings);
    } else {
      localStorage.setItem('soundSettings', JSON.stringify(this.defaultSoundSettings));
    }

    const intervalCount = localStorage.getItem('intervalCount');
    if (intervalCount !== null) {
      this.intervalCountSubject.next(JSON.parse(intervalCount));
    } else {
      localStorage.setItem('intervalCount', String(this.defaultIntervalCount));
    }
  }

  updateTime(newTime: any) {
    localStorage.setItem('times', JSON.stringify(newTime));
    this.timesSubject.next(newTime);
  }

  updateSoundSettings(newSoundSettings: any) {
    localStorage.setItem('soundSettings', JSON.stringify(newSoundSettings));
    this.soundSettingsSubject.next(newSoundSettings);
  }

  updateIntervalCount(newIntervalCount: number) {
    localStorage.setItem('intervalCount', JSON.stringify(newIntervalCount));
    this.intervalCountSubject.next(newIntervalCount);
  }
}