import {Inject, Injectable} from '@angular/core';
import {DOCUMENT} from "@angular/common";

/**
 * 加载谷歌地图
 * 2022年5月12日14:00:14
 * jzy
 * */
@Injectable()
export class GoogleMapLoaderService {
  private _scriptLoadingPromise: Promise<void>;

  protected readonly _SCRIPT_ID: string = 'google-map-script';

  constructor(private _global: AppGlobalRef, @Inject(DOCUMENT) private _document) {
  }

  load(): Promise<void> {
    const winRef = this._global.nativeGlobal as any;
    if (winRef.google && winRef.google.maps) {
      return Promise.resolve();
    }

    if (this._scriptLoadingPromise) {
      return this._scriptLoadingPromise;
    }

    const scriptOnPage = this._document.getElementById(this._SCRIPT_ID);

    if (scriptOnPage) {
      this._assignScriptLoadingPromise(scriptOnPage);
      return this._scriptLoadingPromise;
    }

    const script = this._document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.defer = true;
    script.id = this._SCRIPT_ID;
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAsr90Gk__CiPfe407CBLlZQqfGNFEZAmI&libraries=drawing&callback=initGoogleMap';// this._getScriptSrc(this.callbackName);
    this._assignScriptLoadingPromise(script);
    this._document.body.appendChild(script);
    return this._scriptLoadingPromise;
  }

  private _assignScriptLoadingPromise(scriptElem: HTMLElement) {
    this._scriptLoadingPromise = new Promise<void>((resolve: Function, reject: Function) => {

      (this._global.nativeGlobal as any).initGoogleMap = () => {
        resolve();
      };

      scriptElem.onerror = (error: Event) => {
        reject(error);
      };
    });
  }
}


export interface AppGlobal {

}

export abstract class AppGlobalRef {
  abstract get nativeGlobal(): AppGlobal;
}

export class BrowserGlobalRef extends AppGlobalRef {
  get nativeGlobal(): AppGlobal {
    return window as AppGlobal;
  }
}
