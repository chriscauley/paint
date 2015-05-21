window.PAINT = window.PAINT || {};
(function() {
  PAINT.changeTool = function(name) {
    $("#tools .active").removeClass("active");
    $("[name="+name+"]").addClass("active");
    PAINT.current_tool = PAINT.TOOLS[name];
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
      if (this.mouse_down) { console.log(this.name) }
    }
    up(e) {
      this.mouse_down = false;
    }
    down(e) {
      this.mouse_down = true;
      var action = new PAINT.Action(e);
      if (PAINT.current_action) {
        PAINT.current_action.destroy();
      }
      PAINT.current_image.actions.push(action);
      PAINT.current_action = action;
    }
  }

  class NewTool extends Tool {
    constructor() {
      super({name: 'new', title: 'New Image', icon: 'file-o'})
    }
  }

  class OpenTool extends Tool {
    constructor() {
      super({name: 'open', title: 'Open Image', icon: 'folder-open-o'})
    }
  }

  class UploadTool extends Tool {
    constructor() {
      super({name: 'upload', title: 'Upload Image', icon: 'upload'})
    }
  }

  class SaveTool extends Tool {
    constructor() {
      super({name: 'save', title: 'Save Image', icon: 'floppy-o'})
    }
  }

  class SaveAsTool extends Tool {
    constructor() {
      super({name: 'saveAs', title: 'Save Image As', icon: 'floppy-o', className: 'save-as-new'})
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
    }
    move(e) {
      if (!this.mouse_down) { return; }
      var action = PAINT.current_action;
      var context = action.context;
      var _m = PAINT.getMouseXY(e);
      var [x,y] = [_m.x,_m.y];
      if (this.last_x && this.last_y) {
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
      this.last_x = x;
      this.last_y = y;

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
      super({name: 'fill', title: 'Fill Bucket (replace color)', className: 'fill-button'})
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
    new NewTool(),
    new OpenTool(),
    new UploadTool(),
    new SaveTool(),
    new SaveAsTool(),
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
})()
