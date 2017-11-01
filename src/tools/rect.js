PAINT.RectTool = class RectTool extends PAINT.ShapeTool {
  constructor() {
    super({name: 'rect', title: 'Rectangle', className: 'rect-button'})
    this.bounding = true;
  }
  drawShape(ctx,x,y,w,h) {
    ctx.rect(x,y,w,h)
  }
}
