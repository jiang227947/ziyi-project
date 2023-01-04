import {Inject, Injectable} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {AppGlobalRef} from './google-map-loader.service';

@Injectable()
export class BingMapLoaderService {

  private _scriptLoadingPromise: Promise<void>;

  protected readonly _SCRIPT_ID: string = 'bing-script';

  constructor(private _global: AppGlobalRef, @Inject(DOCUMENT) private _document) {
  }

  load(): Promise<void> {
    const winRef = this._global.nativeGlobal as any;
    if (winRef.Microsoft) {
      return Promise.resolve();
    }
    // if (this._scriptLoadingPromise) {
    //     console.log('_scriptLoadingPromise有值，直接返回');
    //     return this._scriptLoadingPromise;
    // }

    // const scriptOnPage = this._document.getElementById(this._SCRIPT_ID);
    // const uiScriptOnPage = this._document.getElementById(this._UI_SCRIPT_ID);

    // if (scriptOnPage && uiScriptOnPage) {
    //     console.log('sript对象存在，直接返回');
    //     return Promise.resolve();
    // }
    const script = this._document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.defer = true;
    script.id = this._SCRIPT_ID;
    script.src = 'https://cn.bing.com/api/maps/mapcontrol?branch=experimental&setmkt=zh-cn&key=AvHCAx5M3rKrzF-3b_DpRotDCe5Bs53FsqmGhg6i4t0ISDPjadyZsCke61VGacfd&callback=loadMapScenario';
    this._assignScriptLoadingPromise(script);
    this._document.body.appendChild(script);
    return this._scriptLoadingPromise;
  }


  private _assignScriptLoadingPromise(scriptElem: HTMLElement) {
    this._scriptLoadingPromise = new Promise<void>((resolve: Function, reject: Function) => {
      (this._global.nativeGlobal as any).loadMapScenario = () => {
        resolve();
      };
      scriptElem.onerror = (error: Event) => {
        reject(error);
      };
    });
  }
}
