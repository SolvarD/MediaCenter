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
      ipcRenderer.once('load-config', (event, config) => {
        resolve(JSON.parse(config));
      });
    });

    return promise;    
  }

  async updateConfig(config: any): Promise<MediaCenterConfig> {
    ipcRenderer.send('update-config',config);

    let promise = new Promise<MediaCenterConfig>((resolve) => {
      ipcRenderer.once('update-config', (event, config) => {
        resolve(config);
      });
    });

    return promise;
  }
}
