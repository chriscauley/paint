<tools>
  <div id="tools" class="border-box">
    <div each={ left_tools }>
      <button class={ className } title={ title } name={ name } if={ name } onclick={ parent.click }>
        <i class="fa fa-{ icon }" if={ icon }></i></button>
      <hr style="clear:both;" if={ !name }/>
    </div>
  </div>
  <div id="tools_bot">
    <div id="action_list"></div>
    <input type="color" class="color-picker" name="fg" value={ colors.fg }>
    <input type="color" class="color-picker" name="bg" value={ colors.bg }>
    <div class="alpha-container">
      <input type="range" max="1" min="0" step="0.01"><span class="fg_alpha">1</span>
    </div>
  </div>
  this.left_tools = window.PAINT.TOOL_LIST;
  this.colors = {
    fg: "#cb3594",
    bg: "#ffffff",
  }

  click(e) {
    var name = e.item.name
    $("#tools .active").removeClass("active")
    $("[name="+name+"]").addClass("active")
    changeTool(name)
  }
</tools>
