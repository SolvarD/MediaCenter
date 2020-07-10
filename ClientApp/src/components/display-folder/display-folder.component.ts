import { Component, OnInit, ChangeDetectorRef, Input, Output } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Video } from '../../models/video';
import { Subject } from 'rxjs';
import { SerieService } from '../../services/serie.service';
import { HistoryExplorer } from '../../models/history';
import { ParamsService } from '../../services/params.service';
import { MediaCenterConfig } from '../../models/media-center-config';

@Component({
  selector: 'app-display-folder',
  templateUrl: './display-folder.component.html',
  styleUrls: ['./display-folder.component.less']
})
export class DisplayFolderComponent implements OnInit {
  @Input()
  paths: string[] = [];
  videos: Video[] = [];
  @Output()
  selectedVideo: Subject<Video> = new Subject<Video>();
  search: Subject<any> = new Subject<any>();
  @Input()
  level: number = 0;
  textFilter: string = '';
  history: Array<HistoryExplorer> = [];
  currentTitle: string;
  config: MediaCenterConfig;
  constructor(private ref: ChangeDetectorRef, private sanitizer: DomSanitizer, private serieService: SerieService, private paramsService: ParamsService) {

  }

  async ngOnInit() {
    this.config = await this.paramsService.getConfig();

    ParamsService.configObv.subscribe((conf) => {
      this.config = conf;
      this.ref.detectChanges();
    })

    for (var i = 0; i < this.paths.length; i++) {
      let videos = await this.serieService.getNode(this.paths[i]);
      this.ref.detectChanges();
      this.videos = this.videos.concat(videos);
    }

    this.addToHistory({ paths: this.paths, index: 0, title: 'Root' });
    this.search.asObservable().subscribe((event) => {
      if (event.target.value.length >= 2) {
        this.textFilter = event.target.value;
      } else {
        this.textFilter = '';
      }
    });
  }
  async getVideos(paths: string[]) {
    this.videos = [];
    if (paths.length == 1) {
      this.videos = await this.serieService.getNode(paths[0]);
    } else {
      for (var i = 0; i < paths.length; i++) {
        let videos = await this.serieService.getNode(paths[i]);
        this.ref.detectChanges();        
        this.videos = this.videos.concat(videos);
      }
    }

    this.ref.detectChanges();
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

  selectVideo(video: Video) {
    this.textFilter = '';
    this.currentTitle = video.title;
    this.selectedVideo.next(video);
  }

  filterSerie() {
    return this.videos.filter((video: Video) => { return video.title.toLowerCase().indexOf(this.textFilter.toLowerCase()) > -1; }).sort(function (a, b) {
      if (a.title.toLowerCase() < b.title.toLowerCase()) { return -1; }
      if (a.title.toLowerCase() > b.title.toLowerCase()) { return 1; }
      return 0;
    });
  }

  async goTo(history: HistoryExplorer) {
    this.textFilter = '';
    this.addToHistory(history);
    this.ref.detectChanges();
  }

  addToHistory(history: HistoryExplorer) {

    let addHistory: HistoryExplorer = history;
    //if (!history.title) {
    //  let pathArray = history.paths.join(';').split('\\');
    //  addHistory.title = pathArray[pathArray.length - 1];
    //}
    if (!history.index && history.index != 0) {
      addHistory.index = this.history.length;
    }
    if (history.index == 0 || history.index) {
      this.history.splice(history.index);
    }
    this.getVideos(history.paths);

    this.history.push(addHistory);
  }

  getPartSaw(video: Video) {
    let videoParams = this.config[video.title];
    if (!videoParams || !videoParams.currentTime) { return '0%'; }
    return (Math.floor((videoParams.currentTime / videoParams.duration) * 100)) + '%'
  }
}
