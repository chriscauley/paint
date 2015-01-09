// Misc functions used in all files. Mostly shortcuts using browser functions.
// All should stand alone with no global variables.

function createElement(type,options) {
  var element = document.createElement(type);
  for (key in options) {
    if (key == "parent") {
      options[key].appendChild(element);
    } else if (key == "innerHTML") {
      element.innerHTML = options[key]
    } else if (key == "style") {
      for (prop in options[key]) { element.style[prop] = options[key][prop]; }
    } else {
      element[key] = options[key]
    }
  }
  return element;
}

function drawEllipse(ctx, x, y, w, h) {
  // from http://stackoverflow.com/questions/2172798/how-to-draw-an-oval-in-html5-canvas
  var kappa = .5522848,
      ox = (w / 2) * kappa, // control point offset horizontal
      oy = (h / 2) * kappa, // control point offset vertical
      xe = x + w,           // x-end
      ye = y + h,           // y-end
      xm = x + w / 2,       // x-middle
      ym = y + h / 2;       // y-middle

  ctx.beginPath();
  ctx.moveTo(x, ym);
  ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
  ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
  ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
  ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
  //ctx.closePath(); // not used correctly, see comments (use to close off open path)
  ctx.fill();
}
