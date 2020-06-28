import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ipcRenderer } from 'electron-renderer';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Video } from '../../models/video';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  series: Array<Video> = [];
  //selectedVideo: SafeUrl;
  selectedVideo: Video;
  constructor(private ref: ChangeDetectorRef) { }

  ngOnInit() {
    ipcRenderer.send('list-serie');
    ipcRenderer.on('list-serie', (event, list: Array<Video>) => {
      this.series = list;
      this.ref.detectChanges();
    });
  }

  selectVideo(video: Video) {
    this.selectedVideo = video;
    this.ref.detectChanges();
  }

  videoUpdate(video: Video) {
    //console.log(video);
  }
}
