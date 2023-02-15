import {AfterViewInit, Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-qunee',
  templateUrl: './qunee.component.html',
  styleUrls: ['./qunee.component.scss']
})
export class QuneeComponent implements OnInit, AfterViewInit {

  // 引入qunee画布
  Qunee: any = window['Q'];
  // 画布对象
  graph: any;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if (this.graph) {
      this.graph.clear();
    } else {
      this.graph = new this.Qunee.Graph('q-canvas');
    }
    // this.graph.updateViewport();
    // this.graph.moveToCenter();
    this.graph.originAtCenter = false;

    this.textDemo();
  }

  // 文本Demo
  textDemo(): void {
    const html5 = this.createText(null, "Angular", 310, 20, this.Qunee.Position.CENTER_TOP, 572, 380, 30, "#2eaae6");
    const newElements = this.createText(html5, "New Core", 170, 71, this.Qunee.Position.CENTER_TOP, 255, 216, 20, "#2eaae6", "#ebebeb");
    const newAPIs = this.createText(html5, "New APIs", 450, 71, this.Qunee.Position.CENTER_TOP, 255, 216, 20, "#2eaae6", "#ebebeb");
    this.createText(newElements, "<ng-template>", 118, 135);
    this.createText(newElements, "<ng-container>", 227, 165);
    this.createText(newElements, "<router-outlet>", 116, 196);
    this.createText(newAPIs, "ngFor\nngIf\nngModel\nOnInit\nOutput\n" +
      "Renderer2\nViewChild\n......", 450, 112, this.Qunee.Position.CENTER_TOP, 210, 160);
    this.createText(html5, "rxjs", 86, 335);
    this.createText(html5, "HttpClient", 182, 322);
    this.createText(html5, "Routes", 109, 380);
    this.createText(html5, "TypeScript", 184, 362);
    this.createText(html5, "more...", 233, 390);
    this.createText(html5, "Injectable", 409, 320);
    this.createText(html5, "Pipe", 520, 335);
    this.createText(html5, "interface", 441, 370);

    const html5Logo = this.graph.createNode("", 313, 375);
    html5Logo.image = "../../../../../assets/icon/ico/angular.ico";
    html5Logo.size = {width: 120};
    html5Logo.host = html5Logo.parent = html5;
  }

  // 创建文本
  createText(host, name, x, y, anchorPosition?, w?, h?, fontSize?, fontColor?, backgroundColor?): void {
    const text = this.graph.createText(name, x, y);
    text.setStyle(this.Qunee.Styles.LABEL_BORDER, 0.5);
    text.setStyle(this.Qunee.Styles.LABEL_PADDING, 5);
    text.setStyle(this.Qunee.Styles.LABEL_BORDER_STYLE, "#1D4876");
    text.tooltipType = "text";
    if (host) {
      text.host = text.parent = host;
    }
    if (anchorPosition) {
      text.anchorPosition = anchorPosition;
      text.setStyle(this.Qunee.Styles.LABEL_ALIGN_POSITION, anchorPosition);
    }
    if (w && h) {
      text.setStyle(this.Qunee.Styles.LABEL_SIZE, new this.Qunee.Size(w, h));
    }
    text.setStyle(this.Qunee.Styles.LABEL_FONT_SIZE, fontSize || 14);
    text.setStyle(this.Qunee.Styles.LABEL_COLOR, fontColor || "#555");
    text.setStyle(this.Qunee.Styles.LABEL_BACKGROUND_COLOR, backgroundColor || "#FFF");
//    text.setStyle(Q.Styles.LABEL_BACKGROUND_GRADIENT, new Q.Gradient(Q.Consts.GRADIENT_TYPE_LINEAR, ['#00d4f9', '#1ea6e6'], null, Math.PI/2));
    return text;
  }

}
