/**
* This file is part of Qunee for HTML5.
* Copyright (c) 2016 by qunee.com
**/
if(!window.getI18NString){getI18NString = function(s){return s;}}
;(function (Q, $) {
    // if(!window.getI18NString){
    //     window.getI18NString = function (s){return s}
    // }

    var template = '<div class="graph-export-panel modal fade">\
  <div class="modal-dialog">\
  <div class="modal-content">\
  <div class="modal-body">\
  <h3 style="text-align: center;">' + getI18NString('Image export preview') + '</h3>\
  <div>\
  <label>' + getI18NString('Canvas Size') + '</label>\
  <span class ="graph-export-panel__canvas_size"></span>\
  </div>\
  <div style="text-align: center;" title="' + getI18NString('Double click  to select the whole canvas range') + '">\
  <div class ="graph-export-panel__export_canvas" style="position: relative; display: inline-block;">\
  </div>\
  </div>\
  <div>\
  <label>' + getI18NString('Export Range') + '</label>\
  <span class ="graph-export-panel__export_bounds"></span>\
  </div>\
  <div>\
  <label>' + getI18NString('Scale') + ': <input class ="graph-export-panel__export_scale" type="range" value="1" step="0.2" min="0.2" max="3"><span class ="graph-export-panel__export_scale_label">1</span></label>\
  </div>\
  <div>\
  <label>' + getI18NString('Output Size') + ': </label><span class ="graph-export-panel__export_size"></span>\
  </div>\
  <div style="text-align: right">\
  <button type="submit" class="btn btn-primary graph-export-panel__export_submit">' + getI18NString('Export') + '</button>\
  <button type="submit" class="btn btn-primary graph-export-panel__print_submit">' + getI18NString('Print') + '</button>\
  </div>\
  </div>\
  </div>\
  </div>\
  </div>';

///ExportPanel
    function ResizeBox(parent, onBoundsChange) {
        this.onBoundsChange = onBoundsChange;
        this.parent = parent;
        this.handleSize = Q.isTouchSupport ? 20 : 8;

        this.boundsDiv = this._createDiv(this.parent);
        this.boundsDiv.type = "border";
        this.boundsDiv.style.position = "absolute";
        this.boundsDiv.style.border = "dashed 1px #888";
        var handles = "lt,t,rt,l,r,lb,b,rb";
        handles = handles.split(",");
        for (var i = 0, l = handles.length; i < l; i++) {
            var name = handles[i];
            var handle = this._createDiv(this.parent);
            handle.type = "handle";
            handle.name = name;
            handle.style.position = "absolute";
            handle.style.backgroundColor = "#FFF";
            handle.style.border = "solid 1px #555";
            handle.style.width = handle.style.height = this.handleSize + "px";
            var cursor;
            if (name == 'lt' || name == 'rb') {
                cursor = "nwse-resize";
            } else if (name == 'rt' || name == 'lb') {
                cursor = "nesw-resize";
            } else if (name == 't' || name == 'b') {
                cursor = "ns-resize";
            } else {
                cursor = "ew-resize";
            }
            handle.style.cursor = cursor;
            this[handles[i]] = handle;
        }
        this.interaction = new Q.DragSupport(this.parent, this);
    }

    ResizeBox.prototype = {
        destroy: function () {
            this.interaction.destroy();
        },
        update: function (width, height) {
            this.wholeBounds = new Q.Rect(0, 0, width, height);
            this._setBounds(this.wholeBounds.clone());
        },
        ondblclick: function (evt) {
            if (this._bounds.equals(this.wholeBounds)) {
                if (!this.oldBounds) {
                    this.oldBounds = this.wholeBounds.clone().grow(-this.wholeBounds.height / 5, -this.wholeBounds.width / 5);
                }
                this._setBounds(this.oldBounds, true);
                return;
            }
            this._setBounds(this.wholeBounds.clone(), true);
        },
        startdrag: function (evt) {
            if (evt.target.type) {
                this.dragItem = evt.target;
            }
        },
        ondrag: function (evt) {
            if (!this.dragItem) {
                return;
            }
            Q.stopEvent(evt);
            var dx = evt.dx;
            var dy = evt.dy;
            if (this.dragItem.type == "border") {
                this._bounds.offset(dx, dy);
                this._setBounds(this._bounds, true);
            } else if (this.dragItem.type == "handle") {
                var name = this.dragItem.name;
                if (name[0] == 'l') {
                    this._bounds.x += dx;
                    this._bounds.width -= dx;
                } else if (name[0] == 'r') {
                    this._bounds.width += dx;
                }
                if (name[name.length - 1] == 't') {
                    this._bounds.y += dy;
                    this._bounds.height -= dy;
                } else if (name[name.length - 1] == 'b') {
                    this._bounds.height += dy;
                }
                this._setBounds(this._bounds, true);
            }

        },
        enddrag: function (evt) {
            if (!this.dragItem) {
                return;
            }
            this.dragItem = false;
            if (this._bounds.width < 0) {
                this._bounds.x += this._bounds.width;
                this._bounds.width = -this._bounds.width;
            } else if (this._bounds.width == 0) {
                this._bounds.width = 1;
            }
            if (this._bounds.height < 0) {
                this._bounds.y += this._bounds.height;
                this._bounds.height = -this._bounds.height;
            } else if (this._bounds.height == 0) {
                this._bounds.height = 1;
            }
            if (this._bounds.width > this.wholeBounds.width) {
                this._bounds.width = this.wholeBounds.width;
            }
            if (this._bounds.height > this.wholeBounds.height) {
                this._bounds.height = this.wholeBounds.height;
            }
            if (this._bounds.x < 0) {
                this._bounds.x = 0;
            }
            if (this._bounds.y < 0) {
                this._bounds.y = 0;
            }
            if (this._bounds.right > this.wholeBounds.width) {
                this._bounds.x -= this._bounds.right - this.wholeBounds.width;
            }
            if (this._bounds.bottom > this.wholeBounds.height) {
                this._bounds.y -= this._bounds.bottom - this.wholeBounds.height;
            }

            this._setBounds(this._bounds, true);
        },
        _createDiv: function (parent) {
            var div = document.createElement("div");
            parent.appendChild(div);
            return div;
        },
        _setHandleLocation: function (handle, x, y) {
            handle.style.left = (x - this.handleSize / 2) + "px";
            handle.style.top = (y - this.handleSize / 2) + "px";
        },
        _setBounds: function (bounds) {
            if (!bounds.equals(this.wholeBounds)) {
                this.oldBounds = bounds;
            }
            this._bounds = bounds;
            bounds = bounds.clone();
            bounds.width += 1;
            bounds.height += 1;
            this.boundsDiv.style.left = bounds.x + "px";
            this.boundsDiv.style.top = bounds.y + "px";
            this.boundsDiv.style.width = bounds.width + "px";
            this.boundsDiv.style.height = bounds.height + "px";

            this._setHandleLocation(this.lt, bounds.x, bounds.y);
            this._setHandleLocation(this.t, bounds.cx, bounds.y);
            this._setHandleLocation(this.rt, bounds.right, bounds.y);
            this._setHandleLocation(this.l, bounds.x, bounds.cy);
            this._setHandleLocation(this.r, bounds.right, bounds.cy);
            this._setHandleLocation(this.lb, bounds.x, bounds.bottom);
            this._setHandleLocation(this.b, bounds.cx, bounds.bottom);
            this._setHandleLocation(this.rb, bounds.right, bounds.bottom);
            if (this.onBoundsChange) {
                this.onBoundsChange(this._bounds);
            }
        }
    }
    Object.defineProperties(ResizeBox.prototype, {
        bounds: {
            get: function () {
                return this._bounds;
            },
            set: function (v) {
                this._setBounds(v);
            }
        }
    });

    function ExportPanel() {
        var export_panel = $('<div/>').html(template).contents();
        this.html = export_panel = export_panel[0];
        document.body.appendChild(this.html);
        export_panel.addEventListener("mousedown", function (evt) {
            if (evt.target == export_panel) {
                this.destroy();
            }
        }.bind(this), false);
        var export_scale = this._getChild(".graph-export-panel__export_scale");
        var export_scale_label = this._getChild(".graph-export-panel__export_scale_label");
        export_scale.onchange = function (evt) {
            export_scale_label.textContent = this.scale = export_scale.value;
            this.updateOutputSize();
        }.bind(this);
        this.export_scale = export_scale;

        function exportGraph(printOrFile){
            var info = this.getExportInfo();
            exportImage(this.graph, info.clipBounds, info.scale, printOrFile);
        }
        function exportImage(graph, bounds, scale, printOrFile) {
            scale = parseFloat(scale || 1);
            var width = Math.ceil(bounds.width * scale);
            var height = Math.ceil(bounds.height * scale);

            var name = graph.name || 'graph';

            function showImage(imageInfo, print, name) {
                var win = window.open();
                var doc = win.document;
                doc.title = name || "export image";
                doc.body.style.textAlign = "center";
                doc.body.style.margin = "0px";

                if (print === true) {
                    var style = doc.createElement("style");
                    style.setAttribute("type", "text/css");
                    style.setAttribute("media", "print");
                    var printCSS = "img {max-width: 100%; max-height: 100%;}";
                    if (imageInfo.width / imageInfo.height > 1.2) {
                        printCSS += "\n @page { size: landscape; }";
                    } else {
                        printCSS += "\n @page { size: portrait; }";
                    }
                    style.appendChild(doc.createTextNode(printCSS));
                    doc.head.appendChild(style);
                }

                var img = doc.createElement("img");
                var imageStyles = {
                    'max-width': '100%',
                    'max-height': '100%',
                    'position': 'absolute',
                    'margin': 'auto',
                    'top': 0,
                    'left': 0,
                    'right': 0,
                    'bottom': 0
                }
                for (var name in imageStyles) {
                    img.style[name] = imageStyles[name];
                }

                if (print === true) {
                    img.onload = function () {
                        win.print();
                        win.close();
                    }
                }
                img.src = imageInfo.data;
                doc.body.appendChild(img);
            }

            var saveable = printOrFile == 'file' && window.saveAs;

            var maxLength = 32767, maxSize = 16384 * 16384;

            function isImageTooBig(width, height) {
                return (Q.isFirefox || Q.isChrome) && width >= maxLength || height >= maxLength || width * height >= maxSize;
            }

            if (!isImageTooBig(width, height)) {
                var imageInfo = graph.exportImage(scale, bounds);
                if (saveable) {
                    imageInfo.canvas.toBlob(function (blob) {
                        saveAs(blob, name + ".png");
                    }, "image/png");
                    return;
                }
                showImage(imageInfo, printOrFile == 'print', name)
                return;
            }

            //图片太大，超过<canvas>支持尺寸
            var hCount = Math.ceil((width + 1) / maxLength);
            var vCount = Math.ceil((height + 1) / maxLength);
            var minCells = Math.ceil((width * height + 1) / maxSize);
            if (minCells > hCount * vCount) {
                if (width > height) {
                    hCount = Math.ceil(minCells / vCount);
                } else {
                    vCount = Math.ceil(minCells / hCount);
                }
            }
            var cellWidth = Math.ceil(width / hCount), cellHeight = Math.ceil(height / vCount);

            function toImage(x, y) {
                var perWidth = cellWidth / scale, perHeight = cellHeight / scale;
                return graph.exportImage(scale, new Q.Rect(bounds.x + x * perWidth, bounds.y + y * perHeight, perWidth, perHeight))
            }

            var svg = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"' +
                ' width="' + width + '" height="' + height + '">';
            var x = 0;
            while (x < hCount) {
                var y = 0;
                while (y < vCount) {
                    var imageInfo = toImage(x, y);
                    svg += '<image x="' + x * cellWidth + '" y = "' + y * cellHeight + '" width="' + imageInfo.width + '" height="' + imageInfo.height + '" '
                        + 'xlink:href="' + imageInfo.data + '" />';
                    y++;
                }
                x++;
            }
            svg += '</svg>';

            function saveSVG(svg, name) {
                svg = '<?xml version="1.0" encoding="UTF-8"?>\n' + svg;
                var blob = new Blob([svg], {type: "image/svg+xml"});
                saveAs(blob, name + ".svg");
            }

            if (saveable) {
                saveSVG(svg, name);
                return;
            }

            var imageInfo = {
                width: width,
                height: height,
                data: 'data:image/svg+xml, ' + svg,
            }
            showImage(imageInfo, printOrFile == 'print', name)
        }

        var export_submit = this._getChild(".graph-export-panel__export_submit");
        if (window.saveAs && HTMLCanvasElement.prototype.toBlob) {
            export_submit.onclick = exportGraph.bind(this, 'file');
        } else {
            export_submit.onclick = exportGraph.bind(this);
        }
        var print_submit = this._getChild(".graph-export-panel__print_submit");
        print_submit.onclick = exportGraph.bind(this, 'print');
    }

    ExportPanel.prototype = {
        canvas: null,
        html: null,
        getExportInfo: function(){
            var scale = this.export_scale.value;
            var s = this.imageInfo.scale;
            var clipBounds = new Q.Rect(this.clipBounds.x / s, this.clipBounds.y / s, this.clipBounds.width / s, this.clipBounds.height / s);
            clipBounds.offset(this.bounds.x, this.bounds.y);
            return {
                scale: scale,
                clipBounds: clipBounds
            }
        },
        _getChild: function (selector) {
            return $(this.html).find(selector)[0];
        },
        initCanvas: function () {
            var export_canvas = this._getChild('.graph-export-panel__export_canvas');
            export_canvas.innerHTML = "";

            var canvas = Q.createCanvas(true);
            export_canvas.appendChild(canvas);
            this.canvas = canvas;

            var export_bounds = this._getChild(".graph-export-panel__export_bounds");
            var export_size = this._getChild(".graph-export-panel__export_size");
            var clipBounds;
            var drawPreview = function () {
                var canvas = this.canvas;
                var g = canvas.g;
                var ratio = canvas.ratio || 1;
                g.save();
                //g.scale(1/g.ratio, 1/g.ratio);
                g.clearRect(0, 0, canvas.width, canvas.height);
                g.drawImage(this.imageInfo.canvas, 0, 0);
                g.beginPath();
                g.moveTo(0, 0);
                g.lineTo(canvas.width, 0);
                g.lineTo(canvas.width, canvas.height);
                g.lineTo(0, canvas.height);
                g.lineTo(0, 0);

                var x = clipBounds.x * ratio, y = clipBounds.y * ratio, width = clipBounds.width * ratio,
                    height = clipBounds.height * ratio;
                g.moveTo(x, y);
                g.lineTo(x, y + height);
                g.lineTo(x + width, y + height);
                g.lineTo(x + width, y);
                g.closePath();
                g.fillStyle = "rgba(0, 0, 0, 0.3)";
                g.fill();
                g.restore();
            }
            var onBoundsChange = function (bounds) {
                clipBounds = bounds;
                this.clipBounds = clipBounds;
                drawPreview.call(this);
                var w = clipBounds.width / this.imageInfo.scale | 0;
                var h = clipBounds.height / this.imageInfo.scale | 0;
                export_bounds.textContent = (clipBounds.x / this.imageInfo.scale | 0) + ", "
                    + (clipBounds.y / this.imageInfo.scale | 0) + ", " + w + ", " + h;
                this.updateOutputSize();
            }
            this.updateOutputSize = function () {
                var export_scale = this._getChild(".graph-export-panel__export_scale");
                var scale = export_scale.value;
                var w = clipBounds.width / this.imageInfo.scale * scale | 0;
                var h = clipBounds.height / this.imageInfo.scale * scale | 0;
                var info = w + " X " + h;
                if (w * h > 3000 * 4000) {
                    info += "<span style='color: #F66;'>" + getI18NString('Image size is too large, the export may appear memory error') + "</span>";
                }
                export_size.innerHTML = info;
            }
            var resizeHandler = new ResizeBox(canvas.parentNode, onBoundsChange.bind(this));
            this.update = function () {
                var ratio = this.canvas.ratio || 1;
                var width = this.imageInfo.width / ratio;
                var height = this.imageInfo.height / ratio;
                this.canvas.setSize(width, height);
                resizeHandler.update(width, height);
            }
        },
        destroy: function () {
            this.graph = null;
            this.imageInfo = null
            this.clipBounds = null;
            this.bounds = null;
        },
        show: function (graph) {
            $(this.html).modal("show");

            this.graph = graph;
            var bounds = graph.bounds;
            this.bounds = bounds;

            var canvas_size = this._getChild(".graph-export-panel__canvas_size");
            canvas_size.textContent = (bounds.width | 0) + " X " + (bounds.height | 0);

            var size = Math.min(500, screen.width / 1.3);
            var imageScale;
            if (bounds.width > bounds.height) {
                imageScale = Math.min(1, size / bounds.width);
            } else {
                imageScale = Math.min(1, size / bounds.height);
            }
            if (!this.canvas) {
                this.initCanvas();
            }
            this.imageInfo = graph.exportImage(imageScale * this.canvas.ratio);
            this.imageInfo.scale = imageScale;

            this.update();
        }
    }
    var exportPanel;

    function showExportPanel(graph) {
        if (!exportPanel) {
            exportPanel = new ExportPanel();
        }
        exportPanel.show(graph);
    }

    Q.showExportPanel = showExportPanel;
})(Q, $);
