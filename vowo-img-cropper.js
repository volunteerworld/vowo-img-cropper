import {PolymerElement} from '@polymer/polymer/polymer-element.js';
import {html} from '@polymer/polymer/lib/utils/html-tag.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/iron-icons/editor-icons.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icon/iron-icon.js';
import { addListener } from '@polymer/polymer/lib/utils/gestures.js';


/**
 * @polymer
 * @extends HTMLElement
 */
class VowoImgCropperElement extends PolymerElement
{
  static get template() {
    return html`
        <style>
            :host {
                display: block;
                margin: 5px;
            }

            paper-button {
                margin: 10px;
            }

            #cropperContainer {
                margin: auto;
                display: block;
            }

            .blue {
                background-color: #3399cc;
                color: white;
            }

            #cropperContainer img, #crop-canvas-preview {
                max-height: 350px;
                max-width: 100%;
                /*width: 300px;*/
                margin: auto 0;
                /*position: absolute;*/
                z-index: 1;
                /*width: 100%;*/
            }

            .icropper {
                position: relative;
            }

            .no-select {
                -webkit-touch-callout: none;
                -webkit-user-select: none;
                -khtml-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }

            /*#wicFileWrapper::slotted(.icropper) .crop-node {
                border: 1px dotted #999;
                position: absolute;
                z-index: 8;
                left: 10px;
                top: 10px;
                cursor: move;
            }*/

            .crop-node {
                border: 1px dotted #999;
                position: absolute;
                z-index: 8;
                left: 10px;
                top: 10px;
                cursor: move;
            }

            .icropper .anchor {
                width: 9px;
                height: 9px;
                border: 2px solid #ccc;
                border-radius: 50%;
                position: absolute;
                z-index: 11;
            }

            .icropper .anchor-lt {
                cursor: nw-resize;
                left: -8px;
                top: -8px;
            }

            .icropper .anchor-t {
                cursor: n-resize;
                top: -8px;
            }

            .icropper .anchor-rt {
                cursor: ne-resize;
                right: -4px;
                top: -8px;
            }

            .icropper .anchor-r {
                cursor: e-resize;
                right: -8px;
            }

            .icropper .anchor-rb {
                cursor: se-resize;
                right: -8px;
                bottom: -8px;
            }

            .icropper .anchor-b {
                cursor: s-resize;
                bottom: -8px;
            }

            .icropper .anchor-lb {
                cursor: sw-resize;
                left: -8px;
                bottom: -8px;
            }

            .icropper .anchor-l {
                cursor: w-resize;
                left: -8px;
            }

            .icropper .block {
                position: absolute;
                opacity: 0.5;
                z-index: 5;
                background-color: #000;

                /* IE 8 */
                -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=50)";
                /* IE 5-7 */
                filter: alpha(opacity=50);
            }

            .icropper.block-l {
                left: 0;
            }

            .icropper .block-t {
                top: 0;
                width: 100%;
            }

            .icropper .block-r {
                right: 0;
            }

            .icropper .block-b {
                bottom: 0;
                width: 100%;
            }

            .icropper img {
                /*position: absolute;*/
                z-index: 1;
                left: 0;
                top: 0;
            }

            #cropCanvasPreview, #cropimgpreview {
                display: block;
                margin: auto;
                max-width: 200px;
                max-height: 200px;
            }

            .icropper .roundedArea {
                background: transparent; /* For browsers that do not support gradients */
                background: -webkit-radial-gradient(rgba(255, 255, 255, 0) 70%, rgba(0, 0, 0, 0.5) 30%); /* Safari 5.1 to 6.0 */
                background: -o-radial-gradient(rgba(255, 255, 255, 0) 70%, rgba(0, 0, 0, 0.5) 30%); /* For Opera 11.6 to 12.0 */
                background: radial-gradient(rgba(255, 255, 255, 0) 70%, rgba(0, 0, 0, 0.5) 30%); /* Standard syntax (must be last) */
                background: -moz-radial-gradient(rgba(255, 255, 255, 0) 70%, rgba(0, 0, 0, 0.5) 30%);

            }

            .rounded-preview {
                border-radius: 50%;
            }

            .img-cropper-button-wrapper {
                text-align: center;
            }

            #wicFileWrapper::slotted(iron-icon-0) {
                width: 14px;
                height: 14px;
                margin-right: 3px;
            }

        </style>

        <div hidden\$="{{preview}}">
            <div hidden\$="{{!originImage}}">
                <div class="layout_ horizontal_">
                    <div class="flex_ cropperContainer" id="cropperContainer"></div>
                </div>
            </div>
        </div>

        <div hidden\$="{{preview}}">
            <div class="upload layout horizontal center-justified_ center img-cropper-button-wrapper">
                <paper-button raised="" class="blue center" on-tap="on_upload_dialog">
                    <iron-icon icon="editor:insert-photo" width="14" height="14"></iron-icon>
                    {{locale.chooseFile}}
                </paper-button>
                <paper-button id="vowoCropAccept" on-tap="onAccept" raised="" class="" disabled\$="{{!file}}">
                    <iron-icon icon="icons:done-all" width="14" height="14"></iron-icon>
                    {{locale.accept}}
                </paper-button>
            </div>
        </div>
        <div hidden\$="{{!preview}}">
            <div class="layout horizontal center-justified_">
                <div hidden\$="{{hideCroppedImage}}">
                    <img id="cropimgpreview" src="{{croppedImage}}">
                </div>
                <div hidden\$="{{!hideCroppedImage}}">
                    <canvas id="cropCanvasPreview"></canvas>
                </div>
            </div>
            <div class="layout horizontal center-justified_ center img-cropper-button-wrapper">
                <paper-button raised="" class="blue center" id="vowoCropEdit" on-tap="onEdit">
                    <iron-icon icon="icons:create" width="14" height="14"></iron-icon>
                    {{locale.edit}}
                </paper-button>
            </div>
        </div>
        <div id="wicFileWrapper">
            <slot></slot>
        </div>
`;
  }

