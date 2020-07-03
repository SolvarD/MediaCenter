export class Video {
  title: string;
  path: string;
  currentTime: number = 0;
  totalTime: number = 0;
  volume: number = 1;
  isDirectory: boolean;
  level: number = 0;
  children: Video[] = [];
  extended: false;
}
