<window>
  <div class="mask" onclick={ cancel }></div>
  <div class="content" onkeyup={ press }>
    <div class="title-bar border-box">{ opts.title }</div>
    <div class="pure-form pure-form-aligned" if={ opts.form }>
      <div class="pure-control-group" each={ opts.form }>
        <label>{ title }</label>
        <input id="id_{ _name }" type={ type } value={ value } placeholder={ placeholder }>
      </div>
    </div>
    <div class="buttons border-box">
      <button class="pure-button button-error" onclick={ cancel }>Cancel</button>
      <button class="pure-button button-success" onclick={ accept }>Okay</button>
    </div>
  </div>
  function setLastTool() {
    PAINT.changeTool(PAINT.last_tool);
  }
  press(event) {
    if (event.which == 13) {
      PAINT.current_tool.accept(this);
      return false;
    }
    if (event.which == 27) { this.unmount(); setLastTool(); }
    return true;
  }
  cancel(e) {
    this.unmount(); setLastTool();
  }
  accept(e) {
    PAINT.current_tool.accept(this);
  }
</window>
