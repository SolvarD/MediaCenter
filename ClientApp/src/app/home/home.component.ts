import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ipcRenderer } from 'electron-renderer';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Video } from '../../models/video';
import { SerieService } from '../../services/serie.service';
import { ParamsService } from '../../services/params.service';
import { Subject } from 'rxjs';
import { MediaCenterConfig } from '../../models/media-center-config';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  series: Array<Video> = [];
  config: MediaCenterConfig;
  selectedVideo: Subject<Video> = new Subject<Video>();
  currentVideo: Video;
  path: string = '\\\\Ultimate-omega\\k'
  constructor(private ref: ChangeDetectorRef, private serieService: SerieService, private paramsService: ParamsService) { }

  async ngOnInit() {

    this.config = await this.paramsService.getConfig();

    console.log(this.config);
    this.ref.detectChanges();
  }

  selectVideo(video: Video) {
    let statusVideo = this.config[video.title];
    if (statusVideo) {
      video.volume = this.config.volume;
      video.currentTime = this.config[video.title].currentTime;
    } else {
      video.volume = 0.5;
      video.currentTime = 0;
    }

    this.currentVideo = video;
    this.selectedVideo.next(video);
    this.ref.detectChanges();
  }

  async videoUpdate(video: Video) {
    if (!video) {
      this.currentVideo = null;
      return;
    }
    console.log(video);
    if (!this.config[video.title]) {
      this.config[video.title] = {};
    }
    this.config[video.title].currentTime = video.currentTime;
    this.config[video.title].duration = video.duration;
    this.config.volume = video.volume;
    this.ref.detectChanges();
    this.paramsService.updateConfig(this.config);
  }
}
