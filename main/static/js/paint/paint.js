//depracated file, moving into es6 files in same dir

function PaintImage(options) {
  this.w = options.width || 100;
  this.h = options.height || 100;
  this.canvas = options.canvas;
  this.context = this.canvas.getContext("2d");
  this.actions = options.actions || [];
  this.colors = options.colors || {};
  this.colors.fg = this.colors.fg || "#000";
  this.colors.bg = this.colors.bg || "#FFF";
  this.colors.fga = 1;
  this.colors.bga = 1;

  this.getMouseXY = function(e) {
    var _cr = canvas.getBoundingClientRect();
    this.mouse.x = e.pageX - _cr.left;
    this.mouse.y = e.pageY - _cr.top;
  }

  this.selectTool = function(name) {
    this.activeTool = this.tools[name];
  }

}

var WIDTH = 500;
var HEIGHT = 400;
var canvas = document.getElementById('paint'),context;
var wrapper = document.getElementById("wrapper");

var actions = new Array();
var mouse_down = false;

var fg_color, bg_color, active_size, alpha, current_action, select_div, current_image,last_tool;
var canvases, contexts;
var mouseX, mouseY, mouse_target;
var current_tool = "brush";

function openImage(url) {
  var img = document.createElement("img");
  img.src = url;
  img.addEventListener("load",function() {
    canvas.width = img.width;
    canvas.height = img.height;
    resetCanvas();
    var img2 = document.createElement("img");
    img2.src = img.toDataURL();
    pasteImage(img2);
  });
}

function selectDown(e) { // select box was clicked
  mouse_down = true;
  getMouseXY(e);
  current_action.keep = true;
  mouse_target = select_div;
  current_action.click_x = mouseX;
  current_action.click_y = mouseY;
  selectMove(e);
}

function selectMove(e) {
  if (!mouse_down) { return }
  getMouseXY(e);
  if (mouse_target == select_div) { // select area is being moved
    current_action.move_x = mouseX;
    current_action.move_y = mouseY;
    current_action.delta_x = current_action.move_x - current_action.click_x;
    current_action.delta_y = current_action.move_y - current_action.click_y;
    select_div.style.left = current_action.dx + current_action.delta_x +"px";
    select_div.style.top = current_action.dy + current_action.delta_y +"px";
    redraw();
  } else { // select area is being created
    alterSelectionDiv(current_action.x1,current_action.y1,null,null,mouseX,mouseY);
  }
}

function selectDraw() {
  contexts[contexts.length-1].clearRect(0,0,WIDTH,HEIGHT);  
  var sx = current_action.sx;
  var sy = current_action.sy;
  var sw = dw = current_action.dw;
  var sh = dh = current_action.dh;
  var dx = current_action.dx+current_action.delta_x;
  var dy = current_action.dy+current_action.delta_y;
  contexts[contexts.length-1].fillStyle = bg_color;
  contexts[contexts.length-1].beginPath();
  contexts[contexts.length-1].rect(sx,sy,sw,sh);
  contexts[contexts.length-1].fill();
  contexts[contexts.length-1].closePath();
  contexts[contexts.length-1].drawImage(canvas,sx,sy,sw,sh,dx,dy,dw,dh);
}
function selectUp(e) {
  mouse_down = false;
  mouse_target = null;
  current_action.dx = current_action.dx + current_action.delta_x;
  current_action.dy = current_action.dy + current_action.delta_y;
  current_action.delta_x = current_action.delta_y = 0;
}

function createSelectionDiv() {
  select_div = document.createElement("div")
  select_div.className = "select";
  select_div.id = "select-div";
  select_div.style.display = "none";
  select_div.addEventListener("mousedown",selectDown)
  select_div.addEventListener("mouseup",selectUp)
  select_div.addEventListener("mousemove",selectMove)
  wrapper.appendChild(select_div);
  return select_div;
}

function alterSelectionDiv(x,y,w,h,x2,y2) {
  // modifies selection div and updates action attributes to match
  if (x2) { w = x2-x; }
  if (y2) { h = y2-y; }
  w = Math.min(w,WIDTH-x);
  w = Math.max(w,-x+2);
  if (w < 0) {
    x = x + w;
    w = -w;
  }
  h = Math.min(h,HEIGHT-y);
  h = Math.max(h,-y+2);
  if (h < 0) {
    y = y + h;
    h = -h;
  }
  current_action.dx = x;
  current_action.dy = y;
  current_action.dw = w;
  current_action.dh = h;
  if (!current_action.keep) {
    current_action.sx = x;
    current_action.sy = y;
    current_action.sw = w;
    current_action.sh = h;
  }
  select_div.style.width = w + "px";
  select_div.style.height = h + "px";
  select_div.style.top = y + "px";
  select_div.style.left = x + "px";
}

