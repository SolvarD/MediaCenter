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
  private _incomingVideo: Video;
  videoElement: HTMLVideoElement;

  @Input()
  video: Subject<Video> = new Subject<Video>();
  @Output()
  videoStat: Subject<Video> = new Subject<Video>();


  currentVideo: Video;

  statPause: boolean = false;
  statPlay: boolean = true;
  safePath: SafeUrl;
  constructor(private ref: ChangeDetectorRef, private sanitizer: DomSanitizer) {

  }

  ngOnInit() {
    this.video.asObservable().subscribe((video) => {
      this.videoToVideoElement(video);
      this.safePath = this.sanitizer.bypassSecurityTrustUrl(video.path);

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
        video.currentTime = this.videoElement.currentTime;
        this.ref.detectChanges();
        this.videoStat.next(video);
      });
      this.videoElement.addEventListener('volumechange', (x) => {
        video.volume = this.videoElement.volume;
        this.videoStat.next(video);
      });
    });

  }

  videoToVideoElement(video: Video) {
    this.videoElement = document.getElementsByTagName('video')[0];
    this.videoElement.volume = video.volume;
    this.videoElement.currentTime = video.currentTime;
    this.ref.detectChanges();
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
    this.videoElement.requestFullscreen({ navigationUI: "hide" });
  }
  muteSound() {
    this.videoElement.muted = !this.videoElement.muted;
  }
}
