export class Video {
  title: string;
  path: string;
  route: string;
  currentTime: number = 0;
  duration: number = 0;
  volume: number = 1;
  isDirectory: boolean;
  level: number = 0;
  children: Video[] = [];
  isSelected: boolean = false;
  isReduce: boolean = false;
  isEnded: boolean = false;
  hasCover = false;
}
