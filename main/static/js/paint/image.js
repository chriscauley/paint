window.PAINT = window.PAINT || {};

(function () {
  class Image {
    constructor(options) {
      if (PAINT.current_image) { PAINT.current_image.tag.unmount(); }
      PAINT.current_image = this;
      this.dataURL = options.dataURL;
      this.actions = options.actions || [];
      this.WIDTH = options.w;
      this.HEIGHT = options.h;
      $("body").append("<paint></paint>");
      riot.mount("paint");
    }
    init(tag) {// called after riot renders templates
      this.tag = tag;
      this.canvas = PAINT.canvas = document.createElement("canvas");
      this.context = this.canvas.getContext('2d');
      this.canvas.width = this.WIDTH;
      this.canvas.height = this.HEIGHT;
      PAINT.display_canvas = tag.display;
      PAINT.updateZoom();
      PAINT.changeTool('brush');
      this._redraw_proxy = this._redraw.bind(this);
      if (!this.dataURL) {
        this.context.fillStyle = "#fff"; // should get from form
        this.context.beginPath();
        this.context.rect(0,0,this.WIDTH,this.HEIGHT);
        this.context.fill();
        this.context.closePath();
        this.dataURL = this.canvas.toDataURL();
      }
      if (this.dataURL) {
        // load image from data url
        var that = this;
        this.imageObj = document.createElement("img");
        this.imageObj.onload = function() {
          var i = PAINT.current_image;
          i.canvas.width = i.WIDTH = this.width;
          i.canvas.height = i.HEIGHT = this.height;
          PAINT.updateZoom();
          that.redraw();
        };
        this.imageObj.src = this.dataURL;
      }
      this._img = document.getElementById("_img");
    }
    redraw() {
      cancelAnimationFrame(this.active_frame);
      this.active_frame = requestAnimationFrame(this._redraw_proxy);
    }
    _redraw() {
      this.context.clearRect(0, 0, this.WIDTH, this.HEIGHT);
      if (this.imageObj) { this.context.drawImage(this.imageObj,0,0); }
      for (var i=0; i < this.actions.length; i++) {
        var action = this.actions[i];
        this.context.globalAlpha = (action.tool == "eraser")?1:action.alpha;
        this.context.drawImage(action.canvas,action.x0,action.y0);
      }
      // Save last actions canvas for future load
      /*if (current_action) { current_action.dataURL = canvases[canvases.length-1].toDataURL(); }*/
      var z = PAINT.zoom;
      var canvas = PAINT.display_canvas;
      var context = PAINT.display_context;
      context.clearRect( 0, 0, canvas.width, canvas.height );
      var scale = PAINT.zoom;
      context.drawImage(PAINT.canvas, 0, 0, (this.WIDTH * scale)|0, (this.HEIGHT * scale)|0 );
    }
    toJSON() {
      return {
        'name': this.name,
        'dataURL': this.canvas.toDataURL(),
      }
    }
  }
  PAINT.Image = Image;
})()