  static get is()
  {
      return 'vowo-img-cropper';
  }

  static get properties()
  {
      return {
          image: {
              type: String,
              notify: true
          },
          croppedImage: {
              type: String,
              value: null
          },
          originImage: {
              type: String,
              value: null
          },
          file: {
              type: String,
              value: null
          },
          cropAttr: {
              type: String,
              value: null
          },
          preview: {
              type: Boolean,
              value: false
          },
          hideCroppedImage: {
              type: Boolean,
              value: false
          },
          ratio: {
              type: Number,
              value: 1
          },
          roundedArea: {
              type: Boolean,
              value: false
          },
          dragging: {
              type: Boolean,
              value: false
          },
          localeJson:{
              type:String
          },
          locale:{
              type:Object
          }
      }
  }

  ready()
  {
      super.ready();

      if (this.originImage && !this.croppedImage) {
          this.croppedImage = this.originImage;
      } else {
          if (this.croppedImage && !this.originImage) {
              this.originImage = this.croppedImage;
          }
      }
      if (this.originImage || this.croppedImage) {
          this.preview = true;
      }
      if (this.roundedArea) {
          this.addCss(this.$.cropimgpreview, 'rounded-preview');
      }
      this.locale = JSON.parse(this.localeJson);
      this.addListeners();
  }

  addListeners()
  {
      this.addEventListener('change', this.fileChange);
  }

  onChange()
  {
      var info = this.getInfo();
      var img = this.imageNode;
      var iw = img.width;
      var nw = img.naturalWidth;
      var s1 = nw / iw;
      var cropAttrArray = {'x': info.l * s1, 'y': info.t * s1, 'width': info.w * s1, 'height': info.h * s1};

      this.cropAttr = JSON.stringify(cropAttrArray);

      let attributeInputInLightDom = document.getElementById('attr-w');
      attributeInputInLightDom.value = this.cropAttr;
  }

