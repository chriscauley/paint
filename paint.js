var WIDTH = 500;
var HEIGHT = 400;
var canvas = document.getElementById('paint'),context;
var wrapper = document.getElementById("wrapper");

var actions = new Array();
var mouse_down = false;

var fg_color, bg_color, active_size, alpha, current_action, select_div,mouseX, mouseY, mouse_target;
var current_tool = "brush";

function getMouseXY(e) {
  var _cr = canvas.getBoundingClientRect();
  mouseX = e.pageX - _cr.left;
  mouseY = e.pageY - _cr.top;
}

function resetCanvas() {
  actions = new Array();
  redraw();
}

function fetchImage(url) {
  var img = document.createElement("img");
  img.src = url;
  img.addEventListener("load",function() {
    pasteImage(img);
  });
}

function openImage(url) {
  var img = document.createElement("img");
  img.src = url;
  img.addEventListener("load",function() {
    canvas.width = img.width;
    canvas.height = img.height;
    resetCanvas();
    pasteImage(img);
  });
}

function selectDown(e) { // select box was clicked
  mouse_down = true;
  getMouseXY(e);
  current_action.keep = true;
  mouse_target = select_div;
  current_action.click_x = mouseX;
  current_action.click_y = mouseY;
  current_action.old_x = current_action.x1;
  current_action.old_y = current_action.y1;
  var sx = dx = current_action.x1;
  var sy = dy = current_action.y1;
  var sw = dw = current_action.x1-current_action.x2;
  var sh = dh = current_action.y1-current_action.y2;
  current_action.context.drawImage(canvas,sx,sy,sw,sh,dx,dy,dw,dh);
  select_div.style.backgroundImage = "url("+canvas.toDataURL()+")";
  select_div.style.backgroundPosition = -sx + "px " + -sy + "px";
  console.log(-sx + "px " + -sy + "px");
}

function selectUp(e) { mouse_down = false; mouse_target = null; }

function selectMove(e) {
  if (!mouse_down) { return }
  getMouseXY(e);
  if (mouse_target == select_div) { // select area is being moved
    select_div.style.left = current_action.old_x - (current_action.click_x - mouseX) +"px";
    select_div.style.top = current_action.old_y - (current_action.click_y - mouseY) +"px";
    current_action.x1 = current_action.old_x - (current_action.click_x - mouseX);
    current_action.y1 = current_action.old_y - (current_action.click_y - mouseY);
    current_action.context.clearRect(0,0,WIDTH,HEIGHT);
    redraw();
  } else { // select area is being created
    alterSelectionDiv(current_action.x1,current_action.y1,null,null,mouseX,mouseY);
  }
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
  select_div.style.width = w + "px";
  select_div.style.height = h + "px";
  select_div.style.top = y + "px";
  select_div.style.left = x + "px";
}

createSelectionDiv();

function changeTool(tool_name) {
  if (current_action && current_action.destroy) { current_action.destroy(); }
  current_tool = tool_name;
  if (document.querySelector("#tools .active") != null) {
    document.querySelector("#tools .active").classList.remove("active");
  }
  document.querySelector("#tools [name="+tool_name+"]").classList.add("active");
}

function pasteImage(img,x,y) {
  x = x || 0;
  y = y || 0;
  changeTool("select");
  current_action = {
    x: 0,
    y: 0,
    type: "paste",
    canvas: img,
    alpha: 1,
    selection: createSelectionDiv(x,y,img.width,img.height),
    destroy: function() {
      document.removeEventListener("mousemove",selectMove);
      this.selection.parentNode.removeChild(this.selection);
    }
  };
  actions.push(current_action);
  redraw();
}

function init() {
  createButtons();
  canvas.setAttribute('width', WIDTH);
  canvas.setAttribute('height', HEIGHT);
  wrapper.style.width = 2+WIDTH+"px";
  wrapper.style.height = 2+HEIGHT+"px";
  context = canvas.getContext("2d");
  context.imageSmoothingEnabled = false;
}
init();

function brushMove(e) {
  if(!mouse_down){ return; }
  var action = current_action;
  var context = action.context;
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
  action = {
    tool: current_tool,
    x: 0,
    y: 0
  }
  if (current_action && current_action.destroy) { current_action.destroy(); }
  getMouseXY(e);
  var x = mouseX, y = mouseY;
  if (current_tool == "brush") {
    action.color = (e.button==0)?fg_color:bg_color
    action.size = active_size
    action.alpha = alpha
    action.move = brushMove;
  } else if (current_tool == "select") {
    action.move = selectMove;
    select_div.style.display = "block";
    select_div.style.backgroundImage = "";
    action.x1 = action.x2 = x;
    action.y1 = action.y2 = y;
    document.addEventListener("mousemove",selectMove);
    canvas.removeEventListener("mouseout",canvasOut);
    action.keep = false;
    action.destroy = function() {
      canvas.addEventListener("mouseout",canvasOut);
      document.removeEventListener("mousemove",selectMove);
      if (!current_action.keep) { actions.pop(); }
    }
  }
  action.canvas = document.createElement("canvas");
  action.canvas.setAttribute('width', WIDTH);
  action.canvas.setAttribute('height', HEIGHT);
  action.context = action.canvas.getContext("2d");
  action.context.imageSmoothingEnabled = false;
  return action;
}

function canvasClick(e) {
  e.preventDefault();
  mouse_down = true;
  current_action = new CanvasAction(e);
  actions.push(current_action);
  current_action.move(e);
}

function canvasMove(e) {
  if (!!current_action) { current_action.move(e); }
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
    context.setAlpha(action.alpha);
    if (action.tool == "eraser") { context.setAlpha(1); }
    context.drawImage(action.canvas,action.x,action.y);
  }
}
