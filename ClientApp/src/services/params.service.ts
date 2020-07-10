import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ipcRenderer } from "electron-renderer";
import { MediaCenterConfig } from "../models/media-center-config";
import { Subject } from "rxjs";

@Injectable()
export class ParamsService {
  public static config: Subject<MediaCenterConfig> = new Subject<MediaCenterConfig>();
  public static configObv = ParamsService.config.asObservable();
  constructor(private http: HttpClient) {

  }

  async getConfig(): Promise<MediaCenterConfig> {
    ipcRenderer.send('load-config');

    let promise = new Promise<MediaCenterConfig>((resolve) => {
      ipcRenderer.once('load-config', (event, config) => {
        ParamsService.config.next(config);
        resolve(JSON.parse(config));
      });
    });

    return promise;    
  }

  async updateConfig(config: any) {
    ipcRenderer.send('update-config',config);
    ParamsService.config.next(config);
    //let promise = new Promise<MediaCenterConfig>((resolve) => {
    //  ipcRenderer.once('update-config', (event, config) => {
    //    ParamsService.config.next(config);
    //    resolve(config);
    //  });
    //});

    //return promise;
  }
}
