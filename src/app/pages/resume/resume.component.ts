import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NavItemChineseEnum, NavItemEnum} from '../../shared-module/enum/resume.enum';
import {fromEvent, Subscription} from 'rxjs';

/**
 * 简历页面
 * create_time 2023年2月10日11:08:59
 */
@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.scss']
})
export class ResumeComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('container') containerRef: ElementRef<Element>;
  // 关于
  @ViewChild('aboutRef') aboutRef: ElementRef<Element>;
  // 工作经历
  @ViewChild('experienceRef') experienceRef: ElementRef<Element>;
  // 教育经历
  @ViewChild('educationRef') educationRef: ElementRef<Element>;
  // 掌握技能
  @ViewChild('skillsRef') skillsRef: ElementRef<Element>;

  // 菜单
  selectNav: NavItemEnum = NavItemEnum.About;
  // 菜单收缩
  showNavbr = false;
  // 订阅滚动
  subscribeScroll: Subscription;
  // 菜单分类
  navItem: { select: NavItemEnum, label: string }[] = [
    {
      select: NavItemEnum.About,
      label: NavItemChineseEnum.About
    },
    {
      select: NavItemEnum.Experience,
      label: NavItemChineseEnum.Experience
    },
    {
      select: NavItemEnum.Education,
      label: NavItemChineseEnum.Education
    },
    {
      select: NavItemEnum.Skills,
      label: NavItemChineseEnum.Skills
    },
  ];
  // 掌握技能icons
  skillsAliIconList: string[];

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    // 关闭订阅
    this.subscribeScroll.unsubscribe();
  }

  ngAfterViewInit(): void {
    // 可视高度的一半
    const clientHeight = this.containerRef.nativeElement.clientHeight / 2;
    // 关于高度
    const aboutRef = this.aboutRef.nativeElement.scrollHeight;
    // 工作经历高度
    const experienceRef = this.experienceRef.nativeElement.scrollHeight;
    // 教育经历高度
    const educationRef = this.educationRef.nativeElement.scrollHeight;
    // 掌握技能高度
    const skillsRef = this.skillsRef.nativeElement.scrollHeight;
    this.subscribeScroll = fromEvent(this.containerRef.nativeElement, 'scroll').subscribe(() => {
      const scrollTop = this.containerRef.nativeElement.scrollTop;
      if (scrollTop <= aboutRef - clientHeight) {
        // 关于
        this.selectNav = NavItemEnum.About;
      } else if (scrollTop > aboutRef - clientHeight && scrollTop <= (aboutRef + experienceRef) - clientHeight) {
        // 工作经历
        this.selectNav = NavItemEnum.Experience;
      } else if (scrollTop > (aboutRef + experienceRef) - clientHeight
        && scrollTop <= ((aboutRef + experienceRef + educationRef) - clientHeight)) {
        // 教育经历
        this.selectNav = NavItemEnum.Education;
      } else if (scrollTop > ((aboutRef + experienceRef + educationRef) - clientHeight)
        && scrollTop <= ((aboutRef + experienceRef + educationRef + skillsRef) - clientHeight)) {
        // 掌握技能
        this.selectNav = NavItemEnum.Skills;
      }
    });
  }

  // 菜单点击
  navItemChang(select: NavItemEnum): void {
    this.selectNav = select;
    switch (select) {
      case NavItemEnum.About:
        // 关于
        this.containerRef.nativeElement.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        break;
      case NavItemEnum.Experience:
        // 工作经历
        this.containerRef.nativeElement.scrollTo({
          top: this.aboutRef.nativeElement.scrollHeight + 2,
          behavior: 'smooth'
        });
        break;
      case NavItemEnum.Education:
        // 教育经历
        this.containerRef.nativeElement.scrollTo({
          top: this.aboutRef.nativeElement.scrollHeight
            + this.experienceRef.nativeElement.scrollHeight + 4,
          behavior: 'smooth'
        });
        break;
      case NavItemEnum.Skills:
        // 掌握技能
        this.containerRef.nativeElement.scrollTo({
          top: this.aboutRef.nativeElement.scrollHeight
            + this.experienceRef.nativeElement.scrollHeight
            + this.educationRef.nativeElement.scrollHeight
            + this.skillsRef.nativeElement.scrollHeight + 8,
          behavior: 'smooth'
        });
        break;
    }
  }

  // 菜单收缩
  navbarToggler(): void {
    this.showNavbr = !this.showNavbr;
  }

}
