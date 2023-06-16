import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-chat-sidebar',
  templateUrl: './chat-sidebar.component.html',
  styleUrls: ['./chat-sidebar.component.scss']
})
export class ChatSidebarComponent implements OnInit {

  // 创建频道模板
  visible: boolean = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  /**
   * 创建频道
   */
  createChannel(): void {
    this.visible = true;
  }

  onCancel(): void {
    this.visible = false;
  }
}
