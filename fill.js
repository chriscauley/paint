function getPixelColor(pixel_position,color_layer) {
  if (!color_layer) { color_layer = context.getImageData(0,0,WIDTH,HEIGHT); }
  return {
    r: color_layer.data[pixel_position + 0],
    g: color_layer.data[pixel_position + 1],
    b: color_layer.data[pixel_position + 2]
  }
}

function eyeDropperClick(e) {
  getMouseXY(e);
  var x = mouseX;
  var y = mouseY;
  pixel_position = 4*(y*WIDTH + x);
  var hex_color = "#"+rgbToHex(getPixelColor(pixel_position));
  var input = document.querySelector(".color-picker."+((e.button==0)?"fg":"bg"));
  input.value=hex_color;
  changeTool(last_tool);
}

function rgbToHex(o) {return toHex(o.r)+toHex(o.g)+toHex(o.b)}
function toHex(n) {
  n = parseInt(n,10);
  if (isNaN(n)) return "00";
  n = Math.max(0,Math.min(n,255));
  return "0123456789ABCDEF".charAt((n-n%16)/16)
    + "0123456789ABCDEF".charAt(n%16);
}

function fillClick(e) {
  var current_pixel, pixel_position, reach_left, reach_right;
  var color_layer = context.getImageData(0,0,WIDTH,HEIGHT);
  getMouseXY(e);
  var pixel_stack = [[mouseX,mouseY]];
  var fill_color = hexToRgb(current_action.color);
  var x = mouseX;
  var y = mouseY;
  pixel_position = 4*(y*WIDTH + x);
  var start_color = {
    r: color_layer.data[pixel_position + 0],
    g: color_layer.data[pixel_position + 1],
    b: color_layer.data[pixel_position + 2]
  }

  function matchStartColor(pixel_position) {
    var r = color_layer.data[pixel_position];
    var g = color_layer.data[pixel_position+1];
    var b = color_layer.data[pixel_position+2];

    return (r == start_color.r && g == start_color.g && b == start_color.b);
  }

  function colorPixel(pixel_position) {
    color_layer.data[pixel_position] = fill_color.r;
    color_layer.data[pixel_position+1] = fill_color.g;
    color_layer.data[pixel_position+2] = fill_color.b;
    color_layer.data[pixel_position+3] = 255; //#! TODO make this alpha
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
        }
        else if (reach_left) {
          reach_left = false;
        }
      }
      
      if (x < WIDTH-1) {
        if (matchStartColor(pixel_position + 4)) {
          if (!reach_right) {
            pixel_stack.push([x + 1, y]);
            reach_right = true;
          }
        }
        else if (reach_right) {
          reach_right = false;
        }
      }
      
      pixel_position += WIDTH * 4;
    }
  }
  context.putImageData(color_layer, 0, 0);
  finishAction();
}
  
