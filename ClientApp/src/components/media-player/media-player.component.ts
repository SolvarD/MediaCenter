import { Component, OnInit, ChangeDetectorRef, Input, Output, HostListener } from '@angular/core';
import { Video } from '../../models/video';
import { Subject } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { KEY_CODE } from '../../enums/key-code';

@Component({
  selector: 'app-media-player',
  templateUrl: './media-player.component.html',
  styleUrls: ['media-player.component.less']
})
export class MediaPlayerComponent implements OnInit {
  videoElement: HTMLVideoElement;

  @Input()
  video: Subject<Video> = new Subject<Video>();
  @Output()
  videoStat: Subject<Video> = new Subject<Video>();

  statPause: boolean = false;
  statPlay: boolean = true;
  safePath: SafeUrl;
  title: string;

  reduce: boolean = false;


  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.videoElement && !this.reduce) {
      //space

      switch (event.keyCode) {
        case KEY_CODE.UP_ARROW:
          this.upVolume();
          break;
        case KEY_CODE.DOWN_ARROW:
          this.downVolume();
          break;
        case KEY_CODE.RIGHT_ARROW:
          this.forward();
          break;
        case KEY_CODE.LEFT_ARROW:
          this.backward();
          break;
        case KEY_CODE.SPACE:
          this.playPause();
          break;
      }
    }
  }

  constructor(private ref: ChangeDetectorRef, private sanitizer: DomSanitizer) {

  }

  ngOnInit() {
    this.video.asObservable().subscribe((video) => {

      this.resetVideoElement();
      this.reduce = false;
      this.videoToVideoElement(video);
      this.safePath = this.sanitizer.bypassSecurityTrustUrl(video.path);

      this.videoElement.addEventListener('play', this.eventPlay);
      this.videoElement.addEventListener('pause', this.eventPause);
      this.videoElement.addEventListener('timeupdate', this.eventUpdateVideoStatus);
      this.videoElement.addEventListener('volumechange', this.eventUpdateVideoStatus);
      this.videoElement.addEventListener('ended', (e) => {
        this.close();
      });
    });

  }

  eventPlay = () => {
    this.statPause = false;
    this.statPlay = true;
    this.ref.detectChanges();
  }
  eventPause = () => {
    this.statPause = true;
    this.statPlay = false;
    this.ref.detectChanges();
  }

  eventUpdateVideoStatus = () => {
    this.videoStat.next(this.videoElementToVideo(this.videoElement));
  }

  eventKeyUp(event) {
    console.log(event)
  }

  videoToVideoElement(video: Video) {
    this.title = video.title;
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

  playPause() {
    if (this.statPause) {
      this.statPause = false;
      this.statPlay = true;
      this.play();
    } else {
      this.statPause = true;
      this.statPlay = false;
      this.pause();
    }
  }

  fullScreen() {
    this.videoElement.requestFullscreen({ navigationUI: "hide" });
  }

  muteSound() {
    this.videoElement.muted = !this.videoElement.muted;
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

  close() {
    this.resetVideoElement();
    this.videoStat.next(null);
  }

  resetVideoElement() {
    this.safePath = null;
    this.removeEvents();
    this.videoElement = null;
    this.ref.detectChanges();
  }

  reduceVideo() {
    this.reduce = !this.reduce;
    this.videoStat.next(this.videoElementToVideo(this.videoElement));
  }
  videoElementToVideo(videoElement: HTMLVideoElement) {
    let video: Video = new Video();
    video.title = this.title;
    video.currentTime = videoElement.currentTime;
    video.volume = videoElement.volume;
    video.duration = videoElement.duration;
    video.isReduce = this.reduce;
    video.isEnded = videoElement.ended;
    this.ref.detectChanges();
    return video;
  }

  removeEvents() {
    if (!this.videoElement) { return; }
    this.videoElement.removeEventListener('play', this.eventPlay);
    this.videoElement.removeEventListener('pause', this.eventPause);
    this.videoElement.removeEventListener('timeupdate', this.eventUpdateVideoStatus);
    this.videoElement.removeEventListener('volumechange', this.eventUpdateVideoStatus);
  }

  upVolume() {
    if (this.videoElement.volume < 1) {
      this.videoElement.volume += 0.05;
    }
  }

  downVolume() {
    if (this.videoElement.volume > 0) {
      this.videoElement.volume -= 0.05;
    }
  }
}
