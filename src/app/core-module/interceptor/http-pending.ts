import {Injectable, NgZone} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {defer, Observable, ReplaySubject} from 'rxjs';
import {catchError, delay, retry, tap} from 'rxjs/operators';

export interface Pending<T> {
  data: Observable<T>;
  status: Observable<Status>;
}

export enum Status {
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

/**
 * HTTP请求状态监听服务
 */
@Injectable()
export class HttpPending {
  constructor(private http: HttpClient, private ngZone: NgZone) {
  }

  load(url: string): Pending<any> {
    const status = new ReplaySubject<Status>();

    const request = this.http
      .get<any>(url)
      .pipe(
        delay(2000), // artificial delay
        retry(2),
        catchError(error => {
          status.next(Status.ERROR);
          throw new Error('error loading user');
        }),
        tap(() => status.next(Status.SUCCESS))
      );
    const data = defer(() => {
      status.next(Status.LOADING);
      return request;
    });

    return {data, status};
  }
}
