<paint>
  <div class="canvas-wrapper">
    <canvas width={ w } height={ h } onmousedown={ down } onmouseup={ up } onmousemove={ move } onmouseover={ over }
            name="canvas"></canvas>
  </div>

  this.h = opts.h || 100;
  this.w = opts.w || 100;
  move(e) {
    PAINT.current_tool.move(e);
  }
  down(e) {
    PAINT.current_tool.down(e);
  }
  up(e) {
    PAINT.current_tool.up(e);
  }
  over(e) {
    PAINT.current_tool.over(e);
  }
  this.on('mount',function(){PAINT.current_image.init(this)})
</paint>
