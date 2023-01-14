import {AfterViewInit, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-welcome',
  templateUrl: './cad.component.html',
  styleUrls: ['./cad.component.scss']
})
export class CadComponent implements OnInit, AfterViewInit {
  mxOcx: any;
  mxinittime: any;
  plugins: any = null;

  loading = false;
  searchTxt = '';
  // 搜索文字输入框
  @ViewChild('searchTxtRef') searchTxtRef: TemplateRef<HTMLDocument>;

  constructor(private modal: NzModalService,
              private notification: NzNotificationService) {
  }

  ngAfterViewInit(): void {
    const plugins = navigator.plugins;
    this.plugins = plugins.namedItem('MxDraw5.2 ActiveX  plugin for NPAPI');
    if (this.plugins === null) {
      this.modal.error({
        nzTitle: '警告',
        nzContent: '请使用版本49.0.2623.112 Chromium内核浏览器打开，否则功能将无法使用！',
        nzOnCancel: null
      });
      return;
    }
    this.mxinittime = setTimeout(() => {
      this.InitMxDrawX();
    }, 300);
  }

  ngOnInit(): void {

  }

  InitMxDrawX(): void {
    try {
      // 获取DOM
      this.mxOcx = document.getElementById('ChromeMxDrawX');
      if (this.mxOcx) {
        console.log('mxOcx is :', this.mxOcx);
        const time = setInterval(() => {
          // 判断控件是否加载完成
          if (!this.mxOcx.IsIniting()) {
            clearInterval(time);
            clearTimeout(this.mxinittime);
            // 控件初始化完成，需要在启动做的事，在这里做
            this.mxOcx.ReDraw(); // 重绘控件
            this.mxInit(); // 启动后的事件
          }
        }, 100);
      }
    } catch (e) {
      console.log('刷新');
      location.reload();
    }
  }

  mxInit(): void {
    // 调用 mxOcx.DoCommand(1);
    this.mxOcx.ImplementCommandEventFun = DoCommandEventFunc;
    this.mxOcx.ImplementCustomEvent = DoCustomEventEventFun; // 自定义方法
    // 控件初始化完成，需要在启动做的事，在这里做
    // 启动时打开文件
    /**
     * OpenDwgFile  打开绝对路路径的本地文件地址如：D:\code\my-vue\src\assets\INPUT_BRILLIANZ RESIDENCES.dwg
     * OpenWebDwgFile 打开绝对路径的本地地址（需要转换十六进制）、打开线上地址如：http://mxtmpweb.mxdraw.f3322.net:3561/test.dwg
     * */
    // this.mxOcx.OpenDwgFile('D:\code\MxDraw\src\assets\INPUT_BRILLIANZ RESIDENCES.dwg');
    // this.mxOcx.OpenWebDwgFile('<443A5C636F64655C4D78447261775C7372635C6173736574735C494E5055545F4252494C4C49414E5A205245534944454E4345532E647767>');
    // this.mxOcx.OpenWebDwgFile('http://mxtmpweb.mxdraw.f3322.net:3561/test.dwg');
  }

  // 打开DWG文件
  openFile(): void {
    this.mxOcx.SendStringToExecute('OpenDwg');
  }

  // 获得所有图层名
  getAllLayer() {
    // 遍历所有图层
    const database = this.mxOcx.GetDatabase();
    // 得到所有图层名
    let sRet = null;
    //返回数据库中的层表对象
    const spLayerTable = database.GetLayerTable();
    //创建一个遍历层表中所有图层的遍历器
    const spIter = spLayerTable.NewIterator();
    //移动当前遍历器位置
    for (; !spIter.Done(); spIter.Step(true, true)) {
      //返回遍历器当前位置的记录
      var spLayerRec = spIter.GetRecord();
      //符号表记录名属性
      var sName = spLayerRec.Name;
      // 0零层不参加比较
      if (sName !== '0') {
        if (sRet == null) {
          sRet = sName;
        } else {
          sRet = sRet + ',' + sName;
        }
      }
    }
    console.log('图层名：', sRet);
  }

