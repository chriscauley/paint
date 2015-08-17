window.PAINT = window.PAINT || {};

(function () {
  class Image {
    constructor(options) {
      if (PAINT.current_image) { PAINT.current_image.tag.unmount(); }
      PAINT.current_image = this;
      this.dataURL = options.dataURL;
      this.actions = [];
      // if this is loaded from a json, stash the actions so they can be loaded
      this._actions = options.actions || [];
      this.WIDTH = options.w;
      this.HEIGHT = options.h;
      this._redraw_proxy = this._redraw.bind(this);
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
      //PAINT.updateZoom(); // update display canvas
      for (var i=0;i<this._actions.length;i++) {
        this.actions.push(new PAINT.Action(this._actions[i]));
      }
      PAINT.changeTool('brush');
      if (!this.dataURL) { // new image
        this.context.fillStyle = "#fff"; // should get from form
        this.context.beginPath();
        this.context.rect(0,0,this.WIDTH,this.HEIGHT);
        this.context.fill();
        this.context.closePath();
        this.dataURL = this.canvas.toDataURL();
      }
      var that = this;
      this.imageObj = document.createElement("img");
      this.imageObj.src = this.dataURL;
      this.imageObj.onload = function() {
        var i = PAINT.current_image;
        i.canvas.width = i.WIDTH = this.width;
        i.canvas.height = i.HEIGHT = this.height;
        PAINT.current_image.scroll();

        // lame hack to make sure it draws properly on load.
        // I think this is because this event is firing before the image actually loads
        setTimeout(function() { PAINT.updateZoom(); },100)
      };
    }
    redraw() {
      if (!this._redraw_proxy) { return }
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
      context.drawImage(this.canvas,
                        this.scrollX/scale, this.scrollY/scale, this.WIDTH, this.HEIGHT, //sx,xy,sw,sh
                        0, 0, (this.WIDTH * scale)|0, (this.HEIGHT * scale)|0 //dx,dy,dw,dh
                       );
      if (PAINT.current_tool) { PAINT.current_tool.redraw(); }
    }
    scroll() {
      var w = $(".canvas-wrapper");
      this.scrollX = w.scrollLeft();
      this.scrollY = w.scrollTop();
    }
    toJSON() {
      var actions = [];
      //for (var i=0;i<this.actions.length;i++) {
      //  actions.push(this.actions[i].toJSON());
      //}
      return {
        'name': this.name,
        'dataURL': this.canvas.toDataURL(),
        'actions': actions,
      }
    }
  }
  PAINT.Image = Image;
  PAINT.loadNewOrAutoSave = function() {
    new PAINT.Image(PAINT.gallery.__autosave || {w:75,h:75});
  }
  $(window).resize(function() { PAINT.updateZoom(); } );
  document.addEventListener("keydown",function(e) {
    if (e.ctrlKey) {
      if (e.keyCode == 90) { // ctrl+z = undo
        PAINT.current_image.actions.pop();
        PAINT.current_action && PAINT.current_action.destroy();
        PAINT.current_image.redraw();
        return false;
      }
      if (e.keyCode == 65) { // ctrl+a = select all
        PAINT.changeTool("select")
        PAINT.current_tool.selectAll();
        return false;
      }
    }
  });
})()
