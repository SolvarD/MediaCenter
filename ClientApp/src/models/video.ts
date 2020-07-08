export class Video {
  title: string;
  path: string;
  currentTime: number = 0;
  duration: number = 0;
  volume: number = 1;
  isDirectory: boolean;
  level: number = 0;
  children: Video[] = [];
  selected: boolean = false;
  reduce: boolean = false;
}
