import { Component, OnInit, ChangeDetectorRef, Input, Output } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Video } from '../../models/video';
import { Subject } from 'rxjs';
import { SerieService } from '../../services/serie.service';
import { HistoryExplorer } from '../../models/history';

@Component({
  selector: 'app-display-folder',
  templateUrl: './display-folder.component.html',
  styleUrls: ['./display-folder.component.less']
})
export class DisplayFolderComponent implements OnInit {
  @Input()
  path: string = '';
  videos: Video[] = [];
  @Output()
  selectedVideo: Subject<Video> = new Subject<Video>();
  search: Subject<any> = new Subject<any>();
  safePath: SafeUrl;
  @Input()
  level: number = 0;
  textFilter: string = '';
  history: Array<HistoryExplorer> = [];
  currentTitle: string;
  constructor(private ref: ChangeDetectorRef, private sanitizer: DomSanitizer, private serieService: SerieService) {

  }

  async ngOnInit() {
    this.videos = await this.serieService.getNode(this.path);
    this.addToHistory({ path: this.path, index: 0, title: null });
    this.search.asObservable().subscribe((event) => {
      if (event.target.value.length >= 2) {
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

  selectVideo(video: Video) {
    this.currentTitle = video.title;
    this.selectedVideo.next(video);
  }

  filterSerie() {
    return this.videos.filter((video: Video) => { return video.title.toLowerCase().indexOf(this.textFilter.toLowerCase()) > -1; })
  }
  async getNode(serie: Video) {
    this.videos = await this.serieService.getNode(serie.path);
    this.ref.detectChanges();
  }
  async goTo(history: HistoryExplorer) {
    this.addToHistory(history);
    this.ref.detectChanges();
  }

  addToHistory(history: HistoryExplorer) {

    let addHistory: HistoryExplorer = history;

    if (!history.title) {
      let pathArray = history.path.split('\\');
      addHistory.title = pathArray[pathArray.length - 1];
    }
    if (!history.index && history.index != 0) {
      addHistory.index = this.history.length;
    }
    if (history.index == 0 || history.index){
      this.history.splice(history.index);
    }
    let video = new Video();
    video.path = history.path;
    this.getNode(video);

    this.history.push(addHistory);
  }
}
