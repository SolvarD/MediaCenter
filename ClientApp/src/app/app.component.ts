import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'app';

  //constructor() {
  //  //check if platform is electron
  //  let isElectron: boolean = (window && window['process'] && window['process'].type);

  //  if (isElectron) {
  //    let fs: typeof Fs = window['require']('fs');
  //    let app: Electron.App = window['require']('electron').remote;
  //    console.log(fs, app, window['process']);
  //  }
  //}
}
