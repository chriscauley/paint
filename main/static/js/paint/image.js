window.PAINT = window.PAINT || {};

(function () {
  class Image {
    constructor(options) {
      PAINT.current_image = this;
      this.actions = options.actions || [];
      this.WIDTH = options.w;
      this.HEIGHT = options.h;
      $("body").append("<paint></paint>");
      riot.mount("paint");
    }
    init(tag) {// called after riot renders templates
      this.tag = tag;
      this.canvas = PAINT.canvas = tag.canvas;
      this.context = this.canvas.getContext('2d');
      this.canvas.width = this.WIDTH;
      this.canvas.height = this.HEIGHT;
      PAINT.changeTool('brush');
    }
    redraw() {
      this.context.clearRect(0, 0, this.WIDTH, this.HEIGHT);
      for (var i=0; i < this.actions.length; i++) {
        var action = this.actions[i];
        /*if (i == this.actions.length-1 && current_tool == "select") {
          // select has to be drawn inbetween frames
          selectDraw();
        }
        if (action.WIDTH != WIDTH || action.HEIGHT != HEIGHT) {
          // it's a resize
          WIDTH = action.WIDTH;
          HEIGHT = action.HEIGHT;
          resizeCanvas();
        }*/
        this.context.globalAlpha = (action.tool == "eraser")?1:action.alpha;
        this.context.drawImage(action.canvas,action.x0,action.y0);
      }
      // Save last actions canvas for future load
      /*if (current_action) { current_action.dataURL = canvases[canvases.length-1].toDataURL(); }*/
    }
  }
  PAINT.Image = Image;
})()
