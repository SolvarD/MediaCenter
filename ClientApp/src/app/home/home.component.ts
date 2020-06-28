import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ipcRenderer } from 'electron-renderer';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  series = [];

  constructor(private ref: ChangeDetectorRef) { }

  ngOnInit() {
    ipcRenderer.send('list-serie');
    ipcRenderer.on('list-serie', (event, list: Array<string>) => {
      this.series = list;
      this.ref.detectChanges();
    });
  }
}
