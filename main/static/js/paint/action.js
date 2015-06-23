window.PAINT = window.PAINT || {};
(function() {
  PAINT.zoom = 10;
  function _r(number) { return Math.floor(number/PAINT.zoom) }
  PAINT.getMouseXY = function getMouseXY(e) {
    var _cr = PAINT.display_canvas.getBoundingClientRect();
    return [_r(e.pageX - _cr.left), _r(e.pageY - _cr.top)]
  }
  PAINT.updateZoom = function updateZoom() {
    var c = PAINT.display_canvas,ctx;
    c.width = PAINT.canvas.width*PAINT.zoom;
    c.height = PAINT.canvas.height*PAINT.zoom;
    ctx = PAINT.display_context = PAINT.display_canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
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