createSelectionDiv();

function changeTool(tool_name) {
  if (tool_name == "resize") { openResizeDialog(); return; }
  if (tool_name == "new") { newImage(); return; }
  if (tool_name == "open") { startOpenImage(); return; }
  if (tool_name == "save") { saveImage(); return; }
  if (tool_name == "saveAs") { saveStartAs(); return; }
  if (tool_name == "upload") { upload(); return; }

  if (current_action) { current_action.destroy() }
  last_tool = current_tool; // used for eye dropper
  current_tool = tool_name;
  if (document.querySelector("#tools .active") != null) {
    document.querySelector("#tools .active").classList.remove("active");
  }
  var e = document.querySelector("#tools [name="+tool_name+"]");
}

function pasteImage(img,x,y) {
  x = x || 0;
  y = y || 0;
  changeTool("select");
  current_action = new CanvasAction({});
  actions.push(current_action);
  context = contexts[contexts.length-1];
  contexts[0].drawImage(img,x,y);
  redraw();
}

function init() {
  createButtons();
  resetCanvas()
}
function resizeCanvas() {
  canvas.setAttribute('width', WIDTH);
  canvas.setAttribute('height', HEIGHT);
  wrapper.style.width = 2+WIDTH+"px";
  wrapper.style.height = 2+HEIGHT+"px";
}
function resetCanvas() {
  resizeCanvas();
  context = canvas.getContext("2d");
  context.beginPath();
  context.fillStyle = "white";
  context.rect(0,0,WIDTH,HEIGHT);
  context.fill();
  context.closePath();
  context.imageSmoothingEnabled = false;
  current_action = undefined;
  current_image = {
    actions: actions,
    width: WIDTH,
    height: HEIGHT
  }
  canvases = [];
  contexts = [];
}
init();

function rectMove(e) {
  if(!mouse_down){ return; }
  var action = current_action;
  getMouseXY(e);
  action.x2 = mouseX;
  action.y2 = mouseY;
  var w = action.x2-action.x1;
  var h = action.y2-action.y1;
  contexts[contexts.length-1].clearRect(0,0,WIDTH,HEIGHT);
  contexts[contexts.length-1].fillStyle = action.color;
  contexts[contexts.length-1].beginPath();
  contexts[contexts.length-1].rect(action.x1,action.y1,w,h);
  contexts[contexts.length-1].fill();
  contexts[contexts.length-1].closePath();
  redraw();
}

function circleMove(e) {
  if(!mouse_down){ return; }
  var action = current_action;
  getMouseXY(e);
  action.x2 = mouseX;
  action.y2 = mouseY;
  var w = action.x2-action.x1;
  var h = action.y2-action.y1;
  contexts[contexts.length-1].fillStyle = action.color;
  contexts[contexts.length-1].clearRect(0,0,WIDTH,HEIGHT);
  drawEllipse(contexts[contexts.length-1],current_action.x1,current_action.y1,w,h)
  redraw();
}

function brushMove(e) {
  if(!mouse_down){ return; }
  var action = current_action;
  var context = contexts[contexts.length-1];
  var coords = [];
  getMouseXY(e);
  var x = mouseX,y = mouseY;
  if (action.last_x && action.last_y) {
    dx = x - action.last_x;
    dy = y - action.last_y;
    distance = Math.sqrt(dx*dx+dy*dy);
    for (var i=0;i<distance;i++) {
      coords.push([
        action.last_x+i*dx/distance,
        action.last_y+i*dy/distance
      ]);
    }
  }
  coords.push([x,y]);
  action.last_x = x;
  action.last_y = y;
  var image_data = context.createImageData(action.size,action.size);
  rgb = hexToRgb(action.color);
  for (var i=0;i<image_data.data.length/4;i++) {
    image_data.data[i*4+0] = rgb.r;
    image_data.data[i*4+1] = rgb.g;
    image_data.data[i*4+2] = rgb.b;
    image_data.data[i*4+3] = 255;
  }
  for (var i=0;i<coords.length;i++) {
    window._id = image_data;
    context.putImageData(
      image_data,
      Math.round(coords[i][0]-action.size/2),
      Math.round(coords[i][1]-action.size/2)
    );
  }

  redraw();
}