  // 获取所有图层ID
  getAllLayerId() {
    // 创建一个过滤数据连表对象。
    const filter = this.mxOcx.NewResbuf();
    // 把层名加入过滤条件，8是DXF组码，0表示是的是一个层名。
    filter.AddStringEx('0', 8);
    //定义选择集对象
    const ss = this.mxOcx.NewSelectionSet();
    // 选择图上的所有对象。
    ss.Select2(5, null, null, null, filter);
    let i = 0;
    const listId = [];
    // 遍历所有对象，得到对象id.
    for (; i < ss.Count; i++) {
      var e = ss.Item(i);
      listId.push(e.ObjectID);
    }
    console.log('图层ID：', listId);
  }

  // 获取所有实体
  getAllEntity(): void {
    // 得到当前图纸空间
    const blkRec = this.mxOcx.GetDatabase().CurrentSpace();
    // 创建一个用于遍历当前图纸空间的遍历器
    const iter = blkRec.NewIterator();
    if (iter == null) {
      return;
    }
    // 所有实体的id数组。
    const aryId = [];
    let pointNum = 0, iLineNum = 0, olyLineNum = 0, ellipseNum = 0, arcNum = 0, circleNum = 0, MtextNum = 0,
      textNum = 0,
      hatchNum = 0, imageNum = 0, entityNum = 0, blkRefNum = 0, frameNum = 0;
    // 循环得到所有实体
    for (; !iter.Done(); iter.Step(true, false)) {
      // 得到遍历器当前的实体
      const ent = iter.GetEntity();
      if (ent == null) {
        continue;
      }
      // 得到实体的id
      aryId.push(ent.ObjectID);
      if (ent.ObjectName === 'McDbPoint') {
        // 当前实体是一个点
        const point = ent;
        pointNum++;
      } else if (ent.ObjectName === 'McDbLine') {
        // 当前实体是一个直线
        const line = ent;
        // console.log('直线起点 x:', line.StartPoint.x, 'y:', line.StartPoint.y);
        // console.log('直线终点 x:', line.EndPoint.x, 'y:', line.EndPoint.y);
        // const idex = line.TrueColor.colorIndex;
        // const iRed = line.TrueColor.GetRed();
        // const iGreen = line.TrueColor.GetGreen();
        // const iBlue = line.TrueColor.GetBlue();
        // console.log(idex + ':' + ' iRed:' + iRed + ' iGreen:' + iGreen + ' iBlue:' + iBlue);
        iLineNum++;
      } else if (ent.ObjectName === 'McDbPolyline') {
        // 当前实体是一个多线段/曲线
        const polyLine = ent;
        // console.log('多线段/曲线', polyLine.colorIndex);
        olyLineNum++;
      } else if (ent.ObjectName === 'McDbEllipse') {
        // 当前实体是一个椭圆/椭圆弧
        const ellipse = ent;
        // console.log('椭圆/椭圆弧', ellipse);
        ellipseNum++;
      } else if (ent.ObjectName === 'McDbArc') {
        // 当前实体是一个圆弧
        const arc = ent;
        // console.log('圆弧', arc);
        arcNum++;
      } else if (ent.ObjectName === 'McDbCircle') {
        // 当前实体是一个圆
        const circle = ent;
        // console.log('圆', circle);
        circleNum++;
      } else if (ent.ObjectName === 'McDbMText') {
        // 当前实体是一个多行文本
        const Mtext = ent;
        // console.log('多行文本', text.Contents);
        MtextNum++;
      } else if (ent.ObjectName === 'McDbText') {
        // 当前实体是一个单行文本
        const text = ent;
        // console.log('单行文本', text.TextString);
        textNum++;
      } else if (ent.ObjectName === 'McDbHatch') {
        // 当前实体是一个图案
        const hatch = ent;
        // console.log('图案', hatch);
        hatchNum++;
      } else if (ent.ObjectName === 'McDbRasterImage') {
        // 当前实体是一个光栅图
        const image = ent;
        // console.log('光栅图', image);
        imageNum++;
      } else if (ent.ObjectName === 'McDbProxyEntity') {
        // 当前实体是一个自定义实体
        const entity = ent;
        // console.log('自定义实体', entity);
        entityNum++;
      } else if (ent.ObjectName === 'McDbBlockReference') {
        // 当前实体是一个块引用
        const blkRef = ent;
        // var blkRec1 = ent.BlockTableRecord;
        // var iter1 = blkRec1.NewIterator();
        // for (; !iter1.Done(); iter1.Step(true, false)) {
        //   var tmpEnt = iter1.GetEntity();
        //   if (tmpEnt.ObjectName == "McDbText") {
        //     // 修改文字内容
        //     var sTxt = tmpEnt.TextString;
        //     if (sTxt === 'TAKE') {
        //
        //       tmpEnt.TextString = sTxt.replace(sTxt, sTxt + "-1<被修改>"); //修改内容
        //       ent.AssertWriteEnabled();
        //     }
        //   }
        // }
        // console.log('colorIndex', blkRef.colorIndex);
        // console.log('TrueColor', blkRef.TrueColor);
        // console.log('TextStyle', blkRef.TextStyle);
        // console.log('blkRef.AttributeCount', blkRef.AttributeCount);
        for (let j = 0; j < blkRef.AttributeCount; j++) {
          // 得到块引用中所有的属性
          var attrib = blkRef.AttributeItem(j);
          console.log('n Tag: ' + attrib.Tag + 'Text:' + attrib.TextString);
        }
        blkRefNum++;
      } else if (ent.ObjectName === 'McDbOle2Frame') {
        // 当前实体是一个未知实体
        frameNum++;
      } else {
        console.log('ent.ObjectName', ent.ObjectName);
      }
    }
    console.log('一共' + aryId.length + '个实体,其中有' +
      pointNum + '个点,',
      iLineNum + '个直线,',
      olyLineNum + '个曲线',
      ellipseNum + '个椭圆',
      arcNum + '个圆弧',
      circleNum + '个圆',
      MtextNum + '个多行文本',
      textNum + '个单行文本',
      hatchNum + '个图案',
      imageNum + '个光栅图',
      entityNum + '个自定义实体',
      frameNum + '个未知实体',
      blkRefNum + '个块');
  }

