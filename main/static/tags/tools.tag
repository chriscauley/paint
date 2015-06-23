<tools>
  <div id="tools" class="border-box">
    <div each={ left_tools }>
      <button class="pure-button { className }" title={ title } name={ name } if={ name } onclick={ parent.click }>
        <i class="fa fa-{ icon }" if={ icon }></i></button>
      <hr style="clear:both;" if={ !name }/>
    </div>
  </div>
  <div id="tools_bot">
    <div id="logs"></div>
    <input type="color" class="color-picker" name="fg" value={ colors.fg }>
    <input type="color" class="color-picker" name="bg" value={ colors.bg }>
    <div class="alpha-container">
      <input type="range" max="1" min="0" step="0.01"><span class="fg_alpha">1</span>
    </div>
    <div id="status" class="pure-g">
      <div class="pure-u-1-6" id="mouse1"></div>
      <div class="pure-u-1-6" id="mouse2"></div>
      <div class="pure-u-1-6" id="mouse3"></div>
      <div class="pure-u-1-6"></div>
      <div class="pure-u-1-6"></div>
    </div>
  </div>
  var PAINT = window.PAINT
  this.left_tools = PAINT.TOOL_LIST;
  this.colors = {
    fg: "#cb3594",
    bg: "#ffffff",
  }

  click(e) {
    PAINT.changeTool(e.item.name)
  }
</tools>
