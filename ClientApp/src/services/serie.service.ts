import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ipcRenderer } from "electron-renderer";
import { Video } from "../models/video";

@Injectable()
export class SerieService {
  constructor(private http: HttpClient) { }

  async getNode(path): Promise<Array<Video>> {
    ipcRenderer.send('list-serie', path);

    let promise = new Promise<Array<Video>>((resolve) => {
      ipcRenderer.on('list-serie', (event, list: Array<Video>) => {
        resolve(list);
      });
    });

    return promise;    
  }

  async getTree(path): Promise<Array<Video>> {
    ipcRenderer.send('list-serie-group', path);

    let promise = new Promise<Array<Video>>((resolve) => {
      ipcRenderer.on('list-serie-group', (event, list: Array<Video>) => {
        resolve(list);
      });
    });

    return promise;    
  }
}
