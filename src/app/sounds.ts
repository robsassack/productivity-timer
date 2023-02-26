interface Sound {
  name: string;
  path: string;
}

export const sounds: Sound[] = [
  {
    name: "Synth",
    path: "assets/synth.wav"
  },
  {
    name: "Elevator",
    path: "assets/elevator.wav"
  },
  {
    name: "Alarm Clock",
    path: "assets/alarmclock.wav"
  },
  {
    name: "None",
    path: ""
  }
]