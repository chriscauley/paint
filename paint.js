var WIDTH = 500;
var HEIGHT = 400;

var actions = new Array();
function reset_canvas() {
  actions = new Array();
  redraw();
}

var mouse_down = false;

var active_color, active_size, alpha, current_action;
var background_color = "white";

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

var canvas = document.getElementById('paint');
canvas.setAttribute('width', WIDTH);
canvas.setAttribute('height', HEIGHT);
context = canvas.getContext("2d");

function canvas_click(e) {
  mouse_down = true;
  current_action = { coords: [], color: active_color, size: active_size, alpha: alpha };
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
    context.drawImage(action.canvas,0,0);
  }
}
