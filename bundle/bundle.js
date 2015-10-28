/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "bundle/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	__webpack_require__(12);
	__webpack_require__(13);
	__webpack_require__(14);
	__webpack_require__(15);
	__webpack_require__(16);
	__webpack_require__(17);
	__webpack_require__(18);

/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */
/***/ function(module, exports) {

	"use strict";

	var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	window.PAINT = window.PAINT || {};
	(function () {
	  PAINT.changeTool = function (name, back) {
	    $("#tools .active").removeClass("active");
	    $("[name=" + name + "]").addClass("active");
	    var _t = ['saveAs', 'save', 'new', 'open', 'upload', 'download'];
	    if (PAINT.current_tool && _t.indexOf(this.current_tool.name) == -1) {
	      PAINT.last_tool = this.current_tool.name;
	    }
	    PAINT.current_tool = PAINT.TOOLS[name];
	    if (PAINT.current_action && name != "zoom" && !back) {
	      PAINT.current_action.destroy();
	    }
	    PAINT.current_tool.select();
	    riot.update("tool");
	  };
	  function hexToRgb(hex) {
	    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	    return result ? {
	      r: parseInt(result[1], 16),
	      g: parseInt(result[2], 16),
	      b: parseInt(result[3], 16)
	    } : null;
	  }
	  function rgbToHex(o) {
	    return toHex(o.r) + toHex(o.g) + toHex(o.b);
	  }
	  function toHex(n) {
	    n = parseInt(n, 10);
	    if (isNaN(n)) return "00";
	    n = Math.max(0, Math.min(n, 255));
	    return "0123456789ABCDEF".charAt((n - n % 16) / 16) + "0123456789ABCDEF".charAt(n % 16);
	  }
	  function getPixelColor(x, y) {
	    var data = PAINT.current_image.context.getImageData(x, y, 1, 1).data;
	    return {
	      r: data[0],
	      g: data[1],
	      b: data[2],
	      a: data[3]
	    };
	  }

	  var Tool = (function () {
	    function Tool(options) {
	      _classCallCheck(this, Tool);

	      for (var key in options) {
	        this[key] = options[key];
	      }
	    }

	    _createClass(Tool, [{
	      key: "move",
	      value: function move(e) {
	        var _PAINT$getMouseXY = PAINT.getMouseXY(e);

	        var _PAINT$getMouseXY2 = _slicedToArray(_PAINT$getMouseXY, 2);

	        var x = _PAINT$getMouseXY2[0];
	        var y = _PAINT$getMouseXY2[1];

	        PAINT.debug.status['mouse1'] = x + "x" + y;
	        if (!this.action || !this.mouse_down) {
	          return;
	        }
	        var _ref = [x, y];
	        this.action.x2 = _ref[0];
	        this.action.y2 = _ref[1];

	        this.action.w = this.action.x2 - this.action.x1;
	        this.action.h = this.action.y2 - this.action.y1;
	        if (this.bounding) {
	          PAINT.debug.status['mouse3'] = "w:" + this.action.w + " h:" + this.action.h;
	        }
	        return true; // some tools need this to stop propagation
	      }
	    }, {
	      key: "up",
	      value: function up(e) {
	        window.MOUSE_DOWN = this.mouse_down = false;
	      }
	    }, {
	      key: "over",
	      value: function over(e) {
	        this.mouse_down = window.MOUSE_DOWN;
	      }
	    }, {
	      key: "down",
	      value: function down(e) {
	        window.MOUSE_DOWN = this.mouse_down = true;
	        this.action = new PAINT.Action(e);

	        var _PAINT$getMouseXY3 = PAINT.getMouseXY(e);

	        var _PAINT$getMouseXY32 = _slicedToArray(_PAINT$getMouseXY3, 2);

	        this.action.x1 = _PAINT$getMouseXY32[0];
	        this.action.y1 = _PAINT$getMouseXY32[1];

	        PAINT.debug.status['mouse2'] = "click:" + this.action.x1 + "x" + this.action.y1;
	      }
	    }, {
	      key: "select",
	      value: function select() {
	        PAINT.debug.status['mouse3'] = PAINT.debug.status['mouse2'] = '';
	      }
	    }, {
	      key: "out",
	      value: function out(e) {}
	    }, {
	      key: "options",
	      value: function options(e) {
	        return [];
	      }
	    }, {
	      key: "redraw",
	      value: function redraw() {}
	    }]);

	    return Tool;
	  })();

	  var DialogTool = (function (_Tool) {
	    _inherits(DialogTool, _Tool);

	    function DialogTool() {
	      _classCallCheck(this, DialogTool);

	      _get(Object.getPrototypeOf(DialogTool.prototype), "constructor", this).apply(this, arguments);
	    }

	    _createClass(DialogTool, [{
	      key: "select",
	      value: function select() {
	        _get(Object.getPrototypeOf(DialogTool.prototype), "select", this).call(this);
	        var element = document.createElement(this.tagName);
	        document.body.appendChild(element);
	        riot.mount(element, this.getWindowData());
	      }
	    }, {
	      key: "accept",
	      value: function accept(tag) {
	        tag.unmount();
	      }
	    }]);

	    return DialogTool;
	  })(Tool);

	  var New = (function (_DialogTool) {
	    _inherits(New, _DialogTool);

	    function New() {
	      _classCallCheck(this, New);

	      _get(Object.getPrototypeOf(New.prototype), "constructor", this).call(this, { name: 'new', title: 'New Image', icon: 'file-o' });
	    }

	    _createClass(New, [{
	      key: "getWindowData",
	      value: function getWindowData() {
	        return {
	          title: "Create New Image",
	          form: [{ name: 'width', title: 'Width', value: PAINT.current_image.WIDTH, type: 'number' }, { name: 'height', title: 'Height', value: PAINT.current_image.HEIGHT, type: 'number' }]
	        };
	      }
	    }, {
	      key: "accept",
	      value: function accept(tag) {
	        var w = parseInt($("#id_width").val()),
	            h = parseInt($("#id_height").val());
	        new PAINT.Image({ w: w, h: h });
	        PAINT.addMessage("A new " + w + "x" + h + " image has been created.");
	        tag.unmount();
	      }
	    }]);

	    return New;
	  })(DialogTool);

	  var Open = (function (_DialogTool2) {
	    _inherits(Open, _DialogTool2);

	    function Open() {
	      _classCallCheck(this, Open);

	      _get(Object.getPrototypeOf(Open.prototype), "constructor", this).call(this, { name: 'open', title: 'Open Image', icon: 'folder-open-o' });
	    }

	    _createClass(Open, [{
	      key: "click",
	      value: function click(e, tag) {
	        new PAINT.Image(e.item);
	        PAINT.addMessage(e.item.name + " loaded");
	        tag.unmount();
	      }
	    }, {
	      key: "getWindowData",
	      value: function getWindowData() {
	        function getItems() {
	          var names = [];
	          var items = [];
	          for (var n in PAINT.gallery) {
	            names.push(n);
	          }
	          names.sort();
	          for (var i = 0; i < names.length; i++) {
	            if (names[i] == "__autosave") {
	              continue;
	            }
	            items.push(PAINT.gallery[names[i]]);
	          }
	          return items;
	        }
	        return {
	          title: "Open Image",
	          getItems: getItems,
	          hide_okay: true
	        };
	      }
	    }]);

	    return Open;
	  })(DialogTool);

	  var Upload = (function (_Tool2) {
	    _inherits(Upload, _Tool2);

	    function Upload() {
	      _classCallCheck(this, Upload);

	      _get(Object.getPrototypeOf(Upload.prototype), "constructor", this).call(this, { name: 'upload', title: 'Upload Image', icon: 'upload' });
	      this.input = document.createElement('input');
	      this.input.type = 'file';
	      var that = this;
	      this.input.addEventListener('change', function () {
	        var fr = new FileReader();
	        var file = that.input.files[0];
	        if (!that.input.value) {
	          return;
	        }
	        var fname = that.input.value.replace("/", "\\").split("\\").pop();
	        fr.onload = function () {
	          //#! TODO: this should be added to the library (saved) and a bulk uploader is needed.
	          new PAINT.Image({ dataURL: fr.result, name: fname });
	          PAINT.addMessage("Image \"" + fname + "\" uploaded successfully.");
	          PAINT.storage.autoSave(fr.result);
	          that.input.value = '';
	        };
	        fr.readAsDataURL(file);
	      });
	    }

	    _createClass(Upload, [{
	      key: "select",
	      value: function select() {
	        this.input.click();
	      }
	    }]);

	    return Upload;
	  })(Tool);

	  var Download = (function (_DialogTool3) {
	    _inherits(Download, _DialogTool3);

	    function Download() {
	      _classCallCheck(this, Download);

	      _get(Object.getPrototypeOf(Download.prototype), "constructor", this).call(this, { name: 'download', title: 'Download Image', icon: 'download' });
	      this.tagName = "download-image";
	    }

	    _createClass(Download, [{
	      key: "getWindowData",
	      value: function getWindowData() {
	        return {
	          title: "Download Image",
	          src: PAINT.current_image.canvas.toDataURL(),
	          hide_cancel: true
	        };
	      }
	    }]);

	    return Download;
	  })(DialogTool);

	  var Save = (function (_Tool3) {
	    _inherits(Save, _Tool3);

	    function Save() {
	      _classCallCheck(this, Save);

	      _get(Object.getPrototypeOf(Save.prototype), "constructor", this).call(this, { name: 'save', title: 'Save Image', icon: 'floppy-o' });
	    }

	    _createClass(Save, [{
	      key: "select",
	      value: function select() {
	        _get(Object.getPrototypeOf(Save.prototype), "select", this).call(this);
	        if (PAINT.current_image.name) {
	          PAINT.storage.saveImage(PAINT.current_image.name);
	          _get(Object.getPrototypeOf(Save.prototype), "accept", this).call(this, tag);
	        } else {
	          $("[name=saveAs]").click();
	        }
	      }
	    }]);

	    return Save;
	  })(Tool);

	  var SaveAs = (function (_DialogTool4) {
	    _inherits(SaveAs, _DialogTool4);

	    function SaveAs() {
	      _classCallCheck(this, SaveAs);

	      _get(Object.getPrototypeOf(SaveAs.prototype), "constructor", this).call(this, { name: 'saveAs', title: 'Save Image As', icon: 'floppy-o', className: 'save-as-new' });
	    }

	    _createClass(SaveAs, [{
	      key: "getWindowData",
	      value: function getWindowData() {
	        return {
	          title: "Save Image As",
	          form: [{ name: 'filename', title: 'Enter A Name', value: "", placeholder: 'Enter a name', type: 'text' }]
	        };
	      }
	    }, {
	      key: "accept",
	      value: function accept(tag) {
	        PAINT.storage.saveImage($("#id_filename").val());
	        _get(Object.getPrototypeOf(SaveAs.prototype), "accept", this).call(this, tag);
	      }
	    }]);

	    return SaveAs;
	  })(DialogTool);

	  var BrushTool = (function (_Tool4) {
	    _inherits(BrushTool, _Tool4);

	    function BrushTool() {
	      _classCallCheck(this, BrushTool);

	      _get(Object.getPrototypeOf(BrushTool.prototype), "constructor", this).call(this, { name: 'brush', title: 'Paint Brush', icon: 'paint-brush' });
	    }

	    _createClass(BrushTool, [{
	      key: "options",
	      value: function options() {}
	    }, {
	      key: "down",
	      value: function down(e) {
	        _get(Object.getPrototypeOf(BrushTool.prototype), "down", this).call(this, e);
	        this.drawn_until = 0;
	        this.action.coords = [];
	        this.action.size = 1; //#!TODO eventually use size selector
	        this.last = false;
	        this.move(e);
	      }
	    }, {
	      key: "out",
	      value: function out(e) {
	        this.move(e);
	      }
	    }, {
	      key: "over",
	      value: function over(e) {
	        _get(Object.getPrototypeOf(BrushTool.prototype), "over", this).call(this, e);
	        this.move(e);
	      }
	    }, {
	      key: "move",
	      value: function move(e) {
	        if (!_get(Object.getPrototypeOf(BrushTool.prototype), "move", this).call(this, e)) {
	          return;
	        }
	        var context = this.action.context;

	        var _PAINT$getMouseXY4 = PAINT.getMouseXY(e);

	        var _PAINT$getMouseXY42 = _slicedToArray(_PAINT$getMouseXY4, 2);

	        var x = _PAINT$getMouseXY42[0];
	        var y = _PAINT$getMouseXY42[1];

	        if (this.last) {
	          var dx = x - this.last_x;
	          var dy = y - this.last_y;
	          var distance = Math.sqrt(dx * dx + dy * dy);
	          for (var i = 0; i < distance; i++) {
	            this.action.coords.push([this.last_x + i * dx / distance, this.last_y + i * dy / distance]);
	          }
	        }
	        this.action.coords.push([x, y]);
	        var _ref2 = [x, y, true];
	        this.last_x = _ref2[0];
	        this.last_y = _ref2[1];
	        this.last = _ref2[2];

	        var image_data = context.createImageData(this.action.size, this.action.size);
	        var rgb = hexToRgb(this.action.color);
	        for (var i = 0; i < image_data.data.length / 4; i++) {
	          image_data.data[i * 4 + 0] = rgb.r;
	          image_data.data[i * 4 + 1] = rgb.g;
	          image_data.data[i * 4 + 2] = rgb.b;
	          image_data.data[i * 4 + 3] = 255; //#!TODO eventually use alpha selector
	        }
	        for (var i = this.drawn_until; i < this.action.coords.length; i++) {
	          window._id = image_data;
	          context.putImageData(image_data, Math.round(this.action.coords[i][0] - this.action.size / 2), Math.round(this.action.coords[i][1] - this.action.size / 2));
	          this.drawn_until = i;
	        }
	        PAINT.current_image.redraw();
	      }
	    }, {
	      key: "up",
	      value: function up(e) {
	        _get(Object.getPrototypeOf(BrushTool.prototype), "up", this).call(this, e);
	        PAINT.storage.autoSave();
	      }
	    }]);

	    return BrushTool;
	  })(Tool);

	  var ShapeTool = (function (_Tool5) {
	    _inherits(ShapeTool, _Tool5);

	    function ShapeTool(o) {
	      _classCallCheck(this, ShapeTool);

	      _get(Object.getPrototypeOf(ShapeTool.prototype), "constructor", this).call(this, o);
	      this.thickness = 0;
	    }

	    _createClass(ShapeTool, [{
	      key: "options",
	      value: function options(e) {
	        return [{ is_number: true, name: "thickness", min: 0, step: 1, value: this.thickness, label: "Border" }];
	      }
	    }, {
	      key: "down",
	      value: function down(e) {
	        this.thickness = $("#id_thickness").val();
	        _get(Object.getPrototypeOf(ShapeTool.prototype), "down", this).call(this, e);
	      }
	    }, {
	      key: "up",
	      value: function up(e) {
	        _get(Object.getPrototypeOf(ShapeTool.prototype), "up", this).call(this, e);
	        PAINT.storage.autoSave();
	      }
	    }, {
	      key: "move",
	      value: function move(e) {
	        if (!_get(Object.getPrototypeOf(ShapeTool.prototype), "move", this).call(this, e)) {
	          return;
	        }
	        var image = PAINT.current_image;
	        var context = this.action.context;
	        context.clearRect(0, 0, image.WIDTH, image.HEIGHT);
	        context.beginPath();
	        context.fillStyle = this.action.color;
	        this.drawShape(context, this.action.x1, this.action.y1, this.action.w, this.action.h);
	        context.fill();
	        context.closePath();
	        var t = parseInt(this.thickness);
	        if (t != 0 && Math.abs(this.action.w) > 2 * t && Math.abs(this.action.h) > 2 * t) {
	          context.beginPath();
	          context.fillStyle = this.action.color2;
	          var w = this.action.w + 2 * t * (this.action.w > 0 ? -1 : 1);
	          var h = this.action.h + 2 * t * (this.action.h > 0 ? -1 : 1);
	          var x = this.action.x1 + t * (this.action.w < 0 ? -1 : 1);
	          var y = this.action.y1 + t * (this.action.h < 0 ? -1 : 1);
	          this.drawShape(context, x, y, w, h);
	          context.fill();
	          context.closePath();
	        }
	        PAINT.current_image.redraw();
	      }
	    }]);

	    return ShapeTool;
	  })(Tool);

	  var RectTool = (function (_ShapeTool) {
	    _inherits(RectTool, _ShapeTool);

	    function RectTool() {
	      _classCallCheck(this, RectTool);

	      _get(Object.getPrototypeOf(RectTool.prototype), "constructor", this).call(this, { name: 'rect', title: 'Rectangle', className: 'rect-button' });
	      this.bounding = true;
	    }

	    _createClass(RectTool, [{
	      key: "drawShape",
	      value: function drawShape(ctx, x, y, w, h) {
	        ctx.rect(x, y, w, h);
	      }
	    }]);

	    return RectTool;
	  })(ShapeTool);

	  var CircleTool = (function (_ShapeTool2) {
	    _inherits(CircleTool, _ShapeTool2);

	    function CircleTool() {
	      _classCallCheck(this, CircleTool);

	      _get(Object.getPrototypeOf(CircleTool.prototype), "constructor", this).call(this, { name: 'circle', title: 'Ellipse', className: 'circle-button' });
	      this.bounding = true;
	    }

	    _createClass(CircleTool, [{
	      key: "drawShape",
	      value: function drawShape(ctx, x, y, w, h) {
	        function clog() {
	          console.log(Array.prototype.slice.call(arguments).join(","));
	        }
	        // from http://stackoverflow.com/questions/2172798/how-to-draw-an-oval-in-html5-canvas
	        var kappa = .5522848,
	            ox = Math.round(w / 2 * kappa),
	            // control point offset horizontal
	        oy = Math.round(h / 2 * kappa),
	            // control point offset vertical
	        xe = x + w,
	            // x-end
	        ye = y + h,
	            // y-end
	        xm = Math.round(x + w / 2),
	            // x-middle
	        ym = Math.round(y + h / 2); // y-middle
	        clog(x, y, w, h, ox, oy, xe, ye, xm, ym);
	        ctx.beginPath();
	        ctx.moveTo(x, ym);
	        ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
	        ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
	        ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
	        ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
	        //ctx.closePath(); // not used correctly, see comments (use to close off open path)
	        ctx.fill();
	      }
	    }]);

	    return CircleTool;
	  })(ShapeTool);

	  var FillTool = (function (_Tool6) {
	    _inherits(FillTool, _Tool6);

	    function FillTool() {
	      _classCallCheck(this, FillTool);

	      _get(Object.getPrototypeOf(FillTool.prototype), "constructor", this).call(this, { name: 'fill', title: 'Fill (replace color)', className: 'fill-button' });
	      PAINT.color_distance = 0;
	    }

	    _createClass(FillTool, [{
	      key: "options",
	      value: function options(e) {
	        return [{ is_number: true, value: PAINT.color_distance, min: 0, max: 50, step: 1, label: "Distance", name: "color_distance" }];
	      }
	    }, {
	      key: "down",
	      value: function down(e) {
	        _get(Object.getPrototypeOf(FillTool.prototype), "down", this).call(this, e);
	        var WIDTH = PAINT.current_image.WIDTH,
	            HEIGHT = PAINT.current_image.HEIGHT;
	        PAINT.color_distance = $("#id_color_distance").val();
	        var x = this.action.x1;
	        var y = this.action.y1;

	        var pixel_stack = [[x, y]];
	        var fill_color = hexToRgb(this.action.color);
	        var color_layer = PAINT.current_image.context.getImageData(0, 0, WIDTH, HEIGHT);
	        var cld = color_layer.data;
	        var final_layer = PAINT.current_image.context.getImageData(0, 0, WIDTH, HEIGHT);
	        var fld = final_layer.data;
	        var i = fld.length;
	        while (i--) {
	          fld[i] = 0;
	        }
	        var _c = hexToRgb(this.action.color);
	        var fill_color = [_c.r, _c.g, _c.b, 255]; //#! TODO how to handle alpha
	        var pixel_position = 4 * (y * WIDTH + x);
	        function getColor(data, p) {
	          return [data[p], data[p + 1], data[p + 2], data[p + 3]];
	        }
	        var target_color = getColor(cld, pixel_position);
	        function sameColor(c1, c2) {
	          return c1[0] == c2[0] && c1[1] == c2[1] && c1[2] == c2[2] && c1[3] == c2[3];
	        }
	        function diffColor(c1, c2) {
	          return c1[0] != c2[0] || c1[1] != c2[1] || c1[2] != c2[2] || c1[3] != c2[3];
	        }
	        var ds2 = Math.pow(PAINT.color_distance / 100 * 256, 2); // color threshold distance (squared)
	        function matchColorDistance(c1, c2) {
	          // ds1: magintude difference between two target color and pixel color (squared)
	          var ds1 = Math.pow(c2[0] - c1[0], 2) + Math.pow(c2[1] - c1[1], 2) + Math.pow(c2[2] - c1[2], 2) + Math.pow(c2[3] - c1[3], 2);
	          return !isNaN(ds1) && ds1 <= ds2;
	        }
	        if (ds2 == 0) {
	          // if we're not measuring color distance, diffColor is ~5% faster
	          matchColorDistance = function (c1, c2) {
	            return !diffColor(c1, c2);
	          };
	        }
	        while (pixel_stack.length) {
	          var _pixel_stack$pop = pixel_stack.pop();

	          var _pixel_stack$pop2 = _slicedToArray(_pixel_stack$pop, 2);

	          x = _pixel_stack$pop2[0];
	          y = _pixel_stack$pop2[1];

	          pixel_position = 4 * (y * WIDTH + x);
	          var node_color = getColor(cld, pixel_position);
	          if (!matchColorDistance(node_color, target_color)) {
	            continue;
	          }
	          // this next line only matters if fill_color and target_color are within the matchColorDistance
	          if (sameColor(node_color, fill_color)) {
	            return;
	          }
	          cld[pixel_position] = fill_color[0];
	          cld[pixel_position + 1] = fill_color[1];
	          cld[pixel_position + 2] = fill_color[2];
	          cld[pixel_position + 3] = fill_color[3];
	          fld[pixel_position] = fill_color[0];
	          fld[pixel_position + 1] = fill_color[1];
	          fld[pixel_position + 2] = fill_color[2];
	          fld[pixel_position + 3] = fill_color[3];

	          if (x != 0) {
	            pixel_stack.push([x - 1, y]);
	          }
	          if (x != WIDTH) {
	            pixel_stack.push([x + 1, y]);
	          }
	          if (y != 0) {
	            pixel_stack.push([x, y - 1]);
	          }
	          if (y != HEIGHT) {
	            pixel_stack.push([x, y + 1]);
	          }
	        }
	        this.action.context.clearRect(0, 0, WIDTH, HEIGHT);
	        this.action.context.putImageData(final_layer, 0, 0);
	        PAINT.current_image.redraw();
	      }
	    }, {
	      key: "down2",
	      value: function down2(e) {
	        // first attempt at alorightm. Left here for later reference
	        _get(Object.getPrototypeOf(FillTool.prototype), "down", this).call(this, e);
	        var WIDTH = PAINT.current_image.WIDTH,
	            HEIGHT = PAINT.current_image.HEIGHT;
	        var current_pixel, pixel_position, reach_left, reach_right;
	        var color_layer = PAINT.current_image.context.getImageData(0, 0, WIDTH, HEIGHT);
	        var cld = color_layer.data;
	        var final_layer = PAINT.current_image.context.getImageData(0, 0, WIDTH, HEIGHT);
	        var fld = final_layer.data;
	        var i = fld.length;
	        while (i--) {
	          fld[i] = 0;
	        }
	        var x = this.action.x1;
	        var y = this.action.y1;

	        var pixel_stack = [[x, y]];
	        var fill_color = hexToRgb(this.action.color);
	        var alphas = [];
	        PAINT.color_distance = $("#id_color_distance").val();
	        var ds2 = Math.pow(PAINT.color_distance / 100 * 256, 2); // color threshold distance (squared)
	        pixel_position = 4 * (y * WIDTH + x);
	        var start_color = {
	          r: cld[pixel_position + 0],
	          g: cld[pixel_position + 1],
	          b: cld[pixel_position + 2],
	          a: cld[pixel_position + 3]
	        };

	        function matchStartColor(pixel_position) {
	          var r = cld[pixel_position];
	          var g = cld[pixel_position + 1];
	          var b = cld[pixel_position + 2];
	          var a = cld[pixel_position + 3];

	          return a == start_color.a && r == start_color.r && g == start_color.g && b == start_color.b;
	        }
	        function matchColorDistance(pixel_position) {
	          var a = cld[pixel_position + 3];
	          if (isNaN(a)) {
	            return false;
	          }
	          var r = cld[pixel_position];
	          var g = cld[pixel_position + 1];
	          var b = cld[pixel_position + 2];
	          var c1 = start_color;

	          // ds1: magintude difference between two target color and pixel color (squared)
	          var ds1 = Math.pow(a - c1.a, 2) + Math.pow(r - c1.r, 2) + Math.pow(g - c1.g, 2) + Math.pow(b - c1.b, 2);
	          return !isNaN(ds1) && ds1 <= ds2;
	        }
	        function colorPixel(pixel_position) {
	          cld[pixel_position] = fill_color.r;
	          cld[pixel_position + 1] = fill_color.g;
	          cld[pixel_position + 2] = fill_color.b;
	          cld[pixel_position + 3] = 'a'; // this is so there's no way we can hit the same pixel twice
	          fld[pixel_position] = fill_color.r;
	          fld[pixel_position + 1] = fill_color.g;
	          fld[pixel_position + 2] = fill_color.b;
	          fld[pixel_position + 3] = 'a'; // this is so there's no way we can hit the same pixel twice
	          alphas.push(pixel_position + 3); // this is so we can correct the above later
	        }
	        while (pixel_stack.length) {
	          current_pixel = pixel_stack.pop();
	          x = current_pixel[0], y = current_pixel[1];
	          pixel_position = 4 * (y * WIDTH + x);
	          while (y-- >= 0 && matchColorDistance(pixel_position)) {
	            pixel_position -= 4 * WIDTH;
	          }
	          pixel_position += 4 * WIDTH;
	          y++;
	          reach_left = false;
	          reach_right = false;
	          while (y++ < HEIGHT - 1 && matchColorDistance(pixel_position)) {
	            colorPixel(pixel_position);

	            if (x > 0) {
	              if (matchColorDistance(pixel_position - 4)) {
	                if (!reach_left) {
	                  pixel_stack.push([x - 1, y]);
	                  reach_left = true;
	                }
	              } else if (reach_left) {
	                reach_left = false;
	              }
	            }

	            if (x < WIDTH - 1) {
	              if (matchColorDistance(pixel_position + 4)) {
	                if (!reach_right) {
	                  pixel_stack.push([x + 1, y]);
	                  reach_right = true;
	                }
	              } else if (reach_right) {
	                reach_right = false;
	              }
	            }

	            pixel_position += WIDTH * 4;
	          }
	        }
	        for (var i = 0; i < alphas.length; i++) {
	          fld[alphas[i]] = 255; //#! TODO make this alpha
	        }
	        this.action.context.clearRect(0, 0, WIDTH, HEIGHT);
	        this.action.context.putImageData(final_layer, 0, 0);
	        PAINT.current_image.redraw();
	      }
	    }, {
	      key: "up",
	      value: function up(e) {
	        _get(Object.getPrototypeOf(FillTool.prototype), "up", this).call(this, e);
	        PAINT.storage.autoSave();
	      }
	    }]);

	    return FillTool;
	  })(Tool);

	  var SelectTool = (function (_Tool7) {
	    _inherits(SelectTool, _Tool7);

	    function SelectTool() {
	      _classCallCheck(this, SelectTool);

	      // this tool needs a canvas to store the selected image fragment
	      _get(Object.getPrototypeOf(SelectTool.prototype), "constructor", this).call(this, { name: 'select', title: 'Select', className: 'select-button' });
	      this.canvas = document.createElement("canvas");
	      this.context = this.canvas.getContext("2d");
	      this.bounding = true;
	      document.addEventListener("cut", this.cut.bind(this));
	    }

	    _createClass(SelectTool, [{
	      key: "selectAll",
	      value: function selectAll() {
	        this.down({ button: 0 });
	        this.up(); //release mouse
	        this.action.left = this.action.top = 0;
	        this.action.w = PAINT.current_image.WIDTH;
	        this.action.h = PAINT.current_image.HEIGHT;
	        this.redraw();
	      }
	    }, {
	      key: "select",
	      value: function select() {
	        this.div = $(".canvas-wrapper .select")[0];
	      }
	    }, {
	      key: "down",
	      value: function down(e) {
	        // reset the selection div
	        _get(Object.getPrototypeOf(SelectTool.prototype), "down", this).call(this, e);
	        this.div.style.backgroundImage = "";
	        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	        this.move(e);
	        this.drawn = false;
	      }
	    }, {
	      key: "move",
	      value: function move(e) {
	        // this sizes the selection window, but hasn't actually selected anything
	        // action.top/left : top left corner of select relative to image canvas
	        // this action.x1/y1 mouse down when drawing select
	        // this.action.x2/y2 mouse up when drawing select
	        if (!_get(Object.getPrototypeOf(SelectTool.prototype), "move", this).call(this, e)) {
	          return;
	        }
	        this.action.left = this.action.w > 0 ? this.action.x1 : this.action.x2;
	        this.action.top = this.action.h > 0 ? this.action.y1 : this.action.y2;
	        this.redraw();
	        return true; // stops selectMove from executing
	      }
	    }, {
	      key: "redraw",
	      value: function redraw() {
	        // calculate the position and size of the select, this funciton is global for scroll/zoom
	        var i = PAINT.current_image;
	        if (!this.action) {
	          return;
	        }
	        this.div.style.display = "block";
	        this.div.style.width = Math.abs(PAINT.zoom * this.action.w) + "px";
	        this.div.style.height = Math.abs(PAINT.zoom * this.action.h) + "px";
	        this.div.style.top = PAINT.zoom * this.action.top - i.scrollY + "px";
	        this.div.style.left = PAINT.zoom * this.action.left - i.scrollX + "px";
	      }
	    }, {
	      key: "selectDraw",
	      value: function selectDraw() {
	        // only once per selection
	        if (this.drawn) {
	          return;
	        }
	        this.drawn = true;

	        //save the selected piece of canvas and use it as background for this.div
	        var i = PAINT.current_image;
	        var _ref3 = [this.action.w, this.action.h];
	        this.canvas.width = _ref3[0];
	        this.canvas.height = _ref3[1];

	        this.context.drawImage(i.canvas, this.action.left, this.action.top, this.action.w, this.action.h, 0, 0, this.action.w, this.action.h);
	        this.dataURL = this.canvas.toDataURL();
	        this.div.style.backgroundImage = "url(" + this.dataURL + ")";
	        var _ref4 = [this.action.top, this.action.left];
	        this.action.top0 = _ref4[0];
	        this.action.left0 = _ref4[1];
	      }
	    }, {
	      key: "selectCut",
	      value: function selectCut() {
	        //fill in the background color where the select window was
	        var context = this.action.context;
	        var image = PAINT.current_image;
	        context.clearRect(0, 0, image.WIDTH, image.HEIGHT);
	        context.fillStyle = this.action.color2;
	        context.beginPath();
	        context.rect(this.action.left0, this.action.top0, Math.abs(this.action.w), Math.abs(this.action.h));
	        context.fill();
	        context.closePath();
	        //this.autocrop();
	      }
	    }, {
	      key: "autocrop",
	      value: function autocrop() {
	        var context = this.action.context;
	        var data = context.createImageData(this.action.w, this.action.h).data;
	        // there's no such thing as data.slice :(
	        console.log(data);
	        var tl = data.slice(0, 4);
	        var tr = data.slice(this.action.w * 4, this.action.w * 4 + 4);
	        var bl = data.slice(data.length - this.action.w * 4, data.length - this.action.w * 4 + 4);
	        var br = data.slice(data.length - 4);
	        if (tl == tr) {
	          console.log('top');
	        }
	        if (tl == bl) {
	          console.log('left');
	        }
	        if (tr == br) {
	          console.log('right');
	        }
	        if (bl == br) {
	          console.log('bottom');
	        }
	      }
	    }, {
	      key: "selectDown",
	      value: function selectDown(e) {
	        this.select_down = true;

	        var _PAINT$getMouseXY5 = PAINT.getMouseXY(e);

	        var _PAINT$getMouseXY52 = _slicedToArray(_PAINT$getMouseXY5, 2);

	        this.action.x_start = _PAINT$getMouseXY52[0];
	        this.action.y_start = _PAINT$getMouseXY52[1];

	        this.selectDraw();
	        this.selectCut();
	        PAINT.current_image.redraw();
	      }
	    }, {
	      key: "selectMove",
	      value: function selectMove(e) {
	        // find the difference between the moves relative to the div position. create a temporary position
	        // this.action.x_start/y_start mouse click to start moving select re:this.div
	        // this.action.x_end/y_end mouse click where mouse currently is re:this.div
	        // this.action.top2/left2  current, temporary position of div re:image.canvas
	        if (this.move(e)) {
	          return;
	        }
	        if (!this.select_down) {
	          return;
	        }
	        var i = PAINT.current_image;

	        var _PAINT$getMouseXY6 = PAINT.getMouseXY(e);

	        var _PAINT$getMouseXY62 = _slicedToArray(_PAINT$getMouseXY6, 2);

	        this.action.x_end = _PAINT$getMouseXY62[0];
	        this.action.y_end = _PAINT$getMouseXY62[1];

	        this.action.top2 = this.action.top - (this.action.y_start - this.action.y_end);
	        this.action.left2 = this.action.left - (this.action.x_start - this.action.x_end);
	        this.div.style.top = PAINT.zoom * this.action.top2 - i.scrollY + "px";
	        this.div.style.left = PAINT.zoom * this.action.left2 - i.scrollX + "px";
	      }
	    }, {
	      key: "selectUp",
	      value: function selectUp(e) {
	        // mouse released, set the div position to the temporary position
	        this.up(e);
	        this.selectMove(e);
	        if (this.select_down) {
	          var _ref5 = [this.action.left2, this.action.top2];
	          this.action.left = _ref5[0];
	          this.action.top = _ref5[1];
	        }
	        this.select_down = false;
	        this.selectCut();
	        this.action.context.drawImage(this.canvas, this.action.left, this.action.top);
	        PAINT.current_image.redraw();
	        PAINT.storage.autoSave();
	      }
	    }, {
	      key: "cut",
	      value: function cut(e) {
	        console.log("cut");
	      }
	    }, {
	      key: "copy",
	      value: function copy(e) {}
	    }, {
	      key: "paste",
	      value: function paste(e) {}
	    }, {
	      key: "options",
	      value: function options(e) {
	        return [{ name: 'cut', icon: 'cut', click: this.cut, is_button: true }, { name: 'copy', icon: 'copy', click: this.copy, is_button: true }, { name: 'paste', icon: 'paste', click: this.paste, is_button: true }];
	      }
	    }]);

	    return SelectTool;
	  })(Tool);

	  var ResizeTool = (function (_Tool8) {
	    _inherits(ResizeTool, _Tool8);

	    function ResizeTool() {
	      _classCallCheck(this, ResizeTool);

	      _get(Object.getPrototypeOf(ResizeTool.prototype), "constructor", this).call(this, { name: 'resize', title: 'Resize', icon: 'arrows' });
	    }

	    return ResizeTool;
	  })(Tool);

	  var EyeDropperTool = (function (_Tool9) {
	    _inherits(EyeDropperTool, _Tool9);

	    //#! TODO: with mouse depressed as you move it should select different colors until you release

	    function EyeDropperTool() {
	      _classCallCheck(this, EyeDropperTool);

	      _get(Object.getPrototypeOf(EyeDropperTool.prototype), "constructor", this).call(this, { name: 'eyeDropper', title: 'Select Color', icon: 'eyedropper' });
	    }

	    _createClass(EyeDropperTool, [{
	      key: "move",
	      value: function move(e) {
	        _get(Object.getPrototypeOf(EyeDropperTool.prototype), "move", this).call(this, e);

	        var _PAINT$getMouseXY7 = PAINT.getMouseXY(e);

	        var _PAINT$getMouseXY72 = _slicedToArray(_PAINT$getMouseXY7, 2);

	        var x = _PAINT$getMouseXY72[0];
	        var y = _PAINT$getMouseXY72[1];

	        PAINT.debug.status['mouse2'] = this.hex_color = "#" + rgbToHex(getPixelColor(x, y));
	      }
	    }, {
	      key: "down",
	      value: function down(e) {
	        _get(Object.getPrototypeOf(EyeDropperTool.prototype), "down", this).call(this, e);
	        var which = e.button == 0 ? "fg" : "bg";
	        var input = document.querySelector("[name=" + which + "]");
	        input.value = this.hex_color;
	        PAINT.changeTool(PAINT.last_tool, true);
	        delete PAINT.current_image.actions.pop();
	        PAINT.addMessage("Changing " + which + " color to " + this.hex_color);
	      }
	    }]);

	    return EyeDropperTool;
	  })(Tool);

	  var ZoomTool = (function (_Tool10) {
	    _inherits(ZoomTool, _Tool10);

	    function ZoomTool() {
	      _classCallCheck(this, ZoomTool);

	      _get(Object.getPrototypeOf(ZoomTool.prototype), "constructor", this).call(this, { name: 'zoom', title: 'Change Zoom', icon: 'search-plus' });
	      this.zooms = [1, 2, 3, 4, 5];
	    }

	    _createClass(ZoomTool, [{
	      key: "select",
	      value: function select(e) {
	        var i = this.zooms.indexOf(PAINT.zoom) + 1;
	        if (i == this.zooms.length) {
	          i = 0;
	        }
	        PAINT.changeTool(PAINT.last_tool, true);
	        PAINT.updateZoom(this.zooms[i]);
	      }
	    }]);

	    return ZoomTool;
	  })(Tool);

	  PAINT.TOOL_LIST = [
	  //new Open(),
	  //new Save(),
	  //new SaveAs(),
	  new Upload(), new Download(), new New(), {}, new BrushTool(), new FillTool(), new SelectTool(), new RectTool(), new CircleTool(), new ResizeTool(), new EyeDropperTool(), new ZoomTool(), {}, {}];
	  PAINT.TOOLS = {};
	  for (var i = 0; i < PAINT.TOOL_LIST.length; i++) {
	    var t = PAINT.TOOL_LIST[i];
	    if (!t) {
	      continue;
	    }
	    PAINT.TOOLS[t.name] = t;
	  }
	  window.addEventListener('mouseup', function () {
	    window.MOUSE_DOWN = false;
	  });
	})();

/***/ },
/* 13 */
/***/ function(module, exports) {

	"use strict";

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	window.PAINT = window.PAINT || {};

	(function () {
	  var Image = (function () {
	    function Image(options) {
	      _classCallCheck(this, Image);

	      if (PAINT.current_image) {
	        PAINT.current_image.tag.unmount();
	      }
	      PAINT.current_image = this;
	      this.dataURL = options.dataURL;
	      this.actions = [];
	      // if this is loaded from a json, stash the actions so they can be loaded
	      this._actions = options.actions || [];
	      this.WIDTH = options.w;
	      this.HEIGHT = options.h;
	      this._redraw_proxy = this._redraw.bind(this);
	      $("body").append("<paint></paint>");
	      riot.mount("paint");
	    }

	    _createClass(Image, [{
	      key: "init",
	      value: function init(tag) {
	        // called after riot renders templates
	        this.tag = tag;
	        this.canvas = PAINT.canvas = document.createElement("canvas");
	        this.context = this.canvas.getContext('2d');
	        this.canvas.width = this.WIDTH;
	        this.canvas.height = this.HEIGHT;
	        PAINT.display_canvas = tag.display;
	        //PAINT.updateZoom(); // update display canvas
	        for (var i = 0; i < this._actions.length; i++) {
	          this.actions.push(new PAINT.Action(this._actions[i]));
	        }
	        PAINT.changeTool('brush');
	        if (!this.dataURL) {
	          // new image
	          this.context.fillStyle = "#fff"; // should get from form
	          this.context.beginPath();
	          this.context.rect(0, 0, this.WIDTH, this.HEIGHT);
	          this.context.fill();
	          this.context.closePath();
	          this.dataURL = this.canvas.toDataURL();
	        }
	        var that = this;
	        this.imageObj = document.createElement("img");
	        this.imageObj.src = this.dataURL;
	        this.imageObj.onload = function () {
	          var i = PAINT.current_image;
	          i.canvas.width = i.WIDTH = this.width;
	          i.canvas.height = i.HEIGHT = this.height;
	          PAINT.current_image.scroll();

	          // lame hack to make sure it draws properly on load.
	          // I think this is because this event is firing before the image actually loads
	          setTimeout(function () {
	            PAINT.updateZoom();
	          }, 100);
	        };
	      }
	    }, {
	      key: "redraw",
	      value: function redraw() {
	        if (!this._redraw_proxy) {
	          return;
	        }
	        cancelAnimationFrame(this.active_frame);
	        this.active_frame = requestAnimationFrame(this._redraw_proxy);
	      }
	    }, {
	      key: "_redraw",
	      value: function _redraw() {
	        this.context.clearRect(0, 0, this.WIDTH, this.HEIGHT);
	        if (this.imageObj) {
	          this.context.drawImage(this.imageObj, 0, 0);
	        }
	        for (var i = 0; i < this.actions.length; i++) {
	          var action = this.actions[i];
	          this.context.globalAlpha = action.tool == "eraser" ? 1 : action.alpha;
	          this.context.drawImage(action.canvas, action.x0, action.y0);
	        }
	        // Save last actions canvas for future load
	        /*if (current_action) { current_action.dataURL = canvases[canvases.length-1].toDataURL(); }*/
	        var z = PAINT.zoom;
	        var canvas = PAINT.display_canvas;
	        var context = PAINT.display_context;
	        context.clearRect(0, 0, canvas.width, canvas.height);
	        var scale = PAINT.zoom;
	        context.drawImage(this.canvas, this.scrollX / scale, this.scrollY / scale, this.WIDTH, this.HEIGHT, //sx,xy,sw,sh
	        0, 0, this.WIDTH * scale | 0, this.HEIGHT * scale | 0 //dx,dy,dw,dh
	        );
	        if (PAINT.current_tool) {
	          PAINT.current_tool.redraw();
	        }
	      }
	    }, {
	      key: "scroll",
	      value: function scroll() {
	        var w = $(".canvas-wrapper");
	        this.scrollX = w.scrollLeft();
	        this.scrollY = w.scrollTop();
	      }
	    }, {
	      key: "toJSON",
	      value: function toJSON() {
	        var actions = [];
	        //for (var i=0;i<this.actions.length;i++) {
	        //  actions.push(this.actions[i].toJSON());
	        //}
	        return {
	          'name': this.name,
	          'dataURL': this.canvas.toDataURL(),
	          'actions': actions
	        };
	      }
	    }]);

	    return Image;
	  })();

	  PAINT.Image = Image;
	  PAINT.loadNewOrAutoSave = function () {
	    new PAINT.Image(PAINT.gallery.__autosave || { w: 75, h: 75 });
	  };
	  $(window).resize(function () {
	    PAINT.updateZoom();
	  });
	  document.addEventListener("keydown", function (e) {
	    if (e.ctrlKey) {
	      if (e.keyCode == 90) {
	        // ctrl+z = undo
	        PAINT.current_image.actions.pop();
	        PAINT.current_action && PAINT.current_action.destroy();
	        PAINT.current_image.redraw();
	        return false;
	      }
	      if (e.keyCode == 65) {
	        // ctrl+a = select all
	        PAINT.changeTool("select");
	        PAINT.current_tool.selectAll();
	        return false;
	      }
	    }
	  });
	})();

/***/ },
/* 14 */
/***/ function(module, exports) {

	"use strict";

	var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	window.PAINT = window.PAINT || {};
	(function () {
	  //zoom stuff probably doesn't belong in this file
	  PAINT.zoom = 1;
	  function _r(number) {
	    return Math.floor(number / PAINT.zoom);
	  }
	  PAINT.getMouseXY = function getMouseXY(e) {
	    var _cr = PAINT.display_canvas.getBoundingClientRect();
	    var i = PAINT.current_image;
	    if (!e.pageX) {
	      return [0, 0];
	    } //fake click
	    return [_r(e.pageX - _cr.left + i.scrollX), _r(e.pageY - _cr.top + i.scrollY)];
	  };
	  PAINT.updateZoom = function updateZoom(new_zoom) {
	    // This was invaluable: http://stackoverflow.com/questions/23271093/scale-images-with-canvas-without-blurring-it
	    // fiddle: http://jsfiddle.net/epistemex/VsZFb/2/
	    var c = PAINT.display_canvas;
	    var wrapper = $(".canvas-wrapper");
	    var h = $("paint").height() - 17;
	    var w = $("paint").width() - 17;
	    var px = (wrapper.scrollLeft() + w / 2) / PAINT.zoom;
	    var py = (wrapper.scrollTop() + h / 2) / PAINT.zoom;
	    PAINT.zoom = new_zoom || PAINT.zoom;
	    c.width = Math.min(w, PAINT.canvas.width * PAINT.zoom);
	    c.height = Math.min(h, PAINT.canvas.height * PAINT.zoom);
	    $(".canvas-inner .resizer").css({ height: PAINT.canvas.height * PAINT.zoom, width: PAINT.canvas.width * PAINT.zoom });
	    wrapper.scrollLeft(px * PAINT.zoom - w / 2);
	    wrapper.scrollTop(py * PAINT.zoom - h / 2);
	    var ctx = PAINT.display_context = PAINT.display_canvas.getContext("2d");
	    ctx.imageSmoothingEnabled = false;
	    ctx.mozImageSmoothingEnabled = false;
	    var i = document.querySelector("#tools [name=zoom]");
	    if (i) {
	      i.dataset.level = PAINT.zoom;
	    }
	    PAINT.current_image.redraw();
	  };
	})();

	(function () {
	  var Action = (function () {
	    // A json serializable/parsable class that stores each action

	    function Action(data) {
	      _classCallCheck(this, Action);

	      this.x0 = data.x0 || 0;
	      this.y0 = data.y0 || 0;
	      if ('tool_name' in data) {
	        //restoring old action from json
	        this.tool_name = data.tool_name;
	      } else {
	        // new action, data is mouse click
	        var fg = $('tools [name=fg]').val();
	        var bg = $('tools [name=bg]').val();

	        var _ref = data.button == 0 ? [fg, bg] : [bg, fg];

	        var _ref2 = _slicedToArray(_ref, 2);

	        this.color = _ref2[0];
	        this.color2 = _ref2[1];

	        this.tool = PAINT.current_tool;
	      }
	      this.canvas = document.createElement('canvas');
	      this.canvas.width = PAINT.current_image.WIDTH;
	      this.canvas.height = PAINT.current_image.HEIGHT;
	      this.context = this.canvas.getContext('2d');
	      this.context.imageSmoothingEnabled = false;
	      this.context.mozImageSmoothingEnabled = false;
	      if (this.dataURL) {
	        var img = document.createElement('img');
	        img.src = this.dataURL;
	        context.drawImage(img);
	      }
	      //$(".canvas-wrapper").append(this.canvas);
	      if (PAINT.current_action) {
	        PAINT.current_action.destroy();
	      }
	      PAINT.current_image.actions.push(this);
	      PAINT.current_action = this;
	    }

	    _createClass(Action, [{
	      key: "destroy",
	      value: function destroy() {
	        if (this.tool && this.tool.name == "select") {
	          this.tool.div.style.display = "none";
	        }
	      }
	    }, {
	      key: "toJSON",
	      value: function toJSON() {
	        return {
	          dataURL: this.canvas.toDataURL(),
	          x0: this.x0,
	          y0: this.y0
	        };
	      }
	    }]);

	    return Action;
	  })();

	  PAINT.Action = Action;
	})();

/***/ },
/* 15 */
/***/ function(module, exports) {

	"use strict";

	window.PAINT = window.PAINT || {};
	PAINT.gallery = JSON.parse(localStorage.getItem("gallery") || "{}");
	PAINT.addMessage = function (text) {
	  $("#logs").append($("<li>" + text + "</li>"));
	  $("#logs").scrollTop($("#logs")[0].scrollHeight);
	};
	window.PAINT.storage = (function () {
	  function startSaveAs() {
	    alert("startSaveAs Not Implimented!");
	  }
	  function saveImage(name) {
	    if (name) {
	      PAINT.current_image.name = name;
	    }
	    if (!PAINT.current_image.name) {
	      startSaveAs();return;
	    }
	    PAINT.gallery[PAINT.current_image.name] = PAINT.current_image.toJSON();
	    localStorage.setItem("gallery", JSON.stringify(PAINT.gallery));
	    PAINT.addMessage(name + " saved!");
	  }
	  function autoSave(dataURL) {
	    var name = "__autosave";
	    PAINT.gallery[name] = PAINT.current_image.toJSON();
	    PAINT.gallery[name].dataURL = dataURL || PAINT.gallery[name].dataURL;
	    localStorage.setItem("gallery", JSON.stringify(PAINT.gallery));
	    PAINT.addMessage(name + " saved!");
	  }

	  return {
	    saveImage: saveImage,
	    autoSave: autoSave
	  };
	})();

/***/ },
/* 16 */
/***/ function(module, exports) {

	'use strict';

	window.PAINT = window.PAINT || {};

	PAINT.debug = (function () {
	  /* return {
	     log: function() {},
	     count: function() {},
	     rate: function() {}
	  */
	  var container = document.createElement('div');
	  container.id = 'debug_rates';
	  var counts = {};
	  var per_second = {};
	  var times = {};
	  var status_dict = {};
	  function timeit(f) {
	    times[f.name] = [];
	    return function () {
	      var start = new Date().valueOf();
	      var out = f.apply(this, arguments);
	      var t = new Date().valueOf() - start;
	      times[f.name].push(t);
	      return out;
	    };
	  }
	  function rate(key) {
	    per_second[key] = per_second[key] || [];
	    per_second[key].push(new Date().valueOf());
	  }
	  function redraw() {
	    if (!$('#debug_rates').length) {
	      $('#tools_bot').append(container);
	    }
	    var now = new Date().valueOf();
	    var html = '';
	    var key;
	    for (key in counts) {
	      html += "<div><b>" + key + ":</b> " + counts[key] + "</div>";
	    }
	    for (key in per_second) {
	      var count = 0;
	      var time = per_second[key][per_second[key].length - 1];
	      for (var i = 0; i < per_second[key].length; i++) {
	        if (per_second[key][i] > time - 1000) {
	          count++;
	        }
	      }
	      html += "<div><b>" + key + "</b> " + per_second[key].length + " (" + count + "/s)</div>";
	    }
	    container.innerHTML = html;

	    // now the statuses
	    for (key in status_dict) {
	      document.getElementById(key).innerHTML = status_dict[key];
	    }
	    requestAnimationFrame(redraw);
	  }
	  function rateFunc(func, key, context) {
	    context = context || this;
	    return function () {
	      rate(key);
	      func.apply(context, arguments);
	    };
	  }
	  //redraw = rateFunc(redraw,'debug');
	  redraw();
	  return {
	    log: function log(msg) {
	      PAINT.addMessage(msg);
	    },
	    rate: rate,
	    rateFunc: rateFunc,
	    status: status_dict
	  };
	})();

/***/ },
/* 17 */
/***/ function(module, exports) {

	'use strict';

	var d_data = { // testing dialog
	  title: "yeah!",
	  form: [{ name: 'width', title: 'Width', value: 100, type: 'number' }, { name: 'height', title: 'Height', value: 100, type: 'number' }],
	  accept: function accept() {
	    alert("accepted");
	  }
	};
	riot.mount("tools", {});
	$(function () {
	  PAINT.loadNewOrAutoSave();
	});

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(19);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(22)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/css-loader/index.js?minimize!./../node_modules/less-loader/index.js?config=lessLoaderCustom!./base.less", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js?minimize!./../node_modules/less-loader/index.js?config=lessLoaderCustom!./base.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(20)();
	// imports


	// module
	exports.push([module.id, "/*!\nPure v0.6.0\nCopyright 2014 Yahoo! Inc. All rights reserved.\nLicensed under the BSD License.\nhttps://github.com/yahoo/pure/blob/master/LICENSE.md\n*/\n/*!\nnormalize.css v^3.0 | MIT License | git.io/normalize\nCopyright (c) Nicolas Gallagher and Jonathan Neal\n*/\n/*! normalize.css v3.0.2 | MIT License | git.io/normalize */html{font-family:sans-serif;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}body{margin:0}article,aside,details,figcaption,figure,footer,header,hgroup,main,menu,nav,section,summary{display:block}audio,canvas,progress,video{display:inline-block;vertical-align:baseline}audio:not([controls]){display:none;height:0}[hidden],template{display:none}a{background-color:transparent}a:active,a:hover{outline:0}abbr[title]{border-bottom:1px dotted}b,strong{font-weight:700}dfn{font-style:italic}h1{font-size:2em;margin:.67em 0}mark{background:#ff0;color:#000}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sup{top:-.5em}sub{bottom:-.25em}img{border:0}svg:not(:root){overflow:hidden}figure{margin:1em 40px}hr{box-sizing:content-box;height:0}pre{overflow:auto}code,kbd,pre,samp{font-family:monospace;font-size:1em}button,input,optgroup,select,textarea{color:inherit;font:inherit;margin:0}button{overflow:visible}button,select{text-transform:none}button,html input[type=button],input[type=reset],input[type=submit]{-webkit-appearance:button;cursor:pointer}button[disabled],html input[disabled]{cursor:default}button::-moz-focus-inner,input::-moz-focus-inner{border:0;padding:0}input{line-height:normal}input[type=checkbox],input[type=radio]{box-sizing:border-box;padding:0}input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{height:auto}input[type=search]{-webkit-appearance:textfield;box-sizing:content-box}input[type=search]::-webkit-search-cancel-button,input[type=search]::-webkit-search-decoration{-webkit-appearance:none}fieldset{border:1px solid silver;margin:0 2px;padding:.35em .625em .75em}legend{border:0;padding:0}textarea{overflow:auto}optgroup{font-weight:700}table{border-collapse:collapse;border-spacing:0}td,th{padding:0}.hidden,[hidden]{display:none!important}.pure-img{max-width:100%;height:auto;display:block}.pure-g{letter-spacing:-.31em;*letter-spacing:normal;*word-spacing:-.43em;text-rendering:optimizespeed;font-family:FreeSans,Arimo,Droid Sans,Helvetica,Arial,sans-serif;display:-webkit-flex;-webkit-flex-flow:row wrap;display:-ms-flexbox;-ms-flex-flow:row wrap;-ms-align-content:flex-start;-webkit-align-content:flex-start;align-content:flex-start}.opera-only :-o-prefocus,.pure-g{word-spacing:-.43em}.pure-u{display:inline-block;*display:inline;zoom:1;letter-spacing:normal;word-spacing:normal;vertical-align:top;text-rendering:auto}.pure-g [class*=pure-u]{font-family:sans-serif}.pure-u-1,.pure-u-1-1,.pure-u-1-2,.pure-u-1-3,.pure-u-1-4,.pure-u-1-5,.pure-u-1-6,.pure-u-1-8,.pure-u-1-12,.pure-u-1-24,.pure-u-2-3,.pure-u-2-5,.pure-u-2-24,.pure-u-3-4,.pure-u-3-5,.pure-u-3-8,.pure-u-3-24,.pure-u-4-5,.pure-u-4-24,.pure-u-5-5,.pure-u-5-6,.pure-u-5-8,.pure-u-5-12,.pure-u-5-24,.pure-u-6-24,.pure-u-7-8,.pure-u-7-12,.pure-u-7-24,.pure-u-8-24,.pure-u-9-24,.pure-u-10-24,.pure-u-11-12,.pure-u-11-24,.pure-u-12-24,.pure-u-13-24,.pure-u-14-24,.pure-u-15-24,.pure-u-16-24,.pure-u-17-24,.pure-u-18-24,.pure-u-19-24,.pure-u-20-24,.pure-u-21-24,.pure-u-22-24,.pure-u-23-24,.pure-u-24-24{display:inline-block;*display:inline;zoom:1;letter-spacing:normal;word-spacing:normal;vertical-align:top;text-rendering:auto}.pure-u-1-24{width:4.1667%;*width:4.1357%}.pure-u-1-12,.pure-u-2-24{width:8.3333%;*width:8.3023%}.pure-u-1-8,.pure-u-3-24{width:12.5%;*width:12.469%}.pure-u-1-6,.pure-u-4-24{width:16.6667%;*width:16.6357%}.pure-u-1-5{width:20%;*width:19.969%}.pure-u-5-24{width:20.8333%;*width:20.8023%}.pure-u-1-4,.pure-u-6-24{width:25%;*width:24.969%}.pure-u-7-24{width:29.1667%;*width:29.1357%}.pure-u-1-3,.pure-u-8-24{width:33.3333%;*width:33.3023%}.pure-u-3-8,.pure-u-9-24{width:37.5%;*width:37.469%}.pure-u-2-5{width:40%;*width:39.969%}.pure-u-5-12,.pure-u-10-24{width:41.6667%;*width:41.6357%}.pure-u-11-24{width:45.8333%;*width:45.8023%}.pure-u-1-2,.pure-u-12-24{width:50%;*width:49.969%}.pure-u-13-24{width:54.1667%;*width:54.1357%}.pure-u-7-12,.pure-u-14-24{width:58.3333%;*width:58.3023%}.pure-u-3-5{width:60%;*width:59.969%}.pure-u-5-8,.pure-u-15-24{width:62.5%;*width:62.469%}.pure-u-2-3,.pure-u-16-24{width:66.6667%;*width:66.6357%}.pure-u-17-24{width:70.8333%;*width:70.8023%}.pure-u-3-4,.pure-u-18-24{width:75%;*width:74.969%}.pure-u-19-24{width:79.1667%;*width:79.1357%}.pure-u-4-5{width:80%;*width:79.969%}.pure-u-5-6,.pure-u-20-24{width:83.3333%;*width:83.3023%}.pure-u-7-8,.pure-u-21-24{width:87.5%;*width:87.469%}.pure-u-11-12,.pure-u-22-24{width:91.6667%;*width:91.6357%}.pure-u-23-24{width:95.8333%;*width:95.8023%}.pure-u-1,.pure-u-1-1,.pure-u-5-5,.pure-u-24-24{width:100%}.pure-button{display:inline-block;zoom:1;line-height:normal;white-space:nowrap;vertical-align:middle;text-align:center;cursor:pointer;-webkit-user-drag:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;box-sizing:border-box;font-family:inherit;font-size:100%;padding:.5em 1em;color:#444;color:rgba(0,0,0,.8);border:1px solid #999;border:none transparent;background-color:#e6e6e6;text-decoration:none;border-radius:2px}.pure-button-hover,.pure-button:focus,.pure-button:hover{filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#00000000',endColorstr='#1a000000',GradientType=0);background-image:-webkit-gradient(linear,0 0,0 100%,from(transparent),color-stop(40%,rgba(0,0,0,.05)),to(rgba(0,0,0,.1)));background-image:-webkit-linear-gradient(transparent,rgba(0,0,0,.05) 40%,rgba(0,0,0,.1));background-image:linear-gradient(transparent,rgba(0,0,0,.05) 40%,rgba(0,0,0,.1))}.pure-button:focus{outline:0}.pure-button-active,.pure-button:active{box-shadow:0 0 0 1px rgba(0,0,0,.15) inset,0 0 6px rgba(0,0,0,.2) inset;border-color:#000\\9}.pure-button-disabled,.pure-button-disabled:active,.pure-button-disabled:focus,.pure-button-disabled:hover,.pure-button[disabled]{border:none;background-image:none;filter:progid:DXImageTransform.Microsoft.gradient(enabled=false);filter:alpha(opacity=40);-khtml-opacity:.4;-moz-opacity:.4;opacity:.4;cursor:not-allowed;box-shadow:none}.pure-button-hidden{display:none}.pure-button::-moz-focus-inner{padding:0;border:0}.pure-button-primary,.pure-button-selected,a.pure-button-primary,a.pure-button-selected{background-color:#0078e7;color:#fff}.pure-form input[type=color],.pure-form input[type=date],.pure-form input[type=datetime-local],.pure-form input[type=datetime],.pure-form input[type=email],.pure-form input[type=month],.pure-form input[type=number],.pure-form input[type=password],.pure-form input[type=search],.pure-form input[type=tel],.pure-form input[type=text],.pure-form input[type=time],.pure-form input[type=url],.pure-form input[type=week],.pure-form select,.pure-form textarea{padding:.5em .6em;display:inline-block;border:1px solid #ccc;box-shadow:inset 0 1px 3px #ddd;border-radius:4px;vertical-align:middle;box-sizing:border-box}.pure-form input:not([type]){padding:.5em .6em;display:inline-block;border:1px solid #ccc;box-shadow:inset 0 1px 3px #ddd;border-radius:4px;box-sizing:border-box}.pure-form input[type=color]{padding:.2em .5em}.pure-form input:not([type]):focus,.pure-form input[type=color]:focus,.pure-form input[type=date]:focus,.pure-form input[type=datetime-local]:focus,.pure-form input[type=datetime]:focus,.pure-form input[type=email]:focus,.pure-form input[type=month]:focus,.pure-form input[type=number]:focus,.pure-form input[type=password]:focus,.pure-form input[type=search]:focus,.pure-form input[type=tel]:focus,.pure-form input[type=text]:focus,.pure-form input[type=time]:focus,.pure-form input[type=url]:focus,.pure-form input[type=week]:focus,.pure-form select:focus,.pure-form textarea:focus{outline:0;border-color:#129fea}.pure-form input[type=checkbox]:focus,.pure-form input[type=file]:focus,.pure-form input[type=radio]:focus{outline:thin solid #129fea;outline:1px auto #129fea}.pure-form .pure-checkbox,.pure-form .pure-radio{margin:.5em 0;display:block}.pure-form input:not([type])[disabled],.pure-form input[type=color][disabled],.pure-form input[type=date][disabled],.pure-form input[type=datetime-local][disabled],.pure-form input[type=datetime][disabled],.pure-form input[type=email][disabled],.pure-form input[type=month][disabled],.pure-form input[type=number][disabled],.pure-form input[type=password][disabled],.pure-form input[type=search][disabled],.pure-form input[type=tel][disabled],.pure-form input[type=text][disabled],.pure-form input[type=time][disabled],.pure-form input[type=url][disabled],.pure-form input[type=week][disabled],.pure-form select[disabled],.pure-form textarea[disabled]{cursor:not-allowed;background-color:#eaeded;color:#cad2d3}.pure-form input[readonly],.pure-form select[readonly],.pure-form textarea[readonly]{background-color:#eee;color:#777;border-color:#ccc}.pure-form input:focus:invalid,.pure-form select:focus:invalid,.pure-form textarea:focus:invalid{color:#b94a48;border-color:#e9322d}.pure-form input[type=checkbox]:focus:invalid:focus,.pure-form input[type=file]:focus:invalid:focus,.pure-form input[type=radio]:focus:invalid:focus{outline-color:#e9322d}.pure-form select{height:2.25em;border:1px solid #ccc;background-color:#fff}.pure-form select[multiple]{height:auto}.pure-form label{margin:.5em 0 .2em}.pure-form fieldset{margin:0;padding:.35em 0 .75em;border:0}.pure-form legend{display:block;width:100%;padding:.3em 0;margin-bottom:.3em;color:#333;border-bottom:1px solid #e5e5e5}.pure-form-stacked input:not([type]),.pure-form-stacked input[type=color],.pure-form-stacked input[type=date],.pure-form-stacked input[type=datetime-local],.pure-form-stacked input[type=datetime],.pure-form-stacked input[type=email],.pure-form-stacked input[type=file],.pure-form-stacked input[type=month],.pure-form-stacked input[type=number],.pure-form-stacked input[type=password],.pure-form-stacked input[type=search],.pure-form-stacked input[type=tel],.pure-form-stacked input[type=text],.pure-form-stacked input[type=time],.pure-form-stacked input[type=url],.pure-form-stacked input[type=week],.pure-form-stacked label,.pure-form-stacked select,.pure-form-stacked textarea{display:block;margin:.25em 0}.pure-form-aligned .pure-help-inline,.pure-form-aligned input,.pure-form-aligned select,.pure-form-aligned textarea,.pure-form-message-inline{display:inline-block;*display:inline;*zoom:1;vertical-align:middle}.pure-form-aligned textarea{vertical-align:top}.pure-form-aligned .pure-control-group{margin-bottom:.5em}.pure-form-aligned .pure-control-group label{text-align:right;display:inline-block;vertical-align:middle;width:10em;margin:0 1em 0 0}.pure-form-aligned .pure-controls{margin:1.5em 0 0 11em}.pure-form .pure-input-rounded,.pure-form input.pure-input-rounded{border-radius:2em;padding:.5em 1em}.pure-form .pure-group fieldset{margin-bottom:10px}.pure-form .pure-group input,.pure-form .pure-group textarea{display:block;padding:10px;margin:0 0 -1px;border-radius:0;position:relative;top:-1px}.pure-form .pure-group input:focus,.pure-form .pure-group textarea:focus{z-index:3}.pure-form .pure-group input:first-child,.pure-form .pure-group textarea:first-child{top:1px;border-radius:4px 4px 0 0;margin:0}.pure-form .pure-group input:first-child:last-child,.pure-form .pure-group textarea:first-child:last-child{top:1px;border-radius:4px;margin:0}.pure-form .pure-group input:last-child,.pure-form .pure-group textarea:last-child{top:-2px;border-radius:0 0 4px 4px;margin:0}.pure-form .pure-group button{margin:.35em 0}.pure-form .pure-input-1{width:100%}.pure-form .pure-input-2-3{width:66%}.pure-form .pure-input-1-2{width:50%}.pure-form .pure-input-1-3{width:33%}.pure-form .pure-input-1-4{width:25%}.pure-form-message-inline,.pure-form .pure-help-inline{display:inline-block;padding-left:.3em;color:#666;vertical-align:middle;font-size:.875em}.pure-form-message{display:block;color:#666;font-size:.875em}@media only screen and (max-width:480px){.pure-form button[type=submit]{margin:.7em 0 0}.pure-form input:not([type]),.pure-form input[type=color],.pure-form input[type=date],.pure-form input[type=datetime-local],.pure-form input[type=datetime],.pure-form input[type=email],.pure-form input[type=month],.pure-form input[type=number],.pure-form input[type=password],.pure-form input[type=search],.pure-form input[type=tel],.pure-form input[type=text],.pure-form input[type=time],.pure-form input[type=url],.pure-form input[type=week],.pure-form label{margin-bottom:.3em;display:block}.pure-group input:not([type]),.pure-group input[type=color],.pure-group input[type=date],.pure-group input[type=datetime-local],.pure-group input[type=datetime],.pure-group input[type=email],.pure-group input[type=month],.pure-group input[type=number],.pure-group input[type=password],.pure-group input[type=search],.pure-group input[type=tel],.pure-group input[type=text],.pure-group input[type=time],.pure-group input[type=url],.pure-group input[type=week]{margin-bottom:0}.pure-form-aligned .pure-control-group label{margin-bottom:.3em;text-align:left;display:block;width:100%}.pure-form-aligned .pure-controls{margin:1.5em 0 0}.pure-form-message,.pure-form-message-inline,.pure-form .pure-help-inline{display:block;font-size:.75em;padding:.2em 0 .8em}}.pure-menu{box-sizing:border-box}.pure-menu-fixed{position:fixed;left:0;top:0;z-index:3}.pure-menu-item,.pure-menu-list{position:relative}.pure-menu-list{list-style:none;margin:0;padding:0}.pure-menu-item{padding:0;margin:0;height:100%}.pure-menu-heading,.pure-menu-link{display:block;text-decoration:none;white-space:nowrap}.pure-menu-horizontal{width:100%;white-space:nowrap}.pure-menu-horizontal .pure-menu-list{display:inline-block}.pure-menu-horizontal .pure-menu-heading,.pure-menu-horizontal .pure-menu-item,.pure-menu-horizontal .pure-menu-separator{display:inline-block;*display:inline;zoom:1;vertical-align:middle}.pure-menu-item .pure-menu-item{display:block}.pure-menu-children{display:none;position:absolute;left:100%;top:0;margin:0;padding:0;z-index:3}.pure-menu-horizontal .pure-menu-children{left:0;top:auto;width:inherit}.pure-menu-active>.pure-menu-children,.pure-menu-allow-hover:hover>.pure-menu-children{display:block;position:absolute}.pure-menu-has-children>.pure-menu-link:after{padding-left:.5em;content:\"\\25B8\";font-size:small}.pure-menu-horizontal .pure-menu-has-children>.pure-menu-link:after{content:\"\\25BE\"}.pure-menu-scrollable{overflow-y:scroll;overflow-x:hidden}.pure-menu-scrollable .pure-menu-list{display:block}.pure-menu-horizontal.pure-menu-scrollable .pure-menu-list{display:inline-block}.pure-menu-horizontal.pure-menu-scrollable{white-space:nowrap;overflow-y:hidden;overflow-x:auto;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;padding:.5em 0}.pure-menu-horizontal.pure-menu-scrollable::-webkit-scrollbar{display:none}.pure-menu-separator{background-color:#ccc;height:1px;margin:.3em 0}.pure-menu-horizontal .pure-menu-separator{width:1px;height:1.3em;margin:0 .3em}.pure-menu-heading{text-transform:uppercase;color:#565d64}.pure-menu-link{color:#777}.pure-menu-children{background-color:#fff}.pure-menu-disabled,.pure-menu-heading,.pure-menu-link{padding:.5em 1em}.pure-menu-disabled{opacity:.5}.pure-menu-disabled .pure-menu-link:hover{background-color:transparent}.pure-menu-active>.pure-menu-link,.pure-menu-link:focus,.pure-menu-link:hover{background-color:#eee}.pure-menu-selected .pure-menu-link,.pure-menu-selected .pure-menu-link:visited{color:#000}.pure-table{border-collapse:collapse;border-spacing:0;empty-cells:show;border:1px solid #cbcbcb}.pure-table caption{color:#000;font:italic 85%/1 arial,sans-serif;padding:1em 0;text-align:center}.pure-table td,.pure-table th{border-left:1px solid #cbcbcb;border-width:0 0 0 1px;font-size:inherit;margin:0;overflow:visible;padding:.5em 1em}.pure-table td:first-child,.pure-table th:first-child{border-left-width:0}.pure-table thead{background-color:#e0e0e0;color:#000;text-align:left;vertical-align:bottom}.pure-table td{background-color:transparent}.pure-table-odd td,.pure-table-striped tr:nth-child(2n-1) td{background-color:#f2f2f2}.pure-table-bordered td{border-bottom:1px solid #cbcbcb}.pure-table-bordered tbody>tr:last-child>td{border-bottom-width:0}.pure-table-horizontal td,.pure-table-horizontal th{border-width:0 0 1px;border-bottom:1px solid #cbcbcb}.pure-table-horizontal tbody>tr:last-child>td{border-bottom-width:0}.btn-google{background-color:#dd4b39}.btn-twitter{background-color:#55acee}.btn-facebook{background-color:#3b5998}body,html{margin:0}body{background:#eee}window,window .mask{height:100%;left:0;position:absolute;top:0;width:100%;z-index:999}window .mask{background:rgba(0,0,0,.5)}window .content{background:#ccc;left:50%;margin:-250px 0 0 -250px;padding:75px 0;position:absolute;top:50%;width:535px;z-index:1000}window .content .title-bar{background-color:#2196f3;color:#fff;font-weight:700;left:0;padding:10px 20px;position:absolute;top:0;width:100%}window .content .buttons{bottom:0;left:0;padding:20px;position:absolute;text-align:right;width:100%}window .content .buttons button{margin-right:10px}window .content .form-row{padding:5px 10px}window .content .form-row label{display:inline-block;width:100px}window .content .form-row [type=number]{width:60px}window .download-image{padding:0 30px}window .download-image img{display:block;margin:0 auto 20px;max-height:500px;max-width:100%}.pure-button.button-error,.pure-button.button-secondary,.pure-button.button-success,.pure-button.button-warning{color:#fff;border-radius:4px;text-shadow:0 1px 1px rgba(0,0,0,.2)}.pure-button.button-success{background-color:#1cb841}.pure-button.button-error{background-color:#ca3c3c}.pure-button.button-warning{background-color:#df7514}.pure-button.button-secondary{background-color:#42b8dd}window .file-list{background:#fff;box-sizing:border-box;height:340px;margin:0 auto;padding:10px 10px 50px;overflow-y:scroll;width:90%}window .file-list .file{background-repeat:no-repeat;background-size:contain;box-shadow:0 0 2px #000;display:inline-block;cursor:pointer;height:100px;margin:5px 5px 25px;position:relative;width:100px}window .file-list .file .img{background-position:center;background-size:cover;height:100px;width:100px}window .file-list .file span{content:attr(name);display:block;left:0;overflow:hidden;position:absolute;text-align:center;text-overflow:ellipsis;top:102%;white-space:nowrap;width:100%}window .file-list .file:hover{box-shadow:0 0 5px #000}window .file-list .file:hover span{background:#fff;overflow:visible;white-space:normal}window .file .options{position:absolute;right:0;top:0}window .file .options .inner{display:none;position:absolute;right:0;top:100%}window .file .options .inner .pure-button{width:100%}window .file .options .trigger{color:#fff;text-shadow:0 0 3px #000}window .file .options .trigger.active+.inner{display:block}#debug_rates{bottom:0;left:100px;position:absolute}paint{bottom:110px;left:110px;overflow:hidden;position:absolute;right:0;top:5px}paint .canvas-wrapper{height:100%;overflow:scroll;width:100%}paint .canvas-wrapper .canvas-inner{display:inline-block}paint .canvas-wrapper .canvas-inner resize{bottom:0;left:0;outline:1px dotted red;position:absolute;right:0;top:0}paint .canvas-wrapper .canvas-inner resize[data-size]:before{background:#fcffde;content:attr(data-size);display:block;margin:-15px 0 0 -60px;height:30px;left:50%;line-height:25px;position:absolute;text-align:center;top:50%;width:120px}paint .canvas-wrapper .canvas-inner resize .spot{box-sizing:border-box;border:5px #000;cursor:pointer;height:20px;max-height:45%;position:absolute;width:20px;max-width:30%}paint .canvas-wrapper .canvas-inner resize .spot:hover{border-color:red}paint .canvas-wrapper .canvas-inner resize .center-h{left:50%;margin-left:-10px}paint .canvas-wrapper .canvas-inner resize .center-v{top:50%;margin-top:-10px}paint .canvas-wrapper .canvas-inner resize .left{border-left-style:solid;left:-5px}paint .canvas-wrapper .canvas-inner resize .right{border-right-style:solid;right:-5px}paint .canvas-wrapper .canvas-inner resize .top{border-top-style:solid;top:-5px}paint .canvas-wrapper .canvas-inner resize .bottom{border-bottom-style:solid;bottom:-5px}paint .canvas{cursor:crosshair;left:0;overflow:hidden;position:absolute;top:0}paint .select{box-sizing:border-box;background-repeat:no-repeat;background-size:100%;border:1px dashed #fff;cursor:pointer;display:none;margin:-1px;outline:1px dashed #000;position:absolute;image-rendering:optimizeSpeed;image-rendering:-moz-crisp-edges;image-rendering:-o-crisp-edges;image-rendering:-webkit-optimize-contrast;image-rendering:pixelated;image-rendering:optimize-contrast;-ms-interpolation-mode:nearest-neighbor}#tools,#tools_bot{background-color:#ccc}.border-box{box-sizing:border-box}#tools .clear{clear:both;height:10px}#tools .options input{max-width:100%}#tools{height:100%;left:0;padding:10px;position:absolute;text-align:center;top:0;width:104px;z-index:1}#tools .pure-button{cursor:pointer;font-size:23px;float:left;height:40px;line-height:40px;margin:1px;padding:0;text-align:center;vertical-align:middle;width:40px}#tools .pure-button.active{-webkit-filter:invert(.95)}#tools .circle-button:before,#tools .fill-button:before,#tools .rect-button:before,#tools .select-button:before{content:\"\";display:inline-block;height:23px;width:23px}#tools button.fill-button:before{background-image:url(" + __webpack_require__(21) + ");background-position:center;background-repeat:no-repeat;background-size:auto 100%;height:100%;width:100%}#tools .select-button:before{border:1px dashed}#tools .rect-button:before{background:#000}#tools .circle-button:before{background:#000;border-radius:100%}#tools_bot [type=range]{width:100%}[data-level]{position:relative}[data-level]:before{content:attr(data-level);font-size:9.2px;position:absolute;top:0;right:2px;background-color:#42b8dd;border-radius:100%;width:14.5px;height:14.5px;line-height:14.5px;text-align:center}.alpha-container{bottom:0;left:0;position:absolute;width:60px}@media (max-width:1024px){.alpha-container{display:none}}.fg_alpha{display:block}.fg_alpha:before{content:\"Alpha: \"}#tools_bot{bottom:0;height:110px;position:absolute;width:100%;z-index:2}.color-picker{padding:0;border:0;background:none;height:50px;position:absolute;width:50px}.color-picker[name=fg]{left:10px;top:20px;z-index:1}.color-picker[name=bg]{left:0;top:0;z-index:0}#tools button.save-as-new{position:relative}#tools button.save-as-new i:after{background:#fff;border-radius:100%;bottom:3px;font-size:15.33333333px;content:\"\\F055\";position:absolute;right:3px}#logs{background-color:#fff;bottom:5px;box-sizing:border-box;overflow-y:hidden;padding:3px;position:absolute;right:0;top:5px;width:300px}#logs:hover{overflow-y:scroll}#logs>li{border-bottom:1px solid #d3d3d3;list-style:none;margin-bottom:4px}#logs>li:last-child{margin-bottom:0;border-bottom:0}@media (max-width:1024px){#logs{display:none}}tools #status{bottom:2px;height:1em;left:60px;right:300px;position:absolute;z-index:999}@media (max-width:1024px){tools #status{right:0}}", ""]);

	// exports


/***/ },
/* 20 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	"use strict";

	module.exports = function () {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for (var i = 0; i < this.length; i++) {
				var item = this[i];
				if (item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function (modules, mediaQuery) {
			if (typeof modules === "string") modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for (var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if (typeof id === "number") alreadyImportedModules[id] = true;
			}
			for (i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if (mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if (mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "d19dbae0588317e6440a910c353aceae.png"

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }
/******/ ]);