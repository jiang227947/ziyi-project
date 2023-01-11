import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from "../../../../environments/environment";
import {Result} from "../../../shared-module/interface/result";
import {User} from "../../../shared-module/interface/user";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  // bing每日背景图
  bingBackGroundImage = '../../../../assets/image/login-background.svg';

  constructor(private $http: HttpClient) {
  }

  ngOnInit(): void {
    // 获取bing每日背景图
    this.$http.get(`https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&nc=1586183781119&pid=hp&uhd=1&uhdwidth=2880&uhdheight=1620`).subscribe((result) => {
      this.bingBackGroundImage = `https://cn.bing.com${result.images[0].url}`;
    });
  }

}
