<paint>
  <div class="canvas-wrapper" onscroll={ scroll }>
    <div class="canvas-inner active">
      <canvas onmousedown={ down } onmouseup={ up } onmousemove={ move } onmouseover={ over } onmouseout={ out }
              name="display"></canvas>
      <div class="select" onmouseup={ selectUp } onmousedown={ selectDown } onmousemove={ selectMove }></div>
      <div class="resizer"></div>
      <!--<resize></resize>-->
    </div>
  </div>

  riot.mount("resize",{})
  down(e) {
    document.addEventListener(PAINT.current_tool.move(e));
    PAINT.current_tool.down(e);
  }
  move(e) {
    PAINT.current_tool.move(e)
  }
  up(e) {
    PAINT.current_tool.up(e);
  }
  over(e) {
    PAINT.current_tool.over(e);
  }
  out(e) {
    PAINT.current_tool.out(e);
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
    PAINT.current_image.scroll(e)
    return e
  }

  this.on('mount',function(){PAINT.current_image.init(this)})
  this.root.oncontextmenu = function() { return false; }
</paint>
