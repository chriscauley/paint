window.PAINT = window.PAINT || {};
(function() {
  PAINT.changeTool = function(name) {
    $("#tools .active").removeClass("active");
    $("[name="+name+"]").addClass("active");
    var _t = ['saveAs','save','new','open'];
    if (PAINT.current_tool && _t.indexOf(this.current_tool.name) == -1) { PAINT.last_tool = this.current_tool.name; }
    PAINT.current_tool = PAINT.TOOLS[name];
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
  class Tool {
    constructor(options) {
      for (var key in options) { this[key] = options[key] }
    }
    move(e) {
      console.log('move');
      if (this.mouse_down) { console.log(this.name) }
    }
    up(e) {
      window.MOUSE_DOWN = this.mouse_down = false;
    }
    over(e) {
      this.mouse_down = window.MOUSE_DOWN;
    }
    down(e) {
      window.MOUSE_DOWN = this.mouse_down = true;
      var action = new PAINT.Action(e);
      if (PAINT.current_action) {
        PAINT.current_action.destroy();
      }
      PAINT.current_image.actions.push(action);
      PAINT.current_action = action;
    }
    select() {
      
    }
  }

  class DialogTool extends Tool {
    select() {
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
          {_name: 'width', title: 'Width', value: PAINT.current_image.WIDTH, type: 'number'},
          {_name: 'height', title: 'Height', value: PAINT.current_image.HEIGHT, type: 'number'}
        ]
      }
    }
    accept(tag) {
      new PAINT.Image({w:parseInt($("#id_width").val()),h:parseInt($("#id_height").val())});
      tag.unmount();
    }
  }

  class Open extends DialogTool {
    constructor() {
      super({name: 'open', title: 'Open Image', icon: 'folder-open-o'})
    }
    getWindowData() {
      var names = [];
      var items = [];
      for (var n in PAINT.gallery) { names.push(n) }
      names.sort()
      for (var i=0;i<names.length;i++) { items.push(PAINT.gallery[names[i]]) }
      return {
        title: "Open Image",
        items: items,
      }
    }
  }

  class Upload extends DialogTool {
    constructor() {
      super({name: 'upload', title: 'Upload Image', icon: 'upload'})
    }
  }

  class Save extends Tool {
    constructor() {
      super({name: 'save', title: 'Save Image', icon: 'floppy-o'})
    }
    select() {
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
          {_name: 'filename', title: 'Enter A Name', value: "", placeholder: 'Enter a name', type: 'text'},
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
    down(e) {
      super.down(e);
      PAINT.current_action.coords = [];
      PAINT.current_action.size = 1; //#!TODO eventually use size selector
      this.last = false
    }
    move(e) {
      if (!this.mouse_down) { return; }
      var action = PAINT.current_action;
      var context = action.context;
      var _m = PAINT.getMouseXY(e);
      var [x,y] = [_m.x,_m.y];
      if (this.last) {
        var dx = x - this.last_x;
        var dy = y - this.last_y;
        var distance = Math.sqrt(dx*dx+dy*dy);
        for (var i=0;i<distance;i++) {
          action.coords.push([
            this.last_x+i*dx/distance,
            this.last_y+i*dy/distance
          ]);
        }
      }
      action.coords.push([x,y]);
      [this.last_x,this.last_y,this.last] = [x,y,true];

      var image_data = context.createImageData(action.size,action.size);
      var rgb = hexToRgb(action.color);
      for (var i=0;i<image_data.data.length/4;i++) {
        image_data.data[i*4+0] = rgb.r;
        image_data.data[i*4+1] = rgb.g;
        image_data.data[i*4+2] = rgb.b;
        image_data.data[i*4+3] = 255; //#!TODO eventually use alpha selector
      }
      for (var i=0;i<action.coords.length;i++) {
        window._id = image_data;
        context.putImageData(
          image_data,
          Math.round(action.coords[i][0]-action.size/2),
          Math.round(action.coords[i][1]-action.size/2)
        );
      }
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
      var WIDTH = PAINT.current_image.WIDTH, HEIGHT = PAINT.current_image.HEIGHT;
      var current_pixel, pixel_position, reach_left, reach_right;
      var color_layer = PAINT.current_action.context.getImageData(0,0,WIDTH,HEIGHT);
      var _m = PAINT.getMouseXY(e);
      var [x,y] = [_m.x,_m.y];
      var pixel_stack = [[x,y]];
      var fill_color = hexToRgb(PAINT.current_action.color);
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
      PAINT.current_action.context.putImageData(color_layer, 0, 0);
      PAINT.current_image.redraw();
    }
  }

  class SelectTool extends Tool {
    constructor() {
      super({name: 'select', title: 'Select', className: 'select-button'})
    }
  }

  class RectTool extends Tool {
    constructor() {
      super({name: 'rect', title: 'Rectangle', className: 'rect-button'})
    }
  }

  class CircleTool extends Tool {
    constructor() {
      super({name: 'circle', title: 'Elipse', className: 'circle-button'})
    }
  }

  class ResizeTool extends Tool {
    constructor() {
      super({name: 'resize', title: 'Resize', icon: 'arrows'})
    }
  }

  class EyeDropperTool extends Tool {
    constructor() {
      super({name: 'eyeDropper', title: 'select color', icon: 'eyedropper'})
    }
  }

  PAINT.TOOL_LIST = [
    new New(),
    new Open(),
    new Save(),
    new SaveAs(),
    new Upload(),
    {},
    new BrushTool(),
    new FillTool(),
    new SelectTool(),
    new RectTool(),
    new CircleTool(),
    new ResizeTool(),
    new EyeDropperTool()
  ];
  PAINT.TOOLS = {}
  for (var i=0;i<PAINT.TOOL_LIST.length;i++) {
    var t = PAINT.TOOL_LIST[i];
    if (!t) { continue }
    PAINT.TOOLS[t.name] = t;
  }
  window.addEventListener('mouseup',function(){window.MOUSE_DOWN = false;});
})()
