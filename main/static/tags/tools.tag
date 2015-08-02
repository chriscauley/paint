<tools>
  <div id="tools" class="border-box">
    <div each={ left_tools } class={clear:!name}>
      <button class="pure-button { className }" title={ title } name={ name } if={ name } onclick={ parent.click }>
        <i class="fa fa-{ icon }" if={ icon }></i></button>
    </div>
    <div class="options">
      <div each={ options }>
        <label if={ label } for="{ id }">{ label }</label>
        <button class="pure-button" title={ title } name={ name } if={ is_button } onclick={ click }>
          <i class="fa fa-{ icon }" if={ icon }></i></button>
        <input if={ is_number} type="number" value={ value } max={ max } min={ min } id={ id }/>
      </div>
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
      <div class="pure-u-1-4" id="mouse1"></div>
      <div class="pure-u-1-4" id="mouse2"></div>
      <div class="pure-u-1-4" id="mouse3"></div>
      <div class="pure-u-1-4"></div>
    </div>
  </div>
  var PAINT = window.PAINT
  this.left_tools = PAINT.TOOL_LIST;
  this.colors = {
    fg: "#cb3594",
    bg: "#ffffff",
  }

  click(e) {
    PAINT.changeTool(e.item.name);
  }
  this.on("update",function() {
    this.options = PAINT.current_tool.options();
  });
</tools>
