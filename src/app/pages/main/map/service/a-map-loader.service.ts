import {Inject, Injectable} from '@angular/core';
import {AppGlobalRef} from './google-map-loader.service';
import {DOCUMENT} from '@angular/common';

@Injectable()
export class AMapLoaderService {

  private _scriptLoadingPromise: Promise<void>;

  protected readonly _SCRIPT_ID: string = 'amap-script';
  protected readonly _UI_SCRIPT_ID: string = 'amap-ui-script';

  constructor(private _global: AppGlobalRef, @Inject(DOCUMENT) private _document) {
  }

  load(): Promise<void> {
    const winRef = this._global.nativeGlobal as any;
    if (winRef.AMap) {
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
    script.src = 'https://webapi.amap.com/maps?v=2.0&key=844738f780d861f81137d1308c09768a&plugin=AMap.ToolBar&callback=initAMap'; // this._getScriptSrc(this.callbackName);
    //// webapi.amap.com/ui/1.0/main-async.js
    const uiScript = this._document.createElement('script');
    uiScript.type = 'text/javascript';
    uiScript.async = true;
    uiScript.defer = true;
    uiScript.id = this._UI_SCRIPT_ID;
    uiScript.src = 'https://webapi.amap.com/ui/1.1/main-async.js';
    this._assignScriptLoadingPromise(script);
    this._document.body.appendChild(uiScript);
    this._document.body.appendChild(script);
    return this._scriptLoadingPromise;
  }


  private _assignScriptLoadingPromise(scriptElem: HTMLElement) {
    this._scriptLoadingPromise = new Promise<void>((resolve: Function, reject: Function) => {
      (this._global.nativeGlobal as any).initAMap = () => {
        (this._global.nativeGlobal as any).initAMapUI();
        resolve();
      };
      scriptElem.onerror = (error: Event) => {
        reject(error);
      };
    });
  }
}
