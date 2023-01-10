import {Component, OnInit} from '@angular/core';
import {IndexApiService} from './service/indexApiService';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  // 获取指定日期的节假日信息
  holidayInfo = '';
  // 计算下一个假期
  holidayNext = '';
  // 获取指定日期的下一个工作日
  holidayWorkdayNext: any = {};
  // 距离今天最近的一个放假安排
  holidayTts = '';
  // 回答明天放假吗
  holidayTtsTomorrow = '';
  // 工资倒计时
  wagesCountdown = 0;

  constructor(private $IndexApiService: IndexApiService) {
  }

  ngOnInit(): void {
    this.getWagesCountdown();
    const timeHours = new Date().getHours();
    this.$IndexApiService.getHolidayInfo().subscribe((result) => {
      // console.log(result);
      if (result.code === 0) {
      }
    });
    this.$IndexApiService.getHolidayNext().subscribe((result) => {
      // console.log(result);
      if (result.code === 0) {

      }
    });
    this.$IndexApiService.getHolidayWorkdayNext().subscribe((result) => {
      // console.log(result);
      if (result.code === 0) {
        this.holidayWorkdayNext = result.workday;
      }
    });
    this.$IndexApiService.getHolidayTts().subscribe((result) => {
      // console.log(result);
      if (result.code === 0) {
        this.holidayTts = result.tts;
      }
    });
    this.$IndexApiService.getHolidayTtsTomorrow().subscribe((result) => {
      // console.log(result);
      if (result.code === 0) {

      }
    });
  }

  /**
   * 计算工资还有多少天发（）每个月5号
   * */
  getWagesCountdown(): void {
    let y = new Date().getFullYear();
    let m;
    const d = '5';
    if (new Date().getMonth() + 2 < 12) {
      m = new Date().getMonth() + 2;
    } else {
      y = new Date().getFullYear() + 1;
    }
    const future = new Date(`${y}/${m}/${d}`).getTime(); // 距离的时间
    const index = (future - new Date().getTime()) / 1000 / (60 * 60 * 24);
    this.wagesCountdown = parseInt(String(index));
  }

}
