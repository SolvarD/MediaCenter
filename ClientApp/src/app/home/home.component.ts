import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ipcRenderer } from 'electron-renderer';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Video } from '../../models/video';
import { SerieService } from '../../services/serie.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  series: Array<Video> = [];
  //selectedVideo: SafeUrl;
  selectedVideo: Video;
  constructor(private ref: ChangeDetectorRef, private serieService: SerieService) { }

  async ngOnInit() {
    this.series = await this.serieService.getAll();
    this.ref.detectChanges();
  }

  selectVideo(video: Video) {
    this.selectedVideo = video;
    this.ref.detectChanges();
  }

  videoUpdate(video: Video) {
    //console.log(video);
  }
}
