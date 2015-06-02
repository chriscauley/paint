<paint>
  <div class="canvas-wrapper">
    <div class="canvas-inner active">
      <canvas width={ w } height={ h } onmousedown={ down } onmouseup={ up } onmousemove={ move } onmouseover={ over }
              name="canvas"></canvas>
      <!--<resize></resize>-->
    </div>
  </div>

  riot.mount("resize",{})
  down(e) {
    document.addEventListener(PAINT.current_tool.move(e));
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
