import { Component } from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent {
  time = 15000;
  timer: any;
  state: boolean = false;
  interval = [
    { name: 'Work', time: 15000 },
    { name: 'Break', time: 3000 },
    { name: 'Work', time: 15000 },
    { name: 'Break', time: 3000 },
    { name: 'Work', time: 15000 },
    { name: 'Break', time: 3000 },
    { name: 'Work', time: 15000 },
    { name: 'Long Break', time: 9000 },
  ]
  currentInterval = 0;

  start() {
    // start timer
    if (!this.state) {
      console.log('timer started');
      this.timer = setInterval(() => {
        // console.log(this.time);
        if (this.time > 0) {
          this.time--;
        } else {
          alert("Time's up!");
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
