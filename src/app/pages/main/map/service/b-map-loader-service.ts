import {Inject, Injectable} from '@angular/core';
import {AppGlobalRef} from './google-map-loader.service';
import {DOCUMENT} from '@angular/common';

@Injectable()
export class BMapLoaderService {

  private _scriptLoadingPromise: Promise<void>;

  protected readonly _SCRIPT_ID: string = 'bmap-script';

  constructor(private _global: AppGlobalRef, @Inject(DOCUMENT) private _document) {
  }

  load(): Promise<void> {
    const winRef = this._global.nativeGlobal as any;
    if (winRef.BMap) {
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
    script.src = 'https://api.map.baidu.com/api?v=3.0&ak=W2dWD02aek2pRsiTPVB6HkPTVLSfHant&callback=init'; // this._getScriptSrc(this.callbackName);
    this._assignScriptLoadingPromise(script);
    this._document.body.appendChild(script);
    return this._scriptLoadingPromise;
  }


  private _assignScriptLoadingPromise(scriptElem: HTMLElement) {
    this._scriptLoadingPromise = new Promise<void>((resolve: Function, reject: Function) => {
      (this._global.nativeGlobal as any).init = () => {
        resolve();
      };
      scriptElem.onerror = (error: Event) => {
        reject(error);
      };
    });
  }
}
