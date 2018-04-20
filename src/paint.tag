<paint>
  <div class="canvas-wrapper" onscroll={ scroll }>
    <div class="canvas-inner active">
      <div class="canvas">
        <canvas onmousedown={ down } onmouseup={ up } onmousemove={ move } onmouseover={ over } onmouseout={ out }
                ref="display" onmousewheel={ scroll }></canvas>
        <div class="select" onmouseup={ selectUp } onmousedown={ selectDown } onmousemove={ selectMove }
             onmousewheel={ scroll }></div>
      </div>
    </div>
  </div>

  over(e) {
    PAINT.current_tool.mouseover(e);
  }
  down(e) {
    PAINT.current_tool.mousedown(e);
  }
  move(e) {
    PAINT.current_tool.mousemove(e)
  }
  up(e) {
    PAINT.current_tool.mouseup(e);
  }
  out(e) {
    PAINT.current_tool.mouseout(e);
  }
  selectUp(e) {
    PAINT.current_tool.selectUp(e);
  }

  selectDown(e) {
    PAINT.current_tool.selectDown(e);
  }

  selectMove(e) {
    PAINT.current_tool.selectMove(e);
  }
  scroll(e) {
    PAINT.current_image.scroll(e);
    PAINT.current_image.redraw();
    return e
  }

  this.on('mount',function(){PAINT.current_image.init(this);})
  this.root.oncontextmenu = function() { return false; }
</paint>
