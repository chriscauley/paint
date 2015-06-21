<paint>
  <div class="canvas-wrapper">
    <div class="canvas-inner active">
      <canvas width={ w } height={ h } onmousedown={ down } onmouseup={ up } onmousemove={ move } onmouseover={ over }
              onmouseout={ out } name="canvas"></canvas>
      <div class="select" click={ selectClick }></div>
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

  selectClick(e) {
    PAINT.current_action.selectClick(e);
  }

  selectMove(e) {
    PAINT.current_action.selectMove(e);
  }

  this.on('mount',function(){PAINT.current_image.init(this)})
  this.root.oncontextmenu = function() { return false; }
</paint>