  onEdit()
  {
      this.file = this.originImage;
      this.setImage(this.originImage);
      this.preview = false;
      this.hideCroppedImage = true;
  }

  onAccept()
  {
      var self = this;

      var info = this.getInfo();
      var canvas = this.$.cropCanvasPreview;

      var img = this.imageNode;
      var iw = img.width;
      var nw = img.naturalWidth;
      var s1 = nw / iw;

      var cropAttrArray = {'x': info.l * s1, 'y': info.t * s1, 'width': info.w * s1, 'height': info.h * s1};
      this.cropAttr = JSON.stringify(cropAttrArray);

      let attributeInputInLightDom = document.getElementById('attr-w');
      attributeInputInLightDom.value = this.cropAttr;

      canvas.width = info.w * s1;
      canvas.height = info.h * s1;

      var context = canvas.getContext('2d');

      try {
          context.drawImage(img, info.l * s1, info.t * s1, info.w * s1, info.h * s1, 0, 0, canvas.width, canvas.height);
          this.preview = true;
          var imgData = context.getImageData(0, 0, canvas.width, canvas.height);
          context.putImageData(imgData, 0, 0);
      } catch (err) {
      }

      this.preview = true;
      this.hideCroppedImage = true;
      this.file = null;

      if (this.roundedArea) {
          this.addCss(canvas, 'rounded-preview');
      }

  }

  connectedCallback()
  {
      super.connectedCallback();

      this.gap = 10;
      this.minWidth = 20;
      this.minHeight = 20;
      this.initialSize = 0;

      this.domNode = this.$.cropperContainer;
      this.domNode.classList.add('icropper');

      var self = this;
      setTimeout(function ()
      {
          self._init();
      }, 100);
  }

  on_upload_dialog()
  {
      var elem = this.$.fileInput;
      if (elem && document.createEvent) { // sanity check
          var evt = document.createEvent('MouseEvents');
          evt.initEvent('click', true, false);
          elem.dispatchEvent(evt, {bubbles: true, composed: true});
      }
  }

  fileChange(e)
  {
      this.domNode.removeAttribute('style');
      var file = e.target.files[0];
      this.file = file;
      this.setImageFile(file);
      this.preview = false;
  }

  _init()
  {
      this.$.fileInput = document.querySelector('#fileInput');
      this.$.fileInput.setAttribute("accept", "image/x-png, image/gif, image/jpeg");
      this.$.fileInput.setAttribute("hidden", "true");
      this.domNode.classList.add('icropper');
      this.buildRendering();
      this._updateUI();

      addListener(this.cropNode, 'down', (e, parent) => this._onDown(e, this));
      addListener(this.cropNode, 'track', (e, parent) => this._onTrack(e, this));
      addListener(this.cropNode, 'up', (e, parent) => this._onUp(e, this));
      this.connectNode(this.$.fileInput, 'change', this, 'fileChange');

      if (this.roundedArea) {
          this.addCss(this.cropNode, 'roundedArea');
      }
  }

  setImageFile(file)
  {
      var img = new Image();
      img.src = URL.createObjectURL(file);
      this.originImage = URL.createObjectURL(file);
      // this.image = url;
      var self = this;

      if (!this.imageNode) {
          var imgNode = this.createTag('img');
          this.imageNode = imgNode;
          this.domNode.appendChild(this.imageNode);

          this.imageNode.onload = function ()
          {
              self._setSize(this.offsetWidth, this.offsetHeight);
          };
      }

      this.imageNode.src = img.src;

  }

  setImage(url)
  {
      var img = new Image();
      img.src = url;
      this.image = url;
      if (!this.imageNode) {
          this.imageNode = this.createTag('img');
          this.domNode.appendChild(this.imageNode);
          var self = this;
          this.imageNode.onload = function ()
          {
              self._setSize(this.offsetWidth, this.offsetHeight);
          };
      }
      this.imageNode.src = url;
  }