function CanvasAction(e) {
  var action;
  if ('tool' in e) { // restoring action from saved action JSON
    action = e;
  } else { // building new action from event
    getMouseXY(e);
    action = {
      tool: current_tool,
      x: 0,
      y: 0,
      WIDTH: WIDTH,
      HEIGHT: HEIGHT,
      destroy: function() {},
    }
    // these two are used for select, rect, and circle
    action.x1 = action.x2 = mouseX;
    action.y1 = action.y2 = mouseY;
    // these three are currently used for brush, rect and circle
    action.color = (e.button==0)?fg_color:bg_color;
    action.color2 = (e.button==0)?bg_color:fg_color;
    action.size = active_size;
    action.alpha = alpha;
  }

  if (current_action) { current_action.destroy() }
  if (current_action) {
    var box = document.getElementById("action_list");
    var img = document.createElement("img");
    img.src = canvases[canvases.length-1].toDataURL();
    box.insertBefore(img,box.firstChild);
  }

  var _c = document.createElement("canvas");
  _c.setAttribute('width', WIDTH);
  _c.setAttribute('height', HEIGHT);
  var _ctx = _c.getContext("2d");

  _ctx.imageSmoothingEnabled = false;
  canvases.push(_c);
  contexts.push(_ctx);
  //document.body.appendChild(_c);
  if (action.dataURL) { // creating action from memory, draw to canvas
    var imageObj = new Image();
    _ctx.setAlpha(action.alpha);
    imageObj.src = action.dataURL;
    imageObj.onload = function() { _ctx.drawImage(imageObj, 0, 0); redraw(); };
  }

  if (current_tool == "select") {
    select_div.style.display = "block";
    document.addEventListener("mousemove",selectMove);
    canvas.removeEventListener("mouseout",canvasOut);
    action.keep = false;
    action.delta_x = action.delta_y = 0;
    current_action.destroy() = function() {
      select_div.style.display = "none";
      canvas.addEventListener("mouseout",canvasOut);
      document.removeEventListener("mousemove",selectMove);
      if (!current_action.keep) {
        actions.pop();
        delete contexts.pop();
        delete canvases.pop();
        delete current_action;
        current_action = undefined;
      }
    }
  }
  return action;
}

function canvasClick(e) {
  e.preventDefault();
  if (current_tool == "eye_dropper") { eyeDropperClick(e); return; }
  mouse_down = true;
  current_action = new CanvasAction(e);
  actions.push(current_action);
  if (current_tool == "fill") { fillClick(e) }
  else { canvasMove(e); }
}

function canvasMove(e) {
  if (!current_action) { return; }
  if (current_tool == "brush") {
    brushMove(e);
  } else if (current_tool == "rect") {
    rectMove(e);
  } else if (current_tool == "circle") {
    circleMove(e);
  } else if (current_tool == "select") {
    selectMove(e)
  }
}

canvas.addEventListener("mousedown",canvasClick.bind(canvas));
canvas.addEventListener('contextmenu', function(e) {e.preventDefault();});
canvas.addEventListener("mousemove",canvasMove.bind(canvas));
canvas.addEventListener("mouseup",function() { mouse_down = false; })
function canvasOut(e) { mouse_down = false; }
canvas.addEventListener("mouseout",canvasOut);

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function redraw() {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
  for (var i=0; i < actions.length; i++) {
    var action = actions[i];
    if (i == actions.length-1 && current_tool == "select") {
      // select has to be drawn inbetween frames 
      selectDraw();
    }
    if (action.WIDTH != WIDTH || action.HEIGHT != HEIGHT) {
      // it's a resize
      WIDTH = action.WIDTH;
      HEIGHT = action.HEIGHT;
      resizeCanvas();
    }
    context.globalAlpha = action.alpha;
    if (action.tool == "eraser") { context.setAlpha(1); }
    context.drawImage(canvases[i],action.x,action.y);
  }

  // Save last actions canvas for future load
  if (current_action) { current_action.dataURL = canvases[canvases.length-1].toDataURL(); }
}

function finishAction() {
  contexts[contexts.length-1].drawImage(canvas,0,0);
  redraw();
}
