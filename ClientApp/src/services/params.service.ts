import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ipcRenderer } from "electron-renderer";
import { MediaCenterConfig } from "../models/media-center-config";

@Injectable()
export class ParamsService {
  constructor(private http: HttpClient) { }

  async getConfig(): Promise<MediaCenterConfig> {
    ipcRenderer.send('load-config');

    let promise = new Promise<MediaCenterConfig>((resolve) => {
      ipcRenderer.on('load-config', (event, config) => {
        resolve(config);
      });
    });

    return promise;    
  }

  async updateConfig(): Promise<MediaCenterConfig> {
    ipcRenderer.send('load-config');

    let promise = new Promise<MediaCenterConfig>((resolve) => {
      ipcRenderer.on('load-config', (event, config) => {
        resolve(config);
      });
    });

    return promise;
  }
}