  getInfo()
  {
      return {
          w: this.cropNode.offsetWidth - 2,
          h: this.cropNode.offsetHeight - 2,
          l: parseInt(this.nodeStyle(this.cropNode, 'left')),
          t: parseInt(this.nodeStyle(this.cropNode, 'top')),
          cw: this.domNode.offsetWidth, //container width
          ch: this.domNode.offsetHeight, //container height
      };
  }

  _updateUI()
  {
      this._posAnchors();
      this._posBlocks();
  }

  buildRendering()
  {

      this._anchors = {};
      this._blockNodes = {};

      this.cropNode = this.createTag('div', {className: 'crop-node no-select'});
      this.domNode.appendChild(this.cropNode);

      //Create anchors
      const cropNodes = ['lt', 't', 'rt', 'r', 'rb', 'b', 'lb', 'l'];

      //Create blocks for showing dark areas
      const blocksNodes = ['l', 't', 'r', 'b'];

      //Create anchors
      var i, n;
      for (i = 0; i < 8; i++) {
          n = this.createTag('div', {className: 'anchor anchor-' + cropNodes[i]});
          this.cropNode.appendChild(n);
          this._anchors[cropNodes[i]] = n;
      }

      //Create blocks for showing dark areas
      for (i = 0; i < 4; i++) {
          n = this.createTag('div', {className: 'block block-' + blocksNodes[i]});
          this.domNode.appendChild(n);
          this._blockNodes[blocksNodes[i]] = n;
      }
  }

  _posAnchors()
  {
      var a = this._anchors,
          w = this.cropNode.offsetWidth,
          h = this.cropNode.offsetHeight;
      w = w / 2 - 4 + 'px';
      h = h / 2 - 4 + 'px';
      a.t.style.left = a.b.style.left = w;
      a.l.style.top = a.r.style.top = h;

  }

  _posBlocks()
  {
      // var p = this.startedPos,
      var b = this._blockNodes;
      var l = parseInt(this.nodeStyle(this.cropNode, 'left'));
      var t = parseInt(this.nodeStyle(this.cropNode, 'top'));
      var w = this.cropNode.offsetWidth;
      var ww = this.domNode.offsetWidth;
      var h = this.cropNode.offsetHeight;
      var hh = this.domNode.offsetHeight;

      b = this._blockNodes;
      b.t.style.height = b.l.style.top = b.r.style.top = t + 'px';

      b.l.style.height = b.r.style.height = h + 'px';
      b.l.style.width = l + 'px';


      w = ww - w - l;
      h = hh - h - t;

      //fix IE
      if (w < 0) {
          w = 0;
      }
      if (h < 0) {
          h = 0;
      }

      b.r.style.width = w + 'px';
      b.b.style.height = h + 'px';
  }

  _setSize(w, h)
  {

      this.domNode.style.width = w + 'px';
      this.domNode.style.height = h + 'px';

      var w2, h2;
      if (this.initialSize) {
          var m = Math.min(w, h, this.initialSize);
          w2 = h2 = m - 2 + 'px';
      } else {
          w2 = w - this.gap * 2 - 2;
          h2 = h - this.gap * 2 - 2;
          if (this.ratio) {
              var _w2 = h2 * this.ratio, _h2 = w2 / this.ratio;
              if (w2 > _w2) {
                  w2 = _w2;
              }
              if (h2 > _h2) {
                  h2 = _h2;
              }

          }
          w2 += 'px';
          h2 += 'px';
      }

      var s = this.cropNode.style;
      s.width = w2;
      s.height = h2;

      var l = (w - this.cropNode.offsetWidth) / 2,
          t = (h - this.cropNode.offsetHeight) / 2;

      if (l < 0) {
          l = 0;
      }
      if (t < 0) {
          t = 0;
      }

      s.left = l + 'px';
      s.top = t + 'px';

      this._posAnchors();
      this._posBlocks();
      this.onChange(this.getInfo());

  }

