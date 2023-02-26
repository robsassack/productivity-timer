import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private defaultTimes = {
    work: 1500,
    break: 300,
    longBreak: 900
  };

  private defaultSound = "Synth";

  private timesSubject = new BehaviorSubject(this.defaultTimes);
  times$ = this.timesSubject.asObservable();

  private soundSubject = new BehaviorSubject(this.defaultSound);
  sound$ = this.soundSubject.asObservable();

  constructor() {
    const storage = JSON.parse(localStorage.getItem('times') || '{}');
    if (storage && Object.keys(storage).length !== 0) {
      this.timesSubject.next(storage);
    } else {
      localStorage.setItem('times', JSON.stringify(this.defaultTimes));
    }

    const sound = JSON.parse(localStorage.getItem('sound') || '{}');
    if (sound && Object.keys(sound).length !== 0) {
      this.soundSubject.next(sound);
    } else {
      localStorage.setItem('sound', JSON.stringify(this.defaultSound));
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
}