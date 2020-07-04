import { Component, OnInit, ChangeDetectorRef, Input, Output } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Video } from '../../models/video';
import { Subject } from 'rxjs';
import { SerieService } from '../../services/serie.service';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.less']
})
export class TreeComponent implements OnInit {
  private _incomingVideo: Video;
  videoElement: HTMLVideoElement;

  @Input()
  videos: Video[] = [];
  @Output()
  selectedVideo: Subject<Video> = new Subject<Video>();
  search: Subject<any> = new Subject<any>();
  safePath: SafeUrl;
  @Input()
  level: number = 0;
  textFilter: string = '';
  constructor(private ref: ChangeDetectorRef, private sanitizer: DomSanitizer, private serieService: SerieService) {

  }

  ngOnInit() {
    this.search.asObservable().subscribe((event) => {
      if (event.target.value.length > 2) {
        this.textFilter = event.target.value;
      } else {
        this.textFilter = '';
      }
    });
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

  selectVideo(video) {
    this.selectedVideo.next(video);
  }

  filterSerie() {
    return this.videos.filter((video: Video) => { return video.title.toLowerCase().indexOf(this.textFilter.toLowerCase()) > -1; })
  }
  async getNode(serie: Video) {
    serie.children = await this.serieService.getNode(serie.path);
    this.ref.detectChanges();
  }
}