  _onDown(e, parent)
  {
      var n = parent.cropNode;//, s = n.style;
      parent.dragging = (e.target === n) ? 'move' : e.target.className;
      if (parent.dragging !== 'move') {
          var arr = parent.dragging.split(' ');
          parent.dragging = arr.pop().split('-')[1];
      }

      parent.startedPos = {
          x: e.detail.x,
          y: e.detail.y,
          h: n.offsetHeight - 2, //2 is border width
          w: n.offsetWidth - 2,
          l: parseInt(this.nodeStyle(n, 'left')),
          t: parseInt(this.nodeStyle(n, 'top'))
      };
      var c = this.nodeStyle(e.target, 'cursor');
      this.nodeStyle(document.body, {
          cursor: c
      });
      this.nodeStyle(parent.cropNode, {
          cursor: c
      });
      this.addCss(document.body, 'no-select');
      this.addCss(document.body, 'unselectable');//for IE
      e.preventDefault();
  }

  _onUp(e, parent)
  {
      parent.dragging = false;
      this.nodeStyle(document.body, {
          cursor: 'default'
      });
      this.nodeStyle(parent.cropNode, {
          cursor: 'move'
      });
      this.rmCss(document.body, 'no-select');
      this.rmCss(document.body, 'unselectable');
  }

  _onTrack(e, parent)
  {
      if (!parent.dragging) {
          return;
      }
      if (parent.dragging === 'move') {
          parent._doTrack(e);
      }
      else {
          parent._doTrackResize(e);
      }
      parent._updateUI();
      // this.onChange && this.onChange(this.getInfo());
      parent.onChange(parent.getInfo());
      e.preventDefault();
  }

  _doTrack(e)
  {
      var s = this.cropNode.style,
          p0 = this.startedPos;
      var l = p0.l + e.detail.x - p0.x;
      var t = p0.t + e.detail.y - p0.y;
      if (l < 0) {
          l = 0;
      }
      if (t < 0) {
          t = 0;
      }
      var maxL = this.domNode.offsetWidth - this.cropNode.offsetWidth;
      var maxT = this.domNode.offsetHeight - this.cropNode.offsetHeight;
      if (l > maxL) {
          l = maxL;
      }
      if (t > maxT) {
          t = maxT;
      }
      s.left = l + 'px';
      s.top = t + 'px';

  }

