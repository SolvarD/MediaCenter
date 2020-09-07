import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Video } from '../../models/video';
import { SerieService } from '../../services/serie.service';
import { ParamsService } from '../../services/params.service';
import { Subject } from 'rxjs';
import { MediaCenterConfig } from '../../models/media-center-config';
import { VideoStatus } from '../../models/video-status';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  
  series: Array<Video> = [];
  config: MediaCenterConfig;
  selectedVideo: Subject<Video> = new Subject<Video>();
  currentVideo: Video;
  paths: string[] = [];
  isReduce: boolean = false;
  totalTimeSpend: number = 0;
  constructor(private ref: ChangeDetectorRef, private serieService: SerieService, private paramsService: ParamsService) { }

  async ngOnInit() {

    this.config = await this.paramsService.getConfig();
    this.paths = this.config.videoLocation;
    ParamsService.configObv.subscribe((conf) => {
      this.config = conf;
      this.ref.detectChanges();
    })
    console.log(this.config);

    this.totalTimeSpend = Object.values(this.config).map(h => h.currentTime).filter(p => p).reduce((c, d) => c + d);

    this.ref.detectChanges();
  }

  selectVideo(video: Video) {
    let statusVideo = this.config[video.title];
    console.log(video);
    if (statusVideo) {
      video.volume = this.config.volume;
      video.currentTime = statusVideo.isEnded ? 0 : statusVideo.currentTime;
    } else {
      video.volume = 0.5;
      video.currentTime = 0;
    }

    this.currentVideo = video;
    this.ref.detectChanges();

    this.selectedVideo.next(video);
  }

  async videoUpdate(video: Video) {
    if (!video) {
      this.currentVideo = null;
      return;
    }
    if (!this.config[video.title]) {
      this.config[video.title] = new VideoStatus();
    }
    this.config[video.title].currentTime = video.currentTime;
    this.config[video.title].duration = video.duration;
    this.config[video.title].isEnded = video.isEnded;
    this.config.volume = video.volume;
    this.isReduce = video.isReduce;
    this.ref.detectChanges();
    this.paramsService.updateConfig(this.config);
    this.totalTimeSpend = Object.values(this.config).map(h => h.currentTime).filter(p => p).reduce((c, d) => c + d);
    if (video.isEnded) {
      console.log('end');
    }
  }

  getTime(secs) {
    var sec_num = parseInt(secs, 10)
    var hours = Math.floor(sec_num / 3600)
    var minutes = Math.floor(sec_num / 60) % 60
    var seconds = sec_num % 60

    return [hours, minutes, seconds]
      .map(v => v < 10 ? "0" + v : v)
      .filter((v, i) => v !== "00" || i > 0)
      .join(":")
  }

  ngOnDestroy(): void {
    //this.ref.detectChanges();
  }
}
