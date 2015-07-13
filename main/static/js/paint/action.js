window.PAINT = window.PAINT || {};
(function() {
  PAINT.zoom = 1;
  function _r(number) { return Math.floor(number/PAINT.zoom) }
  PAINT.getMouseXY = function getMouseXY(e) {
    var _cr = PAINT.display_canvas.getBoundingClientRect();
    var i = PAINT.current_image;
    return [_r(e.pageX - _cr.left + i.scrollX), _r(e.pageY - _cr.top + i.scrollY)]
  }
  PAINT.updateZoom = function updateZoom(new_zoom) {
    // This was invaluable: http://stackoverflow.com/questions/23271093/scale-images-with-canvas-without-blurring-it
    // fiddle: http://jsfiddle.net/epistemex/VsZFb/2/
    var c = PAINT.display_canvas,ctx;
    var wrapper = $(".canvas-wrapper");
    var h = $("paint").height() - 17;
    var w = $("paint").width() - 17;
    var px = (wrapper.scrollLeft()+w/2)/PAINT.zoom;
    var py = (wrapper.scrollTop()+h/2)/PAINT.zoom;
    PAINT.zoom = new_zoom || PAINT.zoom;
    c.width = Math.min(w,PAINT.canvas.width*PAINT.zoom);
    c.height = Math.min(h,PAINT.canvas.height*PAINT.zoom);
    $(".canvas-inner .resizer").css({height: PAINT.canvas.height*PAINT.zoom,width:PAINT.canvas.width*PAINT.zoom});
    wrapper.scrollLeft(px*PAINT.zoom-w/2)
    wrapper.scrollTop(py*PAINT.zoom-h/2)
    ctx = PAINT.display_context = PAINT.display_canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    var i = document.querySelector("#tools [name=zoom]");
    if (i) { i.dataset.level = PAINT.zoom; }
    PAINT.current_image.redraw();
  }
  class Action {
    // A json serializable/parsable class that stores each action
    constructor(data,previous_action) {
      this.x0 = this.y0 = 0;
      if ('tool' in data) { //restoring old action from json
        this.data = data;
        this.tool = Paint.tools[this.data.tool];
      } else { // new action, data is mouse click
        var fg = $('tools [name=fg]').val();
        var bg = $('tools [name=bg]').val();
        [this.color,this.color2] = (data.button==0)?[fg,bg]:[bg,fg];
        this.tool = PAINT.current_tool;
      }
      this.canvas = document.createElement('canvas');
      this.canvas.width = PAINT.current_image.WIDTH;
      this.canvas.height = PAINT.current_image.HEIGHT;
      this.context = this.canvas.getContext('2d');
      //$(".canvas-wrapper").append(this.canvas);
      if (PAINT.current_action) { PAINT.current_action.destroy(); }
      PAINT.current_image.actions.push(this);
      PAINT.current_action = this;
    }
    destroy() {
      if (this.tool.name == "select") { this.tool.div.style.display = "none"; }
    }
  }
  PAINT.Action = Action;
})()
