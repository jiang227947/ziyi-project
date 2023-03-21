import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private myAppurl: string;
  private myApi: string = '';

  constructor(private http: HttpClient) {
    this.myAppurl = environment.NODE_API_URL;
    this.myApi = 'api/products';
  }

  /**
   * 获取数据
   */
  getProducts(): Observable<any> {
    return this.http.get(`${this.myAppurl}/${this.myApi}`);
  }

  /**
   * 注册
   */
  signIn(): Observable<any> {
    return this.http.get(`${this.myAppurl}/${this.myApi}`);
  }
}
