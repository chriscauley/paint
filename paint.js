var WIDTH = 500;
var HEIGHT = 400;

var actions = new Array();
function reset_canvas() {
  actions = new Array();
  redraw();
}

function load_image(url) {
  var img = document.createElement("img");
  img.src = url;
  img.addEventListener("load",function() {
    reset_canvas();
    paste_image(img);
  });
}

function selectionMouseMove(e) {
  if (!mouse_down) { return }
  div.style.left = current_action.old_x - (current_action.click_x - e.pageX) +"px";
  div.style.top = current_action.old_y - (current_action.click_y - e.pageY) +"px";
  current_action.x = current_action.old_x - (current_action.click_x - e.pageX);
  current_action.y = current_action.old_y - (current_action.click_y - e.pageY);
  redraw();
}

function selectionMouseDown(e) {
  mouse_down = true;
  current_action.click_x = e.pageX;
  current_action.click_y = e.pageY;
  current_action.old_x = current_action.x;
  current_action.old_y = current_action.y;
}

function selectionMouseUp(e) {
  mouse_down = false;
}

function createSelectionDiv(x,y,w,h) {
  div = document.createElement("div")
  div.className = "select";
  div.style.width = w + "px";
  div.style.height = h + "px";
  div.style.top = y + "px";
  div.style.left = x + "px";
  div.addEventListener("mousedown",selectionMouseDown)
  div.addEventListener("mouseup",selectionMouseUp)
  document.addEventListener("mousemove",selectionMouseMove);
  wrapper.appendChild(div);
  return div;
}

function changeTool(tool_name) {
  if (current_action && current_action.destroy) { current_action.destroy(); }
  current_tool = tool_name;
}

function paste_image(img,x,y) {
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
      console.log("destroyed");
      document.removeEventListener("mousemove",selectionMouseMove);
      this.selection.parentNode.removeChild(this.selection);
    }
  };
  actions.push(current_action);
  redraw();
}

var mouse_down = false;

var active_color, active_size, alpha, current_action;
var background_color = "white";
var current_tool = "brush";

var color_picker = document.getElementById("color_picker");
function setColor() { active_color = color_picker.value; }
setColor();
color_picker.addEventListener("change",setColor.bind(color_picker));

var size_picker = document.getElementById("size_picker");
function setSize() { active_size = size_picker.value; }
setSize();
size_picker.addEventListener("change",setSize.bind(size_picker));

var alpha_picker = document.getElementById("alpha_picker");
var alpha_display = document.getElementById("alpha_display");
function setAlpha() { alpha = alpha_picker.value; alpha_display.innerHTML = alpha; }
setAlpha();
//alpha_picker.addEventListener("change",setAlpha.bind(alpha_picker));

var canvas = document.getElementById('paint'),context;
var wrapper = document.getElementById("wrapper");

function init() {
  canvas.setAttribute('width', WIDTH);
  canvas.setAttribute('height', HEIGHT);
  wrapper.style.width = 2+WIDTH+"px";
  wrapper.style.height = 2+HEIGHT+"px";
  context = canvas.getContext("2d");
}

init();

function canvas_click(e) {
  mouse_down = true;
  current_action = {
    coords: [],
    color: active_color,
    size: active_size,
    alpha: alpha,
    tool: current_tool,
    x: 0,
    y: 0
  };
  actions.push(current_action);
  current_action.canvas = document.createElement("canvas");
  current_action.canvas.setAttribute('width', WIDTH);
  current_action.canvas.setAttribute('height', HEIGHT);
  current_action.context = current_action.canvas.getContext("2d");
  canvas_move(e);
}

function canvas_move(e) {
  if(mouse_down){
    current_action.coords.push([e.layerX,e.layerY]);
    brush(current_action);
    redraw();
  }
};

canvas.addEventListener("mousedown",canvas_click.bind(canvas));
canvas.addEventListener("mousemove",canvas_move.bind(canvas));
canvas.addEventListener("mouseup",function() { mouse_down = false; })
canvas.addEventListener("mouseout",function() { mouse_down = false; })

function brush(action) {
  var context = action.context;
  context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
  context.lineJoin = "round";
  context.strokeStyle = action.color;
  if (action.tool == "eraser") {
    context.strokeStyle = background_color;
  }
  var last = [action.coords[0][0]-1,action.coords[0][1]];
  for (var ai=0; ai<action.coords.length; ai++) {
    context.beginPath();
    context.moveTo(last[0],last[1]);
    xy = action.coords[ai];
    context.lineTo(xy[0],xy[1]);
    context.closePath();
    context.lineWidth = action.size;
    context.stroke();
    context.closePath();
    last = xy;
  }
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
