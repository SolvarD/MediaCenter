import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { ipcRenderer } from 'electron-renderer';

@Component({
  selector: 'app-media-player',
  templateUrl: './media-player.component.html',
})
export class MediaPlayerComponent implements OnInit {
  @Input()
  path: string;

  constructor(private ref: ChangeDetectorRef) { }

  ngOnInit() {
    ipcRenderer.send('list-serie');
    ipcRenderer.on('list-serie', (event, list: Array<string>) => {
      this.series = list;
      this.ref.detectChanges();
    });
  }
}