  _doTrackResize(e)
  {
      var m = this.dragging,
          s = this.cropNode.style,
          // cw = this.cropNode.offsetWidth,
          // ch = this.cropNode.offsetHeight,
          p0 = this.startedPos;

      //delta x and delta y
      var dx = e.detail.x - p0.x,
          dy = e.detail.y - p0.y;

      var ratio = this.ratio;
      if (!ratio && e.shiftKey) {
          ratio = 1;
      }//Shiftkey is only available when there's no ratio set.

      if (ratio) {
          if (m === 'l') {
              dy = dx / ratio;
              if (p0.l + dx < 0) {
                  dx = -p0.l;
                  dy = dx / ratio;
              }
              if (p0.t + dy < 0) {
                  dy = -p0.t;
                  dx = dy * ratio;
              }
              m = 'lt';
          } else {
              if (m === 'r') {
                  dy = dx / ratio;
                  m = 'rb';
              } else {
                  if (m === 'b') {
                      dx = dy * ratio;
                      m = 'rb';
                  } else {
                      if (m === 'lt') {
                          dx = Math.abs(dx) > Math.abs(dy) ? dx : dy;
                          dy = dx / ratio;
                          if (p0.l + dx < 0) {
                              dx = -p0.l;
                              dy = dx / ratio;
                          }
                          if (p0.t + dy < 0) {
                              dy = -p0.t;
                              dx = dy * ratio;
                          }
                      } else {
                          if (m === 'lb') {
                              dx = Math.abs(dx) > Math.abs(dy) ? dx : -dy;
                              dy = -dx / ratio;
                              if (p0.l + dx < 0) {
                                  dx = -p0.l;
                                  dy = p0.l;
                              }
                          } else {
                              if (m === 'rt' || m === 't') {
                                  dx = -dy * ratio;
                                  m = 'rt';
                                  if (p0.t + dy < 0) {
                                      dy = -p0.t;
                                      dx = -dy;
                                  }
                              }
                          }
                      }
                  }
              }
          }
      }
      if (/l/.test(m)) {
          dx = Math.min(dx, p0.w - this.minWidth);
          if (p0.l + dx >= 0) {
              s.left = p0.l + dx + 'px';
              s.width = p0.w - dx + 'px';
          } else {
              s.left = 0;
              s.width = p0.l + p0.w + 'px';
          }
      }
      if (/t/.test(m)) {
          dy = Math.min(dy, p0.h - this.minHeight);
          if (p0.t + dy >= 0) {
              s.top = p0.t + dy + 'px';
              s.height = p0.h - dy + 'px';
          } else {
              s.top = 0;
              s.height = p0.t + p0.h + 'px';
          }
      }
      if (/r/.test(m)) {
          dx = Math.max(dx, this.minWidth - p0.w);
          if (p0.l + p0.w + dx <= this.domNode.offsetWidth) {
              s.width = p0.w + dx + 'px';
          } else {
              s.width = this.domNode.offsetWidth - p0.l - 2 + 'px';
          }
      }
      if (/b/.test(m)) {
          dy = Math.max(dy, this.minHeight - p0.h);
          if (p0.t + p0.h + dy <= this.domNode.offsetHeight) {
              s.height = p0.h + dy + 'px';
          } else {
              s.height = this.domNode.offsetHeight - p0.t - 2 + 'px';
          }
      }

      if (ratio) {
          var w = parseInt(s.width), h = parseInt(s.height);
          var w2 = h * ratio, h2 = w / ratio;
          if (w2 < w) {
              if (/l/.test(m)) {
                  s.left = parseInt(s.left) + w - w2 + 'px';
              }
              w = w2;
          }
          if (h2 < h) {
              if (/t/.test(m)) {
                  s.top = parseInt(s.top) + h - h2 + 'px';
              }
              h = h2;
          }
          s.width = w + 'px';
          s.height = h + 'px';
      }
  }

  mixin(dest, src)
  {
      for (var p in src) {
          dest[p] = src[p];
      }
  }
  byId(id)
  {
      if (typeof id === 'string') {
          return document.getElementById(id);
      }
      else {
          return id;
      }
  }
  createTag(tag, attrs)
  {
      var node = document.createElement(tag);
      this.mixin(node, attrs);
      return node;
  }
  connectNode(node, evtType, context, callback)
  {
      function handler(evt)
      {
          context[callback](evt);
      }

      if (node.attachEvent) {
          node.attachEvent('on' + evtType, handler);
      }
      else {
          node.addEventListener(evtType, handler, false);
      }
  }
  nodeStyle(node, args)
  {
      if (typeof args === 'string') {
          var value = node.style[args];
          if (!value) {
              var s = window.getComputedStyle ? getComputedStyle(node) : node.currentStyle;
              value = s[args];
          }
          return value;
      } else {
          this.mixin(node.style, args);
      }
  }
  eachArr(arr, callback)
  {
      for (var i = 0; i < arr.length; i++) {
          callback(arr[i], i);
      }
  }
  indexOfArr(arr, value)
  {
      for (var i = 0; i < arr.length; i++) {
          if (value === arr[i]) {
              return i;
          }
      }
      return -1;
  }
  addCss(node, css)
  {
      if (!node) {
          return;
      }
      var cn = node.className || '', arr = cn.split(' '), i = this.indexOfArr(arr, css);
      if (i < 0) {
          arr.push(css);
      }
      node.className = arr.join(' ');
  }
  rmCss(node, css)
  {
      if (!node) {
          return;
      }
      var cn = node.className || '', arr = cn.split(' '), i = this.indexOfArr(arr, css);
      if (i >= 0) {
          arr.splice(i, 1);
      }
      node.className = arr.join(' ');
  }
}

window.customElements.define(VowoImgCropperElement.is, VowoImgCropperElement);
