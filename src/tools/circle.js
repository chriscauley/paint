PAINT.CircleTool = class CircleTool extends PAINT.ShapeTool {
  constructor() {
    super({name: 'circle', title: 'Ellipse', className: 'circle-button'})
    this.bounding = true;
  }
  drawShape(ctx, x, y, w, h) {
    function clog() {
      console.log(Array.prototype.slice.call(arguments).join(","));
    }
    // from http://stackoverflow.com/questions/2172798/how-to-draw-an-oval-in-html5-canvas
    var kappa = .5522848,
    ox = Math.round((w / 2) * kappa), // control point offset horizontal
    oy = Math.round((h / 2) * kappa), // control point offset vertical
    xe = x + w,           // x-end
    ye = y + h,           // y-end
    xm = Math.round(x + w / 2),       // x-middle
    ym = Math.round(y + h / 2);       // y-middle
    //clog(x,y,w,h,ox,oy,xe,ye,xm,ym)
    ctx.beginPath();
    ctx.moveTo(x, ym);
    ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
    ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
    //ctx.closePath(); // not used correctly, see comments (use to close off open path)
    ctx.fill();
  }
}
