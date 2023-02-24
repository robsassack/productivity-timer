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

  private timesSubject = new BehaviorSubject(this.defaultTimes);
  times$ = this.timesSubject.asObservable();

  constructor() {
    const storage = JSON.parse(localStorage.getItem('times') || '{}');
    if (storage && Object.keys(storage).length !== 0) {
      this.timesSubject.next(storage);
    } else {
      localStorage.setItem('times', JSON.stringify(this.defaultTimes));
    }
  }

  updateTime(newTime: any) {
    localStorage.setItem('times', JSON.stringify(newTime));
    this.timesSubject.next(newTime);
  }
}