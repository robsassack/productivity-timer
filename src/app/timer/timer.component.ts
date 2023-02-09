import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent {
  workTime = 15000;
  breakTime = 3000;
  longBreakTime = 9000;

  time = this.workTime;
  timer: any;
  state: boolean = false;
  interval = [
    { name: 'Work', time: this.workTime, bgColor: "#9f1239" },
    { name: 'Break', time: this.breakTime, bgColor: "#075985" },
    { name: 'Work', time: this.workTime, bgColor: "#9f1239" },
    { name: 'Break', time: this.breakTime, bgColor: "#075985" },
    { name: 'Work', time: this.workTime, bgColor: "#9f1239" },
    { name: 'Break', time: this.breakTime, bgColor: "#075985" },
    { name: 'Work', time: this.workTime, bgColor: "#9f1239" },
    { name: 'Long Break', time: this.longBreakTime, bgColor: "#065f46" },
  ]
  currentInterval = 0;

  constructor(private titleService: Title) {}

  start() {
    // start timer
    if (!this.state) {
      console.log('timer started');
      this.timer = setInterval(() => {
        // console.log(this.time);
        this.updateTitle();
        if (this.time > 0) {
          this.time--;
        } else {
          // play sound
          let alertSound = new Audio();
          alertSound.src = 'assets/alert.wav';
          alertSound.load();
          alertSound.play();
          this.next();
        }
      }, 100);
      this.state = true;
    }
  }

  pause() {
    // pause timer
    if (this.state) {
      console.log('pause timer');
      clearInterval(this.timer);
      this.state = false;
    }
  }

  reset() {
    // reset timer
    console.log('reset timer');
    this.time = this.interval[this.currentInterval%8].time;
    clearInterval(this.timer);
    this.state = false;
    this.updateTitle();
  }

  next() {
    // next interval
    console.log('next interval');
    this.currentInterval++;
    this.time = this.interval[this.currentInterval%8].time;
    clearInterval(this.timer);
    this.state = false;
    // set background color based on interval
    switch (this.interval[this.currentInterval%8].name) {
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
    this.updateTitle();
  }

  updateTitle() {
    // update title
    let title = `[${this.timeFormat(this.time)}] - ${this.interval[this.currentInterval%8].name}`;
    this.titleService.setTitle(title);
  }

  timeFormat(time: number) {
    // format to MM:SS
    const minutes = Math.floor(time / 600);
    const seconds = Math.floor((time % 600) / 10);
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
