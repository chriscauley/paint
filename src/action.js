window.PAINT = window.PAINT || {};
(function() { //zoom stuff probably doesn't belong in this file
  PAINT.zoom = 1;
  function _r(number) { return Math.floor(number/PAINT.zoom) }
  PAINT.getMouseXY = function getMouseXY(e) {
    var _cr = PAINT.display_canvas.getBoundingClientRect();
    var i = PAINT.current_image;
    if (!e.pageX) { return [0,0] } //fake click
    return [_r(e.pageX - _cr.left + i.scrollX), _r(e.pageY - _cr.top + i.scrollY)]
  }
  PAINT.updateZoom = function updateZoom(new_zoom) {
    // This was invaluable: http://stackoverflow.com/questions/23271093/scale-images-with-canvas-without-blurring-it
    // fiddle: http://jsfiddle.net/epistemex/VsZFb/2/
    var c = PAINT.display_canvas;
    var wrapper = document.querySelector(".canvas-wrapper");
    var paint = document.querySelector("paint");
    var h = paint.scrollHeight - 17;
    var w = paint.scrollWidth - 17;
    var px = (wrapper.scrollLeft+w/2)/PAINT.zoom;
    var py = (wrapper.scrollTop+h/2)/PAINT.zoom;
    PAINT.zoom = new_zoom || PAINT.zoom;
    c.width = w; //Math.min(w,PAINT.canvas.width*PAINT.zoom);
    c.height = h; //Math.min(h,PAINT.canvas.height*PAINT.zoom);
    console.log(1);
    wrapper.scrollLeft = px*PAINT.zoom-w/2;
    wrapper.scrollTop = py*PAINT.zoom-h/2;
    var ctx = PAINT.display_context = PAINT.display_canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    var i = document.querySelector("#tools [name=zoom]");
    if (i) { i.dataset.level = PAINT.zoom; }
    PAINT.current_image.redraw();
  }
})();

(function() {
  class Action {
    // A json serializable/parsable class that stores each action
    constructor(data) {
      this.x0 = data.x0 || 0
      this.y0 = data.y0 || 0;
      if ('tool_name' in data) { //restoring old action from json
        this.tool_name = data.tool_name;
      } else { // new action, data is mouse click
        var fg = document.querySelector('tools [name=fg]').value;
        var bg = document.querySelector('tools [name=bg]').value;
        [this.color,this.color2] = (data.button==0)?[fg,bg]:[bg,fg];
        this.tool = PAINT.current_tool;
      }
      this.canvas = document.createElement('canvas');
      this.canvas.width = PAINT.current_image.WIDTH;
      this.canvas.height = PAINT.current_image.HEIGHT;
      this.context = this.canvas.getContext('2d');
      this.context.imageSmoothingEnabled = false;
      this.context.mozImageSmoothingEnabled = false;
      this.alpha = document.getElementById("alpha").value;
      if (this.dataURL) {
        var img = document.createElement('img');
        img.src = this.dataURL;
        context.drawImage(img);
      }
      if (PAINT.current_action) { PAINT.current_action.destroy(); }
      PAINT.current_image.actions.push(this);
      PAINT.current_action = this;
    }
    destroy() {
      if (this.tool && this.tool.name == "select") { this.tool.div.style.display = "none"; }
    }
    toJSON() {
      return {
        dataURL: this.canvas.toDataURL(),
        x0: this.x0,
        y0: this.y0
      }
    }
  }
  PAINT.Action = Action;
})()
