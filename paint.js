var WIDTH = 500;
var HEIGHT = 400;
var canvas = document.getElementById('paint'),context;
var wrapper = document.getElementById("wrapper");

var actions = new Array();
var mouse_down = false;

var fg_color, bg_color, active_size, alpha, current_action;
var current_tool = "brush";

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
      document.removeEventListener("mousemove",selectionMouseMove);
      this.selection.parentNode.removeChild(this.selection);
    }
  };
  actions.push(current_action);
  redraw();
}

function createElement(type,options) {
  var element = document.createElement(type);
  for (key in options) { element[key] = options[key] }
  return element;
}

function createButtons() {
  var tools = document.getElementById("tools");
  var brush = createElement("button",{
    title: "brush",
    className: "fa fa-paint-brush",
    name: "brush"
  });
  brush.addEventListener("click",changeTool("brush"));
  tools.appendChild(brush);

  var select = createElement("button",{
    title: "select",
    className: "select-button",
    name: "select"
  });
  select.addEventListener("click",changeTool("select"));
  tools.appendChild(select);

  var tools_bot = document.getElementById("tools_bot");
  var fg_picker = createElement("input",{
    value: "#cb3594",
    type: "color",
    className: "color-picker fg"
  });
  function setFG() { fg_color = fg_picker.value; }
  setFG();
  fg_picker.addEventListener("change",setFG.bind(fg_picker));
  tools_bot.appendChild(fg_picker);

  var bg_picker = createElement("input",{
    value: "#FFFFFF",
    type: "color",
    className: "color-picker bg"
  });
  function setBG() { bg_color = bg_picker.value; }
  setBG();
  bg_picker.addEventListener("change",setBG.bind(bg_picker));
  tools_bot.appendChild(bg_picker);

  var size_picker = createElement("input",{
    id: "size_picker",
    size: 2,
    value: 4,
  });
  function setSize() { active_size = size_picker.value; }
  setSize();
  size_picker.addEventListener("change",setSize.bind(size_picker));
  tools.appendChild(size_picker);

  var container = createElement("div",{className: "alpha-container"});
  var alpha_picker = createElement("input",{
    type: "range",
    max: "1",
    min: "0",
    step: "0.01",
    value: "1"
  });
  var alpha_display = createElement("span",{className: "fg_alpha"});
  container.appendChild(alpha_display);
  container.appendChild(alpha_picker);
  function setAlpha() { alpha = alpha_picker.value; alpha_display.innerHTML = alpha; }
  setAlpha();
  alpha_picker.addEventListener("input",setAlpha.bind(alpha_picker));
  tools_bot.appendChild(container);
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

function canvasClick(e) {
  e.preventDefault();
  mouse_down = true;
  current_action = {
    color: (e.button==0)?fg_color:bg_color,
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
  current_action.context.imageSmoothingEnabled = false;
  canvasMove(e);
}

function canvasMove(e) {
  if(mouse_down){
    brush(current_action,e.layerX, e.layerY);
    redraw();
  }
};

canvas.addEventListener("mousedown",canvasClick.bind(canvas));
canvas.addEventListener('contextmenu', function(e) {e.preventDefault();});
canvas.addEventListener("mousemove",canvasMove.bind(canvas));
canvas.addEventListener("mouseup",function() { mouse_down = false; })
canvas.addEventListener("mouseout",function() { mouse_down = false; })

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function brush(action,x,y) {
  var context = action.context;
  var coords = [];
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
    context.putImageData(image_data,
                         Math.round(coords[i][0]-action.size/2),
                         Math.round(coords[i][1]-action.size/2));
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
