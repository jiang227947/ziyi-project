import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NavItemEnum} from "../../shared-module/enum/resume.enum";

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

  @ViewChild('resumeMain') resumeMain: ElementRef<Element>;
  @ViewChild('container') containerRef: ElementRef<Element>;
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
    window.addEventListener('scroll', () => {
      console.log('滚动条高度scrollHeight', this.resumeMain.nativeElement.scrollHeight);
      console.log('滚动距离scrollTop', this.resumeMain.nativeElement.scrollTop);
      console.log('可视区域clientHeight', this.resumeMain.nativeElement.clientHeight);
    })
    this.resumeMain.nativeElement.addEventListener('scroll', (e) => {
      console.log(e);
    });
    this.containerRef.nativeElement.addEventListener('scroll', (e) => {
      console.log(e);
    });
    console.log(this.containerRef.nativeElement);
    this.scrollHeight = this.containerRef.nativeElement.scrollHeight;
    console.log('滚动条高度scrollHeight', this.scrollHeight);
    console.log('滚动距离scrollTop', this.containerRef.nativeElement.scrollTop);
    console.log('可视区域clientHeight', this.containerRef.nativeElement.clientHeight);

    console.log('滚动条高度scrollHeight', this.resumeMain.nativeElement.scrollHeight);
    console.log('滚动距离scrollTop', this.resumeMain.nativeElement.scrollTop);
    console.log('可视区域clientHeight', this.resumeMain.nativeElement.clientHeight);

    // setTimeout(() => {
    //   this.chatGPT.nativeElement.scrollTop = this.chatGPT.nativeElement.scrollHeight;
    // }, 0);
  }

  navItemChang(select: NavItemEnum): void {
    this.selectNav = select;
    console.log('this.selectNav', this.selectNav);
    switch (select) {
      case NavItemEnum.About:
        this.containerRef.nativeElement.scrollTop = 0;
        break;
      case NavItemEnum.Education:
        this.containerRef.nativeElement.scrollTop = this.scrollHeight;
        break;
      case NavItemEnum.Experience:
        this.containerRef.nativeElement.scrollTop = this.scrollHeight * 2;
        break;
      case NavItemEnum.Skills:
        this.containerRef.nativeElement.scrollTop = this.scrollHeight * 3;
        break;
    }
  }

}
