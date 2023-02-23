import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private times = {
    work: 1500,
    break: 300,
    longBreak: 900
  };

  private timesSubject = new BehaviorSubject(this.times);
  times$ = this.timesSubject.asObservable();

  constructor() {
    const storage = JSON.parse(localStorage.getItem('times') || '{}');
    if (storage) {
      this.times = storage;
    }
  }

  updateTime(newTime: any) {
    this.times = newTime;
    localStorage.setItem('times', JSON.stringify(this.times));
    this.timesSubject.next(newTime);
  }
}
