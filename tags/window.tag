<download-image>
  <modal title="Download mofo" src={ opts.src }>
    <div class="download-image">
      <a href={ opts.src } download="img.png" class="download"><img src="{ opts.src }" /></a>
      <div>Right click the above image and...</div>
      <li>To save to disc, select "Save Image As..."</li>
      <li>To embed in a website, select "Copy Image URL"</li>
    </div>
  </modal>

  <style>
    .download img { max-height: 500px; }
  </style>
</download-image>

<window>
  <div class="mask" onclick={ cancel }></div>
  <div class="content" onkeyup={ press }>
    <div class="title-bar border-box">{ opts.title }</div>
    <div class="download-image" if={ opts.src }>
      <a href={ opts.src } download="img.png"><img src="{ opts.src }" /></a>
      <div>Right click the above image and...</div>
      <li>To save to disc, select "Save Image As..."</li>
      <li>To embed in a website, select "Copy Image URL"</li>
    </div>
    <div class="file-list" if={ items }>
      <div class="file" each={ items }>
        <div class="options">
          <i class="fa fa-caret-square-o-down trigger" onclick={ parent.showOptions }></i>
          <div class="inner">
            <button class="pure-button" onclick={ parent.renameImage }>Rename</button>
            <button class="pure-button" onclick={ parent.deleteImage }>Delete</button>
          </div>
        </div>
        <div onclick={ parent.click }>
          <div class="img" style="background-image: url({ dataURL })"></div>
          <span>{ name }</span>
        </div>
      </div>
    </div>
    <div class="pure-form pure-form-aligned" if={ opts.form }>
      <div class="pure-control-group" each={ opts.form }>
        <label for={ _id } class=>{ title }</label>
        <input id={ _id } type={ type } value={ value } placeholder={ placeholder }>
      </div>
    </div>
    <div class="buttons border-box">
      <button class="pure-button button-error" if={ !opts.hide_cancel } onclick={ cancel }>Cancel</button>
      <button class="pure-button button-success" if={ !opts.hide_okay } onclick={ accept }>Okay</button>
    </div>
  </div>
  // this may need to be moved to the tool eventually

  this.on('update', function() {
    if (opts.getItems) {
      this.items = opts.getItems();
    }
  });
  if (opts.form) {
    for (var i=0;i<opts.form.length;i++) {
      opts.form[i]._id = "id_"+opts.form[i].name;
    }
  }
  click(e) {
    PAINT.current_tool.click(e,this);
  }
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
    setLastTool();
  }
  showOptions(e) {
    var closed = !e.srcElement.classList.contains("active");
    $(".trigger.active").removeClass("active");
    if (closed) { e.srcElement.classList.add('active'); }
  }
  deleteImage(e) {
    delete(PAINT.gallery[e.item.name]);
    this.update()
  }
  renameImage(e) {
    alert("Not Implimented");
  }
</window>