  // 获取所有块名称
  database(): void {
    // 得到当前数据库。
    const database = this.mxOcx.GetDatabase();
    // 得到块表.
    const blkTab = database.GetBlockTable();
    const iter = blkTab.NewIterator();
    for (; !iter.Done(); iter.Step()) {
      const blkRec = iter.GetRecord();
      console.log(blkRec.Name);
    }
  }

  // 获取所有标注文本
  getAllDimText(): void {
    const ss = this.mxOcx.NewSelectionSet();
    // 选择图上所有对象.
    const filter = this.mxOcx.NewResbuf();
    ss.AllSelect(filter);
    const iCount = ss.Count;
    // 遍历所有对象
    for (let i = 0; i < iCount; i++) {
      // 遍历到一个对象。
      const ent = ss.Item(i);
      const objName = ent.ObjectName;
      if (objName == 'McDbRotatedDimension'
        || objName == 'McDbAlignedDimension'
        || objName == 'McDbDiametricDimension'
        || objName == 'McDbRadialDimension'
        || objName == 'McDbArcDimension'
      ) {
        // 得到标注对象文本.
        const dim = ent;
        let sTxt = dim.DimensionText;
        if (sTxt.Length == 0) {
          // 如果文本为空，表示，标注文字是自动生成的
          // 打碎标注对象，得到里面的文字对象.
          const ret = dim.GetProp('ExplodeEx');
          const retCount = ret.Count;
          for (let j = 0; j < retCount; j++) {
            const obj = ret.AtObject(j);
            if (obj == null) {
              continue;
            }
            if (obj.ObjectName == 'McDbMText') {
              // 该对象是个多行文本
              // 取到文字对象，得到文字符串.
              sTxt = obj.Contents;
              break;
            }
            if (obj.ObjectName == 'McDbText') {
              // 该对象是个单行文本
              sTxt = obj.TextString;
              break;
            }
          }
        }
        // 显示得到文字内容
        console.log('标注对象文本 is :', sTxt);
      }
    }
  }

