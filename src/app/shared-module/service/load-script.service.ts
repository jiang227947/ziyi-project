import {Inject, Injectable, Renderer2} from '@angular/core';
import {DOCUMENT} from '@angular/common';

/**
 * 添加js到DOM元素
 */
@Injectable({
  providedIn: 'root'
})
export class LoadScriptService {
  constructor(@Inject(DOCUMENT) private document: Document) {
  }

  /**
   * 添加js到DOM元素
   * @param renderer Angular renderer2
   * @param id 标签的id 用来校验是否已经添加过js
   * @param src js地址
   * @param type 标签类型
   * @returns the script element
   */
  public loadJsScript(renderer: Renderer2, id: string, src: string, type: string): Promise<HTMLElement> {
    return new Promise<HTMLElement>((resolve, reject) => {
      try {
        const script: HTMLScriptElement = renderer.createElement('script');
        script.type = type;
        script.async = true;
        script.defer = true;
        script.id = id;
        script.src = src;
        renderer.appendChild(this.document.body, script);
        resolve(script);
      } catch (e) {
        console.log(e);
        reject(e);
      }
    });
  }
}
