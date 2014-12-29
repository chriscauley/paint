var WIDTH = 500;
var HEIGHT = 400;

var actions = new Array();
function reset_canvas() {
  actions = new Array();
  redraw();
}

var mouse_down = false;

var active_color, active_size;
var background_color = "white";

var color_picker = document.getElementById("color_picker");
function setColor() { active_color = color_picker.value; }
setColor();
color_picker.addEventListener("change",setColor.bind(color_picker));

var size_picker = document.getElementById("size_picker");
function setSize() { active_size = size_picker.value; }
setSize();
size_picker.addEventListener("change",setSize.bind(size_picker));


var canvas = document.getElementById('paint');
canvas.setAttribute('width', WIDTH);
canvas.setAttribute('height', HEIGHT);
context = canvas.getContext("2d");

function canvas_click(e) {
  var mouseX = e.pageX - this.offsetLeft;
  var mouseY = e.pageY - this.offsetTop;
  mouse_down = true;
  addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
  redraw();
}

function canvas_move(e) {
  if(mouse_down){
    addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
    redraw();
  }
};

canvas.addEventListener("mousedown",canvas_click.bind(canvas));
canvas.addEventListener("mousemove",canvas_move.bind(canvas));
canvas.addEventListener("mouseup",function() { mouse_down = false; })
canvas.addEventListener("mouseout",function() { mouse_down = false; })

function addClick(x, y, dragging) {
  actions.push({x:x,y:y,dragging:dragging,color:active_color,size:active_size})
}

function redraw() {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas

  context.lineJoin = "round";

  var last;
  for (var i=0; i < actions.length; i++) {
    var action = actions[i];
    context.beginPath();
    if (action.dragging && last) {
      context.moveTo(last.x, last.y);
    } else {
      context.moveTo(action.x-1, action.y);
    }
    context.lineTo(action.x, action.y);
    context.closePath();
    context.strokeStyle = action.color;
    if (action.tool == "eraser") {
      context.strokeStyle = background_color;
    }
    context.lineWidth = action.size;
    context.stroke();
    var last = action;
  }
}
