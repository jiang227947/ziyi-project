import {Inject, Injectable} from '@angular/core';
import {DOCUMENT} from "@angular/common";
import {AppGlobal, AppGlobalRef} from "./google-map-loader.service";

@Injectable()
export class MapBoxLoaderService {

  private _distancesPromise: Promise<void>;

  constructor(private _global: AppGlobalMapBoxRef, @Inject(DOCUMENT) private _document) {
  }

  /**
   * 测量距离JS加载
   * */
  loadDistances(): Promise<void> {
    const winRef = this._global.nativeGlobal as any;
    if (winRef.turf) {
      return Promise.resolve();
    }
    if (this._distancesPromise) {
      return this._distancesPromise;
    }
    const scriptOnPage = this._document.getElementById('measure-distances');
    if (scriptOnPage) {
      this._assignScriptLoadingPromise(scriptOnPage);
      return this._distancesPromise;
    }
    const script = this._document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.defer = true;
    script.id = 'measure-distances';
    script.src = 'https://unpkg.com/@turf/turf@6/turf.min.js';
    this._assignScriptLoadingPromise(script);
    this._document.body.appendChild(script);
    return this._distancesPromise;
  }

  private _assignScriptLoadingPromise(scriptElem: HTMLElement) {
    this._distancesPromise = new Promise<void>((resolve: Function, reject: Function) => {
      (this._global.nativeGlobal as any).turf = () => {
        resolve();
      };
      scriptElem.onerror = (error: Event) => {
        reject(error);
      };
    });
  }
}

export abstract class AppGlobalMapBoxRef {
  abstract get nativeGlobal(): AppGlobal;
}

export class BrowserGlobalMapBoxRef extends AppGlobalMapBoxRef {
  get nativeGlobal(): any {
    return window as any;
  }
}
