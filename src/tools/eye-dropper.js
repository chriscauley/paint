PAINT.EyeDropperTool = class EyeDropperTool extends PAINT.Tool {
  //#! TODO: with mouse depressed as you move it should select different colors until you release
  constructor() {
    super({name: 'eye-dropper', title: 'Select Color', icon: 'eyedropper'})
  }
  move(e) {
    super.move(e);
    var [x,y] = PAINT.getMouseXY(e);
    PAINT.debug.status['mouse2'] = this.hex_color = "#"+rgbToHex(getPixelColor(x,y));
  }
  down(e) {
    super.down(e);
    var which = (e.button==0)?"fg":"bg";
    var input = document.querySelector(`[name=${which}]`);
    input.value = this.hex_color;
    PAINT.changeTool(PAINT.last_tool,true);
    delete PAINT.current_image.actions.pop();
    PAINT.addMessage(`Changing ${which} color to ${this.hex_color}`);
  }
}
