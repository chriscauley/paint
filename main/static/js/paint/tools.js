window.PAINT = window.PAINT || {};
(function() {
  PAINT.changeTool = function(name,back) {
    $("#tools .active").removeClass("active");
    $("[name="+name+"]").addClass("active");
    var _t = ['saveAs','save','new','open','upload','download'];
    if (PAINT.current_tool && _t.indexOf(this.current_tool.name) == -1) { PAINT.last_tool = this.current_tool.name; }
    PAINT.current_tool = PAINT.TOOLS[name];
    if (PAINT.current_action && name != "zoom" && ! back) { PAINT.current_action.destroy(); }
    PAINT.current_tool.select();
  }
  function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }
  function rgbToHex(o) {return toHex(o.r)+toHex(o.g)+toHex(o.b)}
  function toHex(n) {
    n = parseInt(n,10);
    if (isNaN(n)) return "00";
    n = Math.max(0,Math.min(n,255));
    return "0123456789ABCDEF".charAt((n-n%16)/16)
      + "0123456789ABCDEF".charAt(n%16);
  }
  function getPixelColor(x,y) {
    var data = PAINT.current_image.context.getImageData(x,y,1,1).data;
    return {
      r: data[0],
      g: data[1],
      b: data[2],
      a: data[3]
    }
  }

  function drawEllipse(ctx, x, y, w, h) {
    // from http://stackoverflow.com/questions/2172798/how-to-draw-an-oval-in-html5-canvas
    var kappa = .5522848,
    ox = (w / 2) * kappa, // control point offset horizontal
    oy = (h / 2) * kappa, // control point offset vertical
    xe = x + w,           // x-end
    ye = y + h,           // y-end
    xm = x + w / 2,       // x-middle
    ym = y + h / 2;       // y-middle

    ctx.beginPath();
    ctx.moveTo(x, ym);
    ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
    ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
    //ctx.closePath(); // not used correctly, see comments (use to close off open path)
    ctx.fill();
  }
  class Tool {
    constructor(options) {
      for (var key in options) { this[key] = options[key] }
    }
    move(e) {
      var [x,y] = PAINT.getMouseXY(e);
      PAINT.debug.status['mouse1'] = `${x}x${y}`;
      if (!this.action || !this.mouse_down) { return }
      [this.action.x2,this.action.y2] = [x,y]
      this.action.w = this.action.x2-this.action.x1;
      this.action.h = this.action.y2-this.action.y1;
      if (this.bounding) { PAINT.debug.status['mouse3'] = `w:${this.action.w} h:${this.action.h}`; }
      return true; // some tools need this to stop propagation
    }
    up(e) {
      window.MOUSE_DOWN = this.mouse_down = false;
    }
    over(e) {
      this.mouse_down = window.MOUSE_DOWN;
    }
    down(e) {
      window.MOUSE_DOWN = this.mouse_down = true;
      this.action = new PAINT.Action(e);
      [this.action.x1,this.action.y1] = PAINT.getMouseXY(e);
      PAINT.debug.status['mouse2'] =`click:${this.action.x1}x${this.action.y1}`;
    }
    select() {
      PAINT.debug.status['mouse3'] = PAINT.debug.status['mouse2'] = '';
    }
    out(e) {

    }
    options(e) {
      return [];
    }
    redraw() {
      
    }
  }

  class DialogTool extends Tool {
    select() {
      super.select();
      $("body").append("<window></window>");
      riot.mount("window",this.getWindowData());
    }
    accept(tag) {
      tag.unmount()
    }
  }

  class New extends DialogTool {
    constructor() {
      super({name: 'new', title: 'New Image', icon: 'file-o'});
    }
    getWindowData() {
      return {
        title: "Create New Image",
        form: [
          {name: 'width', title: 'Width', value: PAINT.current_image.WIDTH, type: 'number'},
          {name: 'height', title: 'Height', value: PAINT.current_image.HEIGHT, type: 'number'}
        ]
      }
    }
    accept(tag) {
      var w = parseInt($("#id_width").val()), h = parseInt($("#id_height").val());
      new PAINT.Image({w: w, h: h});
      PAINT.addMessage(`A new ${w}x${h} image has been created.`)
      tag.unmount();
    }
  }

  class Open extends DialogTool {
    constructor() {
      super({name: 'open', title: 'Open Image', icon: 'folder-open-o'})
    }
    click(e,tag) {
      new PAINT.Image(e.item);
      PAINT.addMessage(`${e.item.name} loaded`);
      tag.unmount();
    }
    getWindowData() {
      function getItems()  {
        var names = [];
        var items = [];
        for (var n in PAINT.gallery) { names.push(n) }
        names.sort()
        for (var i=0;i<names.length;i++) { items.push(PAINT.gallery[names[i]]) }
        return items;
      }
      return {
        title: "Open Image",
        getItems: getItems,
        hide_okay: true
      }
    }
  }

  class Upload extends DialogTool {
    constructor() {
      super({name: 'upload', title: 'Upload Image', icon: 'upload'})
    }
    accept(tag) {
      var fr = new FileReader();
      var file = $("#id_file")[0].files[0];
      var fname = $("#id_file")[0].value.replace("/","\\").split("\\").pop();
      fr.onload = function() {
        //#! TODO: this should be added to the library (saved) and a bulk uploader is needed.
        new PAINT.Image({dataURL:fr.result,name: fname});
        PAINT.addMessage(`Image "${fname}" uploaded successfully.`)
      }
      fr.readAsDataURL(file);
      super.accept(tag)
    }
    getWindowData() {
      return {
        title: "Upload Image",
        form: [
          {name: 'file', title: 'File', type: 'file'},
        ],
      }
    }
  }

  class Download extends DialogTool {
    constructor() {
      super({name: 'download', title: 'Download Image', icon: 'download'})
    }
    getWindowData() {
      return {
        title: "Download Image",
        src: PAINT.current_image.canvas.toDataURL(),
        hide_cancel: true
      }
    }
  }

  class Save extends Tool {
    constructor() {
      super({name: 'save', title: 'Save Image', icon: 'floppy-o'})
    }
    select() {
      super.select();
      if (PAINT.current_image.name) {
        PAINT.storage.saveImage(PAINT.current_image.name);
        super.accept(tag);
      } else {
        $("[name=saveAs]").click();
      }
    }
  }

  class SaveAs extends DialogTool {
    constructor() {
      super({name: 'saveAs', title: 'Save Image As', icon: 'floppy-o', className: 'save-as-new'})
    }
    getWindowData() {
      return {
        title: "Save Image As",
        form: [
          {name: 'filename', title: 'Enter A Name', value: "", placeholder: 'Enter a name', type: 'text'},
        ]
      }
    }
    accept(tag) {
      PAINT.storage.saveImage($("#id_filename").val());
      super.accept(tag);
    }
  }

  class BrushTool extends Tool {
    constructor() {
      super({name: 'brush', title: 'Paint Brush', icon: 'paint-brush'})
    }
    options() {
    }
    down(e) {
      super.down(e);
      this.drawn_until = 0;
      this.action.coords = [];
      this.action.size = 1; //#!TODO eventually use size selector
      this.last = false;
      this.move(e);
    }
    out(e) {
      this.move(e);
    }
    over(e) {
      super.over(e);
      this.move(e);
    }
    move(e) {
      if (!super.move(e)) { return; }
      var context = this.action.context;
      var [x,y] = PAINT.getMouseXY(e);
      if (this.last) {
        var dx = x - this.last_x;
        var dy = y - this.last_y;
        var distance = Math.sqrt(dx*dx+dy*dy);
        for (var i=0;i<distance;i++) {
          this.action.coords.push([
            this.last_x+i*dx/distance,
            this.last_y+i*dy/distance
          ]);
        }
      }
      this.action.coords.push([x,y]);
      [this.last_x,this.last_y,this.last] = [x,y,true];

      var image_data = context.createImageData(this.action.size,this.action.size);
      var rgb = hexToRgb(this.action.color);
      for (var i=0;i<image_data.data.length/4;i++) {
        image_data.data[i*4+0] = rgb.r;
        image_data.data[i*4+1] = rgb.g;
        image_data.data[i*4+2] = rgb.b;
        image_data.data[i*4+3] = 255; //#!TODO eventually use alpha selector
      }
      for (var i=this.drawn_until;i<this.action.coords.length;i++) {
        window._id = image_data;
        context.putImageData(
          image_data,
          Math.round(this.action.coords[i][0]-this.action.size/2),
          Math.round(this.action.coords[i][1]-this.action.size/2)
        );
        this.drawn_until = i;
      }
      PAINT.current_image.redraw();
    }
  }

  class RectTool extends Tool {
    constructor() {
      super({name: 'rect', title: 'Rectangle', className: 'rect-button'})
      this.bounding = true;
    }
    move(e) {
      if (!super.move(e)) { return; }
      var image = PAINT.current_image;
      var context = this.action.context;
      context.clearRect(0,0,image.WIDTH,image.HEIGHT);
      context.fillStyle = this.action.color;
      context.beginPath();
      context.rect(this.action.x1,this.action.y1,this.action.w,this.action.h);
      context.fill();
      context.closePath();
      PAINT.current_image.redraw();
    }
  }

  class CircleTool extends Tool {
    constructor() {
      super({name: 'circle', title: 'Ellipse', className: 'circle-button'})
      this.bounding = true;
    }
    move(e) {
      if(!super.move(e)){ return; }
      var image = PAINT.current_image;
      var context = this.action.context
      context.fillStyle = this.action.color;
      context.clearRect(0,0,image.WIDTH,image.HEIGHT);
      drawEllipse(context,this.action.x1,this.action.y1,this.action.w,this.action.h)
      PAINT.current_image.redraw();
    }
  }

  class FillTool extends Tool {
    constructor() {
      super({name: 'fill', title: 'Fill (replace color)', className: 'fill-button'});
    }
    move(e) {

    }
    down(e) {
      super.down(e)
      var WIDTH = PAINT.current_image.WIDTH, HEIGHT = PAINT.current_image.HEIGHT;
      var current_pixel, pixel_position, reach_left, reach_right;
      var color_layer = PAINT.current_image.context.getImageData(0,0,WIDTH,HEIGHT);
      var [x,y] = [this.action.x1,this.action.y1];
      var pixel_stack = [[x,y]];
      var fill_color = hexToRgb(this.action.color);
      var alphas = [];
      pixel_position = 4*(y*WIDTH + x);
      var start_color = {
        r: color_layer.data[pixel_position + 0],
        g: color_layer.data[pixel_position + 1],
        b: color_layer.data[pixel_position + 2],
        a: color_layer.data[pixel_position + 3]
      }

      function matchStartColor(pixel_position) {
        var r = color_layer.data[pixel_position];
        var g = color_layer.data[pixel_position+1];
        var b = color_layer.data[pixel_position+2];
        var a = color_layer.data[pixel_position+3];

        return (a == start_color.a && r == start_color.r && g == start_color.g && b == start_color.b);
      }

      function colorPixel(pixel_position) {
        color_layer.data[pixel_position] = fill_color.r;
        color_layer.data[pixel_position+1] = fill_color.g;
        color_layer.data[pixel_position+2] = fill_color.b;
        color_layer.data[pixel_position+3] = 'a'; // this is so there's no way we can hit the same pixel twice
        alphas.push(pixel_position+3);
      }
      while (pixel_stack.length) {
        current_pixel = pixel_stack.pop();
        x = current_pixel[0], y = current_pixel[1];
        pixel_position = 4*(y*WIDTH + x);
        while (y-- >= 0 && matchStartColor(pixel_position)) {
          pixel_position -= 4*WIDTH;
        }
        pixel_position += 4*WIDTH;
        y++;
        reach_left = false;
        reach_right = false;
        while (y++ < HEIGHT-1 && matchStartColor(pixel_position)) {
          colorPixel(pixel_position);

          if (x > 0) {
            if (matchStartColor(pixel_position - 4)) {
              if (!reach_left) {
                pixel_stack.push([x - 1, y]);
                reach_left = true;
              }
            } else if (reach_left) { reach_left = false; }
          }

          if (x < WIDTH-1) {
            if (matchStartColor(pixel_position + 4)) {
              if (!reach_right) {
                pixel_stack.push([x + 1, y]);
                reach_right = true;
              }
            } else if (reach_right) { reach_right = false; }
          }

          pixel_position += WIDTH * 4;
        }
      }
      for (var i=0;i<alphas.length;i++) {
        color_layer.data[alphas[i]] = 255; //#! TODO make this alpha
      }
      this.action.context.putImageData(color_layer, 0, 0);
      PAINT.current_image.redraw();
    }
  }

  class SelectTool extends Tool {
    constructor() {
      // this tool needs a canvas to store the selected image fragment
      super({name: 'select', title: 'Select', className: 'select-button'})
      this.canvas = document.createElement("canvas");
      this.context = this.canvas.getContext("2d");
      this.bounding = true;
      document.addEventListener("cut",this.cut.bind(this));
    }
    select() {
      this.div = $(".canvas-wrapper .select")[0];
    }
    down(e) {
      // reset the selection div
      super.down(e);
      this.div.style.backgroundImage = "";
      this.context.clearRect(0,0,this.canvas.width,this.canvas.height)
      this.move(e);
      this.drawn = false;
    }
    move(e) {
      // this sizes the selection window, but hasn't actually selected anything
      // action.top/left : top left corner of select relative to image canvas
      // this action.x1/y1 mouse down when drawing select
      // this.action.x2/y2 mouse up when drawing select
      if (!super.move(e)) { return; }
      this.action.left = (this.action.w>0)?this.action.x1:this.action.x2;
      this.action.top = (this.action.h>0)?this.action.y1:this.action.y2;
      this.redraw();
      return true; // stops selectMove from executing
    }
    redraw() {
      // calculate the position and size of the select, this funciton is global for scroll/zoom
      var i = PAINT.current_image;
      if (!this.action) { return }
      this.div.style.display = "block";
      this.div.style.width = Math.abs(PAINT.zoom*this.action.w)+"px";
      this.div.style.height = Math.abs(PAINT.zoom*this.action.h)+"px";
      this.div.style.top = PAINT.zoom*this.action.top-i.scrollY+"px";
      this.div.style.left = PAINT.zoom*this.action.left-i.scrollX+"px";
    }
    selectDraw() {
      // only once per selection
      if (this.drawn) { return }
      this.drawn = true;

      //save the selected piece of canvas and use it as background for this.div
      var i = PAINT.current_image;
      [this.canvas.width,this.canvas.height] = [this.action.w,this.action.h]
      this.context.drawImage(i.canvas,
                             this.action.left,this.action.top,this.action.w,this.action.h,
                             0,0,this.action.w,this.action.h)
      this.dataURL = this.canvas.toDataURL();
      this.div.style.backgroundImage = "url("+this.dataURL+")";
      [this.action.top0, this.action.left0] = [this.action.top, this.action.left]
    }
    selectCut() {
      //fill in the background color where the select window was
      var context = this.action.context;
      var image = PAINT.current_image;
      context.clearRect(0,0,image.WIDTH,image.HEIGHT);
      context.fillStyle = this.action.color2;
      context.beginPath();
      context.rect(this.action.left0,this.action.top0,Math.abs(this.action.w),Math.abs(this.action.h));
      context.fill();
      context.closePath();
      //this.autocrop();
    }
    autocrop() {
      var context = this.action.context;
      var data = context.createImageData(this.action.w,this.action.h).data;
      // there's no such thing as data.slice :(
      console.log(data)
      var tl = data.slice(0,4);
      var tr = data.slice(this.action.w*4,this.action.w*4+4);
      var bl = data.slice(data.length - this.action.w*4,data.length - this.action.w*4 + 4);
      var br = data.slice(data.length - 4);
      if (tl == tr) {console.log('top')}
      if (tl == bl) {console.log('left')}
      if (tr == br) {console.log('right')}
      if (bl == br) {console.log('bottom')}
    }
    selectDown(e) {
      this.select_down = true;
      [this.action.x_start,this.action.y_start] = PAINT.getMouseXY(e);
      this.selectDraw();
      this.selectCut();
      PAINT.current_image.redraw();
    }
    selectMove(e) {
      // find the difference between the moves relative to the div position. create a temporary position
      // this.action.x_start/y_start mouse click to start moving select re:this.div
      // this.action.x_end/y_end mouse click where mouse currently is re:this.div
      // this.action.top2/left2  current, temporary position of div re:image.canvas
      if (this.move(e)) { return; }
      if (!this.select_down) { return; }
      var i = PAINT.current_image;
      [this.action.x_end,this.action.y_end] = PAINT.getMouseXY(e);
      this.action.top2 = this.action.top - (this.action.y_start - this.action.y_end);
      this.action.left2 = this.action.left - (this.action.x_start - this.action.x_end);
      this.div.style.top = PAINT.zoom*this.action.top2-i.scrollY+"px";
      this.div.style.left = PAINT.zoom*this.action.left2-i.scrollX+"px";
    }
    selectUp(e) {
      // mouse released, set the div position to the temporary position
      this.up(e);
      this.selectMove(e);
      if (this.select_down) { [this.action.left,this.action.top] = [this.action.left2,this.action.top2]; }
      this.select_down = false;
      this.selectCut();
      this.action.context.drawImage(this.canvas,this.action.left,this.action.top);
      PAINT.current_image.redraw();
    }
    cut(e) {
      console.log("cut")
    }
    copy(e) {
      
    }
    paste(e) {
      
    }
    options(e) {
      return [
        { name: 'cut', icon: 'cut', click: this.cut },
        { name: 'copy',  icon: 'copy', click: this.copy },
        { name: 'paste',  icon: 'paste', click: this.paste }
      ]
    }
  }

  class ResizeTool extends Tool {
    constructor() {
      super({name: 'resize', title: 'Resize', icon: 'arrows'})
    }
  }

  class EyeDropperTool extends Tool {
    //#! TODO: with mouse depressed as you move it should select different colors until you release
    constructor() {
      super({name: 'eyeDropper', title: 'Select Color', icon: 'eyedropper'})
    }
    move(e) {

    }
    down(e) {
      super.down(e);
      var [x,y] = [this.action.x1,this.action.y1];
      var pixel_position = 4*(y*PAINT.current_image.WIDTH + x);
      var hex_color = "#"+rgbToHex(getPixelColor(x,y));
      var which = (e.button==0)?"fg":"bg";
      var input = document.querySelector(`[name=${which}]`);
      input.value=hex_color;
      PAINT.changeTool(PAINT.last_tool,true);
      PAINT.addMessage(`Changing ${which} color to ${hex_color}`);
    }
  }

  class ZoomTool extends Tool {
    constructor() {
      super({name: 'zoom', title: 'Change Zoom', icon: 'search-plus'})
      this.zooms = [1,2,3,4,5];
    }
    select(e) {
      var i = this.zooms.indexOf(PAINT.zoom)+1;
      if (i == this.zooms.length) { i = 0 }
      PAINT.changeTool(PAINT.last_tool,true);
      PAINT.updateZoom(this.zooms[i]);
    }
  }

  PAINT.TOOL_LIST = [
    new New(),
    new Open(),
    new Save(),
    new SaveAs(),
    new Upload(),
    new Download(),
    {},
    new BrushTool(),
    new FillTool(),
    new SelectTool(),
    new RectTool(),
    new CircleTool(),
    new ResizeTool(),
    new EyeDropperTool(),
    new ZoomTool(),
    {},
    {},
  ];
  PAINT.TOOLS = {}
  for (var i=0;i<PAINT.TOOL_LIST.length;i++) {
    var t = PAINT.TOOL_LIST[i];
    if (!t) { continue }
    PAINT.TOOLS[t.name] = t;
  }
  window.addEventListener('mouseup',function(){window.MOUSE_DOWN = false;});
})()
