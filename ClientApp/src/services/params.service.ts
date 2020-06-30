import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ipcRenderer } from "electron-renderer";

@Injectable()
export class ParamsService {
  constructor(private http: HttpClient) { }

  async getConfig(): Promise<any> {
    ipcRenderer.send('load-config');

    let promise = new Promise<any>((resolve) => {
      ipcRenderer.on('load-config', (event, config) => {
        resolve(config);
      });
    });

    return promise;    
  }
}
