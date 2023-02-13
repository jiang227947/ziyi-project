import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';

@Component({
  selector: 'app-webgl',
  templateUrl: './webgl.component.html',
  styleUrls: ['./webgl.component.scss']
})
export class WebglComponent implements OnInit, AfterViewInit {

  @ViewChild('canvasElement') canvasElement: ElementRef;
  // webgl
  gl: WebGLRenderingContextBase;

  constructor(private _renderer2: Renderer2) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    // 获取WebGL上下文
    this.gl = this.canvasElement.nativeElement.getContext('webgl');
    if (!this.gl) {
      console.log('不支持webgl');
      return;
    }
    //顶点着色器源码
    const vertexShaderSource = '' +
      'void main(){' +
      //给内置变量gl_PointSize赋值像素大小
      '   gl_PointSize=20.0;' +
      //顶点位置，位于坐标原点
      '   gl_Position =vec4(0.0,0.0,0.0,1.0);' +
      '}';

    //片元着色器源码
    const fragShaderSource = '' +
      'void main(){' +
      //定义片元颜色
      '   gl_FragColor = vec4(1.0,0.0,0.0,1.0);' +
      '}';

    //初始化着色器
    const program = this.initShader(this.gl, vertexShaderSource, fragShaderSource);
    //开始绘制，显示器显示结果
    this.gl.drawArrays(this.gl.POINTS, 0, 1);
  }

  // 声明初始化着色器函数
  initShader(gl: WebGLRenderingContextBase, vertexShaderSource: string, fragmentShaderSource: string): WebGLProgram {
    //创建顶点着色器对象
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    //创建片元着色器对象
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    //引入顶点、片元着色器源代码
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    //编译顶点、片元着色器
    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);

    //创建程序对象program
    const program = gl.createProgram();
    //附着顶点着色器和片元着色器到program
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    //链接program
    gl.linkProgram(program);
    //使用program
    gl.useProgram(program);
    //返回程序program对象
    return program;
  }

}
