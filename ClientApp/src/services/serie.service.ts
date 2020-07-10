import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ipcRenderer } from "electron-renderer";
import { Video } from "../models/video";

@Injectable()
export class SerieService {
  constructor(private http: HttpClient) { }

  async getNode(path: string): Promise<Array<Video>> {
    ipcRenderer.send('list-serie', path);

    let promise = new Promise<Array<Video>>((resolve) => {
      ipcRenderer.once('list-serie', (event, list: Array<Video>) => {
        resolve(list);
      });
    });

    return promise;    
  }

  async getTree(path: string): Promise<Array<Video>> {
    ipcRenderer.send('list-serie-group', path);

    let promise = new Promise<Array<Video>>((resolve) => {
      ipcRenderer.once('list-serie-group', (event, list: Array<Video>) => {
        resolve(list);
      });
    });

    return promise;    
  }
}
