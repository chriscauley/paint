PAINT.ResizeTool = class ResizeTool extends PAINT.Tool {
  constructor() {
    super({name: 'resize', title: 'Resize', icon: 'arrows'})
  }
}

<resize>
  <div each={ spots } class={ className } onmousedown={ parent.down }></div>

  this.spots = [];
  var _h  = ['left','center-h','right'];
  var _v  = ['top','center-v','bottom'];
  for (var hi=0;hi<3;hi++) {
    for (var vi=0;vi<3;vi++) {
      if (hi==1 && vi==1) { continue }
      this.spots.push({className: "spot " + _h[hi] + " " + _v[vi],vi:vi,hi:hi});
    }
  }
  this.h = opts.h;
  this.w = opts.w;
  down(e) {
    var listeners = [];
    var x0 = e.x, y0 = e.y;
    var target = e.target.parentElement;
    var xattr = _h[e.item.hi], yattr = _v[e.item.vi];
    var w = PAINT.current_image.WIDTH, h = PAINT.current_image.HEIGHT;
    target.dataset.size = w + "x" + h;
    function allDone(e) {
      document.removeEventListener('mousemove',mouseMove);
      document.removeEventListener('mouseup',allDone);
    }
    function mouseMove(e) {
      target.style[xattr] = (x0-e.x)+"px";
      target.style[yattr] = (y0-e.y)+"px";
      target.dataset.size = (w + x0-e.x) + "x" + (h + y0-e.y);
    };
    document.addEventListener('mousemove',mouseMove);
    document.addEventListener('mouseup',allDone);
  }
</resize>
