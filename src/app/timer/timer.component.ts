import { Component } from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent {
  time = 300;
  timer: any;
  state: boolean = false;

  start() {
    // start timer
    if (!this.state) {
      console.log('go');
      this.timer = setInterval(() => {
        console.log(this.time);
        if (this.time > 0) {
          this.time--;
        } else {
          alert("Time's up!");
          clearInterval(this.timer);
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
    this.time = 300;
    clearInterval(this.timer);
    this.state = false;
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
}
