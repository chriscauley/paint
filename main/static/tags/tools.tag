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
  this.left_tools = [
    {name: 'new', title: 'New Image', icon: 'file-o', className: ''},
    {name: 'open', title: 'Open Image', icon: 'folder-open-o', className: ''},
    {name: 'upload', title: 'Upload Image', icon: 'upload', className: ''},
    {name: 'save', title: 'Save Image', icon: 'floppy-o', className: ''},
    {name: 'saveAs', title: 'Save Image As', icon: 'floppy-o', className: 'save-as-new'},
    {},
    {name: 'brush', title: 'brush', icon: 'paint-brush', className: ''},
    {name: 'fill', title: 'fill', icon: '', className: 'fill-button'},
    {name: 'select', title: 'select', icon: '', className: 'select-button'},
    {name: 'rect', title: 'rectangle', icon: '', className: 'rect-button'},
    {name: 'circle', title: 'circle', icon: '', className: 'circle-button'},
    {name: 'resize', title: 'resize', icon: 'arrows', className: ''},
    {name: 'eye_dropper', title: 'select color', icon: 'eyedropper', className: ''},
  ]
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