  // 获取文本
  getAllText(): void {
    const ss = this.mxOcx.NewSelectionSet();
    // 选择图上所有对象.
    const filter = this.mxOcx.NewResbuf();
    ss.AllSelect(filter);
    const iCount = ss.Count;
    const txtItem = [];
    // 遍历所有对象
    for (let i = 0; i < iCount; i++) {
      // 遍历到一个对象。
      const ent = ss.Item(i);
      const objName = ent.ObjectName;
      if (objName === 'McDbMText') {
        txtItem.push(ent.Contents);
      } else if (objName === 'McDbText') {
        txtItem.push(ent.TextString);
      }
    }
    console.log('所有的文本 :', txtItem);
  }

  // 修改文字内容
  drawText(): void {
    //清空当前显示内容
    this.mxOcx.NewFile();
    //把颜色改回黑白色
    this.mxOcx.DrawColor = 0;
    //创建一个图层,名为"TextLayer"
    this.mxOcx.AddLayer('TextLayer');
    //设置当前图层为"TextLayer"
    this.mxOcx.LayerName = 'TextLayer';
    //绘制一个单行文字
    //参数一为文字的位置的X坐标 ；参数二为文字的位置的Y坐标 ；参数三为文字内容字符串
    //参数四为文字高度；参数五为文字的旋转角度
    //参数六为文字的水平对齐方式,0=kTextLeft,1=kTextCenter,2=kTextRight
    //参数七文字的竖直对齐方式,1=kTextBottom,2=kTextVertMid,3=kTextTop
    //-------------------------------------------------------------------------------------------------
    //写一个文字,0,1是左对齐.
    this.mxOcx.DrawColor = 65280;
    this.mxOcx.DrawText(0, 1900, `测试测试`, 100, 0, 0, 1);
    //---------------------------------------------------------------------------------------------------
    //写一个文字,2,1是右下对齐.
    this.mxOcx.DrawColor = 4556677;
    this.mxOcx.DrawText(3000, 2100, `现在时间：${new Date().toLocaleString()}`, 100, -20, 2, 1);
    //--------------------------------------------------------------------------------------------------
    //按指定样式绘制文字
    this.mxOcx.AddTextStyle1('MyTextStyle', 'italicc.shx', 'gbcbig.shx', 0.7);
    this.mxOcx.TextStyle = 'MyTextStyle';
    this.mxOcx.DrawColor = 255;
    this.mxOcx.DrawText(0, 3000, `现在时间：${new Date().toLocaleString()}`, 100, 0, 0, 1);
    this.mxOcx.ZoomAll();
    this.mxOcx.UpdateDisplay();
  }

