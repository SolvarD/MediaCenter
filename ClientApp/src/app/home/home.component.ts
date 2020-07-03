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
  constructor(private ref: ChangeDetectorRef, private serieService: SerieService, private paramsService: ParamsService) { }

  async ngOnInit() {
    
    this.config = await this.paramsService.getConfig();

    this.series = await this.serieService.getNode('I:\\Dark.Matter.S01.COMPLETE.FASTSUB.VOSTFR.720P.HDTV.X264-RUDY');

    console.log(this.config);
    this.ref.detectChanges();
  }

  selectVideo(video: Video) {
    video.volume = 0.5;
    video.currentTime = 0;
    this.selectedVideo.next(video);
    this.ref.detectChanges();
  }

  videoUpdate(video: Video) {
    //console.log(video);
  }
}
