<tools>
  <div id="tools" class="border-box">
    <div each={ left_tools }>
      <button class="{ className }" title="{ name }" name="{ name }" each={ . }>
        <i class="fa fa-{ icon }" if={ icon }></i></button>
      <hr style="clear:both;"/>
    </div>
  </div>
  <div id="tools_bot">
    <div id="action_list"></div>
    <input type="color" class="color-picker" name="fg" can-value="colors.fg">
    <input type="color" class="color-picker" name="bg" can-value="colors.bg">
    <div class="alpha-container">
      <input type="range" max="1" min="0" step="0.01"><span class="fg_alpha">1</span>
    </div>
  </div>
</tools>