  // 查找文字
  findText(): void {
    this.loading = true;
    // 需要查找的文字
    let ss = this.mxOcx.NewSelectionSet();
    let spFilte = this.mxOcx.NewResbuf();
    const txtItem = [];
    // 把文字对象，当着过滤条件.
    spFilte.AddStringEx('TEXT,MTEXT', 5020);
    // 得到图上，所有文字对象.
    ss.Select2(5, null, null, null, spFilte);
    // 遍历每个文字.
    let bFind = false;
    for (let i = 0; i < ss.Count; i++) {
      let ent = ss.Item(i);
      if (ent == null) {
        continue;
      }
      if (ent.ObjectName == 'McDbText') {
        const sTxt = ent.TextString;
        if (sTxt == this.searchTxt) {
          txtItem.push(ent);
          const GetRed = ent.TrueColor.GetRed();
          const GetBlue = ent.TrueColor.GetBlue();
          const GetGreen = ent.TrueColor.GetGreen();
          const GetColorName = ent.TrueColor.GetColorName();
          console.log(GetColorName + ':' + GetColorName + ' iRed:' + GetRed + ' iGreen:' + GetGreen + ' iBlue:' + GetBlue);
          // 把文字放到视区中间.
          this.mxOcx.PutEntityInView(ent.ObjectID, 300);
          const dLen = this.mxOcx.ViewLongToDocCoord(80);
          // 绘制一个标记圆.
          this.mxOcx.DrawVectorCircle(ent.Position.x,
            ent.Position.y,
            dLen, 65280);
          bFind = true;
        }
      } else if (ent.ObjectName == 'McDbMText') {
        const param = this.mxOcx.NewResbuf();
        param.AddObjectId(ent.ObjectID);
        const ret = this.mxOcx.CallEx('Mx_GetMTextContent', param);
        if (ret.AtString(0) == 'Ok') {

          if (ret.AtString(1) == this.searchTxt) {
            txtItem.push(ret);
            // ret.TrueColor.SetRGB(0, 0, 0);
            // 把文字放到视区.
            this.mxOcx.PutEntityInView(ent.ObjectID, 300);
            const dLen = this.mxOcx.ViewLongToDocCoord(80);
            // 绘制一个标记圆.
            this.mxOcx.DrawVectorCircle(ent.Location.x,
              ent.Location.y,
              dLen, 65280);
            bFind = true;
            break;
          }
        }
      }
      ent = null;
    }
    console.log('搜索到的文字实体', txtItem);
    if (!bFind) {
      this.loading = false;
      this.notification.create(
        'info',
        '提示',
        '没有找到文字对象'
      );
    }
    // 在这里必须显示释放控件的COM对象指针.
    ss = null;
    spFilte = null;
    this.loading = false;
    try {
      // @ts-ignore
      CollectGarbage();
    } catch (e) {

    }
  }

  // 隐藏工具栏
  hiddenToolBar(): void {
    this.mxOcx.ShowToolBar('常用工具', false);
    this.mxOcx.ShowToolBar('绘图工具', false);
    // this.mxOcx.ShowToolBar("编辑工具", false);
    // this.mxOcx.ShowToolBar("特性", false);
    this.mxOcx.ShowToolBar('ET工具', false);
  }

  // 隐藏图标
  hiddenIcon(): void {
    /**
     * 方法一
     * 使用CallEx自定义函数隐藏
     * */
    // const param = this.mxOcx.Call("Mx_NewResbuf", "");
    // 添加按钮类型
    // param.AddString("常用工具");
    // param.AddString("属性工具");
    // param.AddString("绘图工具");
    // 添加按钮功能
    // param.AddString("保存,保存为mxg文件,另存为dwg文件,新建");
    // this.mxOcx.CallEx("Mx_HideToolBarControl", param);
    /**
     * 方法二
     * 使用HideToolBarControl方法隐藏
     * */
    this.mxOcx.HideToolBarControl('绘图工具', '绘线,绘矩形框,写文字', true, true);
  }
}

// 命令执行函数。
function DoCommandEventFunc(iCmd) {
  if (iCmd === 1) {
    console.log('Test');
  } else if (iCmd === 2) {
    TestSaveWebFile();
  }
}

function DoCustomEventEventFun(sEventName) {
  if (sEventName === 'MxDrawXInitComplete') {
    // 控件加载完成.
  }
  if (sEventName === 'OpenFileComplete') {
    console.log('打开图纸完成');
  }
}

// 测试文件存到服务器.
// 模拟一个文件表单提交到服务器
function TestSaveWebFile() {
  var filename = encodeURI('中文test.dwg');
  this.mxOcx.SaveDwgToURLEx('http://127.0.0.1.', '/testuppfile?param=' + filename, 'file', 80, filename);
}
