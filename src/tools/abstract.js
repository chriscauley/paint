window.PAINT = window.PAINT || {};
PAINT.changeTool = function(name,back) {
  document.querySelector("#tools .active") && document.querySelector("#tools .active").classList.remove("active");
  document.querySelector("[name="+name+"]").classList.add("active");
  var _t = ['saveAs','save','new','open','upload','download'];
  if (PAINT.current_tool && _t.indexOf(this.current_tool.name) == -1) { PAINT.last_tool = this.current_tool.name; }
  PAINT.current_tool = PAINT.TOOLS[name];
  if (PAINT.current_action && name != "zoom" && ! back) { PAINT.current_action.destroy(); }
  PAINT.current_tool.select();
  riot.update("tool");
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

PAINT.Tool = class Tool {
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

PAINT.DialogTool = class DialogTool extends PAINT.Tool {
  constructor(options) {
    super(options)
    this.tagName = "ur-form";
  }
  select() {
    super.select();
    uR.alertElement(this.tagName,this.getOpts());
  }
  accept(tag) {
  }
}

PAINT.ShapeTool = class ShapeTool extends PAINT.Tool {
  constructor(o) {
    super(o);
    this.thickness = 0;
  }
  options(e) {
    return [
      {is_number: true, name: "thickness", min: 0, step: 1, value: this.thickness, label: "Border"},
    ]
  }
  down(e) {
    this.thickness = document.getElementById("id_thickness").value;
    super.down(e);
  }
  up(e) {
    super.up(e);
    PAINT.storage.autoSave();
  }
  move(e) {
    if (!super.move(e)) { return; }
    var image = PAINT.current_image;
    var context = this.action.context;
    var t = parseInt(this.thickness);
    context.clearRect(0,0,image.WIDTH,image.HEIGHT);
    context.beginPath();
    context.fillStyle = this.action[t?"color2":"color"]; // use color2 if it needs a border
    this.drawShape(context,this.action.x1,this.action.y1,this.action.w,this.action.h);
    context.fill();
    context.closePath();

    // draw inner shape if necessary
    if (t != 0 && (Math.abs(this.action.w)) > 2*t && Math.abs(this.action.h) > 2*t) {
      context.beginPath();
      context.fillStyle = this.action.color;
      var w = this.action.w + 2*t*((this.action.w>0)?-1:1);
      var h = this.action.h + 2*t*((this.action.h>0)?-1:1);
      var x = this.action.x1 + t*((this.action.w<0)?-1:1);
      var y = this.action.y1 + t*((this.action.h<0)?-1:1);
      this.drawShape(context,x,y,w,h)
      context.fill();
      context.closePath();
    }
    PAINT.current_image.redraw();
  }
}

uR.ready(function() {
  PAINT.TOOL_LIST = [];
  uR.forEach(["Upload","Download","NewImage","",
              "BrushTool","FillTool","SelectTool","RectTool","CircleTool",/*"ResizeTool"*/,"EyeDropperTool","ZoomTool"],
             function(s) {
               if (!s) { PAINT.TOOL_LIST.push({}) }
               else { PAINT.TOOL_LIST.push(new PAINT[s]()) }
             });
  PAINT.TOOLS = {}
  for (var i=0;i<PAINT.TOOL_LIST.length;i++) {
    var t = PAINT.TOOL_LIST[i];
    if (!t) { continue }
    PAINT.TOOLS[t.name] = t;
  }
  window.addEventListener('mouseup',function(){window.MOUSE_DOWN = false;});

  //  {},
  //  {},
});
