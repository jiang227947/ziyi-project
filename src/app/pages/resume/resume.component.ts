import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NavItemEnum} from "../../shared-module/enum/resume.enum";
import {fromEvent} from 'rxjs';

/**
 * 简历页面
 * create_time 2023年2月10日11:08:59
 * */
@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.scss']
})
export class ResumeComponent implements OnInit, AfterViewInit {

  @ViewChild('container') containerRef: ElementRef<Element>;
  subscribeScroll: any;
  scrollDis: any = {
    _top: 0
  }
  // 菜单
  selectNav: NavItemEnum = NavItemEnum.About;
  // 一个页面的高度
  scrollHeight: number;
  // 菜单分类
  navItem = [
    {
      select: 'About',
      label: '关于'
    },
    {
      select: 'Experience',
      label: 'Experience'
    },
    {
      select: 'Education',
      label: 'Education'
    },
    {
      select: 'Skills',
      label: 'Skills'
    },
  ];

  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.subscribeScroll = fromEvent(this.containerRef.nativeElement, 'scroll')
      .subscribe((event) => {
        this.onWindowScroll();
      });
    this.scrollHeight = this.containerRef.nativeElement.scrollHeight;
    console.log('总共高度', this.scrollHeight);
    console.log('当前滚动高度', this.containerRef.nativeElement.scrollTop);
    console.log('可视区域', this.containerRef.nativeElement.clientHeight);
  }

  onWindowScroll(): void {
    console.log('页面滚动了')
  }

  navItemChang(select: NavItemEnum): void {
    this.selectNav = select;
    console.log('this.selectNav', this.selectNav);
    switch (select) {
      case NavItemEnum.About:
        this.containerRef.nativeElement.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        break;
      case NavItemEnum.Experience:
        this.containerRef.nativeElement.scrollTo({
          top: this.scrollHeight,
          behavior: 'smooth'
        });
        break;
      case NavItemEnum.Education:
        this.containerRef.nativeElement.scrollTop = this.scrollHeight * 3;
        break;
      case NavItemEnum.Skills:
        this.containerRef.nativeElement.scrollTop = this.scrollHeight * 4;
        break;
    }
  }

}
