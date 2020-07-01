import { Component, OnInit, ChangeDetectorRef, Input, Output } from '@angular/core';
import { Video } from '../../models/video';
import { Subject } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-media-player',
  templateUrl: './media-player.component.html',
  styleUrls: ['media-player.component.less']
})
export class MediaPlayerComponent implements OnInit {

  @Input()
  video: Video;
  @Output()
  videoStat: Subject<Video> = new Subject<Video>();


  currentVideo: Video;
  videoElement: HTMLVideoElement;
  statPause: boolean = false;
  statPlay: boolean = true;
  safePath: SafeUrl;
  constructor(private ref: ChangeDetectorRef, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.videoElement = document.getElementsByTagName('video')[0];

    this.safePath = this.sanitizer.bypassSecurityTrustUrl(this.video.path);

    this.videoElement.addEventListener('play', (x) => {
      this.statPause = false;
      this.statPlay = true;
      this.ref.detectChanges();
    });

    this.videoElement.addEventListener('pause', (x) => {
      this.statPause = true;
      this.statPlay = false;
      this.ref.detectChanges();
    });

    this.videoElement.addEventListener('timeupdate', (x) => {
      this.video.currentTime = this.videoElement.currentTime;
      this.ref.detectChanges();
      this.videoStat.next(this.video);
    });
  }

  forward(seconds: number = 10) {
    this.videoElement.currentTime += seconds;
  }

  backward(seconds: number = 10) {
    this.videoElement.currentTime -= seconds;
  }

  pause() {
    this.videoElement.pause();
  }

  play() {
    this.videoElement.play();
  }

  fullScreen() {
    this.videoElement.requestFullscreen();
  }
}
