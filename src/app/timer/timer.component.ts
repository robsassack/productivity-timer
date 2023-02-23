import { Component, HostListener } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { interval, Subscription } from 'rxjs';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent {
  alertSound = new Audio();
  times = {
    work: 1500,
    break: 300,
    longBreak: 900
  };

  constructor(private titleService: Title, private settingsService: SettingsService) {}

  ngOnInit() {
    this.settingsService.times$.subscribe(times => {
      this.times = times;
    });
  }

  updateTime() {
    this.settingsService.updateTime(this.times);
  }

  time = this.times.work;
  timer: any = null;
  pauseTimer: boolean = false;
  interval = [
    { name: 'Work', time: this.times.work, bgColor: "#9f1239" },
    { name: 'Break', time: this.times.break, bgColor: "#075985" },
    { name: 'Work', time: this.times.work, bgColor: "#9f1239" },
    { name: 'Break', time: this.times.break, bgColor: "#075985" },
    { name: 'Work', time: this.times.work, bgColor: "#9f1239" },
    { name: 'Break', time: this.times.break, bgColor: "#075985" },
    { name: 'Work', time: this.times.work, bgColor: "#9f1239" },
    { name: 'Long Break', time: this.times.longBreak, bgColor: "#065f46" },
  ]
  currentInterval = 0;

  @HostListener('window:beforeunload', ['$event']) beforeUnloadHander(event: any) {
    // alert user if timer is running
    if (this.timer && !this.pauseTimer) {
      event.returnValue = true;
    }
  }

  start() {
    if (!this.timer) {
      this.timer = interval(1000).subscribe(val => {
        if (!this.pauseTimer) {
          if (this.time > 0) {
            this.time--;
            this.updateTitle();
          } else {
            // play sound
            this.alertSound.src = 'assets/alert.wav';
            this.alertSound.load();
            this.alertSound.play();
            this.next();
          }
        }
      });
    }
  }

  pause() {
    // pause timer
    // console.log('timer paused');
    this.pauseTimer = true;
    this.updateTitle();
  }

  resume() {
    // resume timer
    // console.log('timer resumed');
    this.pauseTimer = false;
  }

  reset() {
    // reset timer
    // console.log('reset timer');
    this.time = this.interval[this.currentInterval%8].time;
    this.timer.unsubscribe();
    this.timer = null;
    this.pauseTimer = false;
    this.updateTitle();
  }

  next() {
    // next interval
    // console.log('next interval');
    this.currentInterval++;
    this.time = this.interval[this.currentInterval%8].time;
    if (this.timer) {
      this.timer.unsubscribe();
    }
    this.timer = null;
    this.pauseTimer = false;
    this.setBackgroundColor();
    this.updateTitle();
  }

  prev() {
    // previous interval
    this.currentInterval--;
    this.time = this.interval[this.currentInterval%8].time;
    if (this.timer) {
      this.timer.unsubscribe();
    }
    this.timer = null;
    this.pauseTimer = false;
    this.setBackgroundColor();
    this.updateTitle();
  }

  resetInterval() {
    // reset interval
    this.currentInterval = 0;
    this.time = this.interval[this.currentInterval%8].time;
    if (this.timer) {
      this.timer.unsubscribe();
    }
    this.timer = null;
    this.pauseTimer = false;
    this.setBackgroundColor();
    this.updateTitle();
  }

  private setBackgroundColor() {
    // set background color based on interval
    switch (this.interval[this.currentInterval % 8].name) {
      case 'Work':
        document.body.style.backgroundColor = '#be123c';
        break;
      case 'Break':
        document.body.style.backgroundColor = '#0369a1';
        break;
      case 'Long Break':
        document.body.style.backgroundColor = '#047857';
        break;
    }
  }

  updateTitle() {
    // update title
    let symbol = '';
    if (this.pauseTimer) {
      symbol = '⏸';
    } if (!this.pauseTimer && this.timer) {
      symbol = '▶️';
    }
    let title = `${symbol} [${this.timeFormat(this.time)}] - ${this.interval[this.currentInterval%8].name}`;
    this.titleService.setTitle(title);
  }

  timeFormat(time: number) {
    // format to MM:SS
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor((time % 60));
    if (seconds < 10) {
      return minutes + ':0' + seconds;
    }
    return minutes + ':' + seconds;
  }

  intervalFormat(interval: number) {
    // format interval number based on work and breaks
    if (interval % 2 == 0) {
      return interval / 2;
    }
    return (interval + 1) / 2;
  }
}
