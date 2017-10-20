PAINT.FillTool = class FillTool extends PAINT.Tool {
  constructor() {
    super({name: 'fill', title: 'Fill (replace color)', className: 'fill-button'});
    PAINT.color_distance = 0;
  }
  options(e) {
    return [{is_number: true, value:PAINT.color_distance, min: 0, max:50, step: 1, label:"Distance", name: "color_distance"}]
  }
  down(e) {
    super.down(e);
    var WIDTH = PAINT.current_image.WIDTH, HEIGHT = PAINT.current_image.HEIGHT;
    PAINT.color_distance = document.getElementById("id_color_distance").value;
    var [x,y] = [this.action.x1,this.action.y1];
    var pixel_stack = [[x,y]];
    var fill_color = hexToRgb(this.action.color);
    var color_layer = PAINT.current_image.context.getImageData(0,0,WIDTH,HEIGHT);
    var cld = color_layer.data;
    var final_layer = PAINT.current_image.context.getImageData(0,0,WIDTH,HEIGHT);
    var fld = final_layer.data;
    var i = fld.length;
    while (i--) { fld[i] = 0 }
    var _c = hexToRgb(this.action.color);
    var fill_color = [_c.r, _c.g, _c.b, 255]; // Alpha is handled when image is redrawn
    var pixel_position = 4*(y*WIDTH + x);
    function getColor(data, p) { return [data[p],data[p+1],data[p+2],data[p+3]] }
    var target_color = getColor(cld,pixel_position);
    function sameColor(c1,c2) {
      return (c1[0] == c2[0] && c1[1] == c2[1] && c1[2] == c2[2] && c1[3] == c2[3]);
    }
    function diffColor(c1,c2) {
      return (c1[0] != c2[0] || c1[1] != c2[1] || c1[2] != c2[2] || c1[3] != c2[3]);
    }
    var ds2 = Math.pow(PAINT.color_distance/100*256,2); // color threshold distance (squared)
    function matchColorDistance(c1,c2) {
      // ds1: magintude difference between two target color and pixel color (squared)
      var ds1 = Math.pow((c2[0]-c1[0]),2) +
        Math.pow(c2[1]-c1[1],2) +
        Math.pow(c2[2]-c1[2],2) +
        Math.pow(c2[3]-c1[3],2);
      return !isNaN(ds1) && ds1 <= ds2;
    }
    if (ds2 == 0) {
      // if we're not measuring color distance, diffColor is ~5% faster
      matchColorDistance = function(c1,c2) { return !diffColor(c1,c2); }
    }
    while (pixel_stack.length) {
      [x,y] = pixel_stack.pop();
      pixel_position = 4*(y*WIDTH + x);
      var node_color = getColor(cld,pixel_position);
      if (!matchColorDistance(node_color,target_color)) { continue }
      // this next line only matters if fill_color and target_color are within the matchColorDistance
      if (sameColor(node_color,fill_color)) { return; }
      cld[pixel_position] = fill_color[0];
      cld[pixel_position+1] = fill_color[1];
      cld[pixel_position+2] = fill_color[2];
      cld[pixel_position+3] = fill_color[3];
      fld[pixel_position] = fill_color[0];
      fld[pixel_position+1] = fill_color[1];
      fld[pixel_position+2] = fill_color[2];
      fld[pixel_position+3] = fill_color[3];

      if (x != 0) { pixel_stack.push([x-1,y]); }
      if (x != WIDTH) { pixel_stack.push([x+1,y]); }
      if (y != 0) { pixel_stack.push([x,y-1]); }
      if (y != HEIGHT) { pixel_stack.push([x,y+1]); }
    }
    this.action.context.clearRect(0,0,WIDTH,HEIGHT);
    this.action.context.putImageData(final_layer, 0, 0);
    PAINT.current_image.redraw();
  }
  down2(e) {
    // first attempt at alorightm. Left here for later reference
    super.down(e)
    var WIDTH = PAINT.current_image.WIDTH, HEIGHT = PAINT.current_image.HEIGHT;
    var current_pixel, pixel_position, reach_left, reach_right;
    var color_layer = PAINT.current_image.context.getImageData(0,0,WIDTH,HEIGHT);
    var cld = color_layer.data;
    var final_layer = PAINT.current_image.context.getImageData(0,0,WIDTH,HEIGHT);
    var fld = final_layer.data;
    var i = fld.length;
    while (i--) { fld[i] = 0 }
    var [x,y] = [this.action.x1,this.action.y1];
    var pixel_stack = [[x,y]];
    var fill_color = hexToRgb(this.action.color);
    var alphas = [];
    PAINT.color_distance = document.getElementById("id_color_distance").value;
    var ds2 = Math.pow(PAINT.color_distance/100*256,2); // color threshold distance (squared)
    pixel_position = 4*(y*WIDTH + x);
    var start_color = {
      r: cld[pixel_position + 0],
      g: cld[pixel_position + 1],
      b: cld[pixel_position + 2],
      a: cld[pixel_position + 3]
    }

    function matchStartColor(pixel_position) {
      var r = cld[pixel_position];
      var g = cld[pixel_position+1];
      var b = cld[pixel_position+2];
      var a = cld[pixel_position+3];

      return (a == start_color.a && r == start_color.r && g == start_color.g && b == start_color.b);
    }
    function matchColorDistance(pixel_position) {
      var a = cld[pixel_position+3];
      if (isNaN(a)) { return false; }
      var r = cld[pixel_position];
      var g = cld[pixel_position+1];
      var b = cld[pixel_position+2];
      var c1 = start_color;

      // ds1: magintude difference between two target color and pixel color (squared)
      var ds1 = Math.pow((a-c1.a),2) + Math.pow(r-c1.r,2) + Math.pow(g-c1.g,2) + Math.pow(b-c1.b,2);
      return !isNaN(ds1) && ds1 <= ds2;
    }
    function colorPixel(pixel_position) {
      cld[pixel_position] = fill_color.r;
      cld[pixel_position+1] = fill_color.g;
      cld[pixel_position+2] = fill_color.b;
      cld[pixel_position+3] = 'a'; // this is so there's no way we can hit the same pixel twice
      fld[pixel_position] = fill_color.r;
      fld[pixel_position+1] = fill_color.g;
      fld[pixel_position+2] = fill_color.b;
      fld[pixel_position+3] = 'a'; // this is so there's no way we can hit the same pixel twice
      alphas.push(pixel_position+3); // this is so we can correct the above later
    }
    while (pixel_stack.length) {
      current_pixel = pixel_stack.pop();
      x = current_pixel[0], y = current_pixel[1];
      pixel_position = 4*(y*WIDTH + x);
      while (y-- >= 0 && matchColorDistance(pixel_position)) {
        pixel_position -= 4*WIDTH;
      }
      pixel_position += 4*WIDTH;
      y++;
      reach_left = false;
      reach_right = false;
      while (y++ < HEIGHT-1 && matchColorDistance(pixel_position)) {
        colorPixel(pixel_position);

        if (x > 0) {
          if (matchColorDistance(pixel_position - 4)) {
            if (!reach_left) {
              pixel_stack.push([x - 1, y]);
              reach_left = true;
            }
          } else if (reach_left) { reach_left = false; }
        }

        if (x < WIDTH-1) {
          if (matchColorDistance(pixel_position + 4)) {
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
      fld[alphas[i]] = 255; //#! TODO make this alpha
    }
    this.action.context.clearRect(0,0,WIDTH,HEIGHT);
    this.action.context.putImageData(final_layer, 0, 0);
    PAINT.current_image.redraw();
  }
  up(e) {
    super.up(e);
    PAINT.storage.autoSave();
  }
}
