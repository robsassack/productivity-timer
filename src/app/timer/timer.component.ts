import { Component, HostListener } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { SettingsService } from '../settings.service';
import { sounds } from '../sounds';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent {
  alertSound = new Audio();
  buttonSound = new Audio();
  times = new BehaviorSubject({
    focus: 1500,
    break: 300,
    longBreak: 900
  });

  constructor(private titleService: Title, private settingsService: SettingsService) {}

  ngOnInit() {
    this.settingsService.times$.subscribe(times => {
      this.times.next(times);
    });
    this.times.subscribe(times => {
      this.interval.forEach(i => {
        if (i.name === 'Focus') {
          i.time = times.focus;
        } else if (i.name === 'Break') {
          i.time = times.break;
        } else if (i.name === 'Long Break') {
          i.time = times.longBreak;
        }
      });
      this.time = this.interval[this.currentInterval%8].time;
    });
    this.settingsService.sound$.subscribe(sound => {
      this.alertSound.src = sounds.find(s => s.name === sound)?.path!;
    });
    this.settingsService.buttonSound$.subscribe(playSound => {
      if (playSound) {
        this.buttonSound.src = 'assets/button.wav';
      } else {
        this.buttonSound.src = '';
      }
    });
  }

  updateTime() {
    this.settingsService.updateTime(this.times.getValue());
  }

  time = this.times.getValue().focus;
  timer: any = null;
  pauseTimer: boolean = false;
  interval = [
    { name: 'Focus', time: this.times.getValue().focus, bgColor: "#9f1239" },
    { name: 'Break', time: this.times.getValue().break, bgColor: "#075985" },
    { name: 'Focus', time: this.times.getValue().focus, bgColor: "#9f1239" },
    { name: 'Break', time: this.times.getValue().break, bgColor: "#075985" },
    { name: 'Focus', time: this.times.getValue().focus, bgColor: "#9f1239" },
    { name: 'Break', time: this.times.getValue().break, bgColor: "#075985" },
    { name: 'Focus', time: this.times.getValue().focus, bgColor: "#9f1239" },
    { name: 'Long Break', time: this.times.getValue().longBreak, bgColor: "#065f46" },
  ]
  currentInterval = 0;

  @HostListener('window:beforeunload', ['$event']) beforeUnloadHander(event: any) {
    // alert user if timer is running
    if (this.timer && !this.pauseTimer) {
      event.returnValue = true;
    }
  }

  start() {
    this.playButtonSound();
    if (!this.timer) {
      this.timer = interval(1000).subscribe(val => {
        if (!this.pauseTimer) {
          if (this.time > 0) {
            this.time--;
            this.updateTitle();
          } else {
            // play sound
            if (this.alertSound.readyState >= 2) {
              this.alertSound.load();
              this.alertSound.play();
            }
            this.next();
          }
        }
      });
    }
  }

  pause() {
    this.playButtonSound();
    // pause timer
    // console.log('timer paused');
    this.pauseTimer = true;
    this.updateTitle();
  }

  resume() {
    this.playButtonSound();
    // resume timer
    // console.log('timer resumed');
    this.pauseTimer = false;
  }

  reset() {
    this.playButtonSound();
    // reset timer
    // console.log('reset timer');
    this.time = this.interval[this.currentInterval%8].time;
    this.timer.unsubscribe();
    this.timer = null;
    this.pauseTimer = false;
    this.updateTitle();
  }

  next() {
    this.playButtonSound();
    // next interval
    // console.log('next interval');
    this.currentInterval++;
    this.time = this.interval[this.currentInterval%8].time;
    if (this.timer) {
      this.timer.unsubscribe();
    }
    this.timer = null;
    this.pauseTimer = false;
    this.setFavicon();
    this.setBackgroundColor();
    this.updateTitle();
  }

  prev() {
    this.playButtonSound();
    // previous interval
    this.currentInterval--;
    this.time = this.interval[this.currentInterval%8].time;
    if (this.timer) {
      this.timer.unsubscribe();
    }
    this.timer = null;
    this.pauseTimer = false;
    this.setFavicon();
    this.setBackgroundColor();
    this.updateTitle();
  }

  resetInterval() {
    this.playButtonSound();
    // reset interval
    this.currentInterval = 0;
    this.time = this.interval[this.currentInterval%8].time;
    if (this.timer) {
      this.timer.unsubscribe();
    }
    this.timer = null;
    this.pauseTimer = false;
    this.setFavicon();
    this.setBackgroundColor();
    this.updateTitle();
  }

  setFavicon() {
    // set favicon based on interval
    let link: any = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    switch (this.interval[this.currentInterval % 8].name) {
      case 'Focus':
        link.href = 'assets/favicon-focus.ico';
        break;
      case 'Break':
        link.href = 'assets/favicon-break.ico';
        break;
      case 'Long Break':
        link.href = 'assets/favicon-longbreak.ico';
        break;
    }
    document.getElementsByTagName('head')[0].appendChild(link);
  }

  private setBackgroundColor() {
    // set background color based on interval
    switch (this.interval[this.currentInterval % 8].name) {
      case 'Focus':
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
    // format interval number based on focus and breaks
    if (interval % 2 == 0) {
      return interval / 2;
    }
    return (interval + 1) / 2;
  }

  playButtonSound() {
    if (this.buttonSound.readyState >= 2) {
      this.buttonSound.load();
      this.buttonSound.play();
    }
  }
}
