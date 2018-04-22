PAINT.BrushTool = class BrushTool extends PAINT.Tool {
  constructor() {
    super({name: 'brush', title: 'Paint Brush', icon: 'paint-brush'})
  }
  options() {
  }
  down(e) {
    this.drawn_until = 0;
    this.action.coords = [];
    this.action.size = 1; //#!TODO eventually use size selector
    this.last = false;
    this.move(e);
  }
  out(e) {
    this.move(e);
  }
  over(e) {
    this.move(e);
  }
  move(e) {
    if (!this.mouse_down) { return }
    var context = this.action.context;
    var [x,y] = PAINT.getMouseXY(e);
    if (this.last) {
      var dx = x - this.last_x;
      var dy = y - this.last_y;
      var distance = Math.sqrt(dx*dx+dy*dy);
      for (var i=0;i<distance;i++) {
        this.action.coords.push([
          this.last_x+i*dx/distance,
          this.last_y+i*dy/distance
        ]);
      }
    }
    this.action.coords.push([x,y]);
    [this.last_x,this.last_y,this.last] = [x,y,true];

    var image_data = context.createImageData(this.action.size,this.action.size);
    var rgb = hexToRgb(this.action.color);
    for (var i=0;i<image_data.data.length/4;i++) {
      image_data.data[i*4+0] = rgb.r;
      image_data.data[i*4+1] = rgb.g;
      image_data.data[i*4+2] = rgb.b;
      image_data.data[i*4+3] = 255; //#!TODO eventually use alpha selector
    }
    for (var i=this.drawn_until;i<this.action.coords.length;i++) {
      window._id = image_data;
      context.putImageData(
        image_data,
        Math.round(this.action.coords[i][0]-this.action.size/2),
        Math.round(this.action.coords[i][1]-this.action.size/2)
      );
      this.drawn_until = i;
    }
    PAINT.current_image.redraw();
  }
  up(e) {
    super.up(e);
    PAINT.gallery.autoSave();
  }
}
