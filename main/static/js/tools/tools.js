function getMouseXY(e) {
  var _cr = canvas.getBoundingClientRect();
  this.mouse.x = e.pageX - _cr.left;
  this.mouse.y = e.pageY - _cr.top;
}
class Tool {
  constructor(options) {
    this.name = options.name
  }
  move(e) {
    console.log('moving')
  }
  click(e) {
    console.log('clicked')
  }
  mouseup(e) {
    console.log('mouseup!')
  }
  mousedown(e) {
    console.log('mousedown!')
  }
}

class NewTool extends Tool {
  constructor() {
    super({name: 'new', title: 'New Image', icon: 'file-o'})
  }
}

class OpenTool extends Tool {
  constructor() {
    super({name: 'open', title: 'Open Image', icon: 'folder-open-o'})
  }
}

class UploadTool extends Tool {
  constructor() {
    super({name: 'upload', title: 'Upload Image', icon: 'upload'})
  }
}

class SaveTool extends Tool {
  constructor() {
    super({name: 'save', title: 'Save Image', icon: 'floppy-o'})
  }
}

class SaveAsTool extends Tool {
  constructor() {
    super({name: 'saveAs', title: 'Save Image As', icon: 'floppy-o', className: 'save-as-new'})
  }
}

class BrushTool extends Tool {
  constructor() {
    super({name: 'brush', title: 'Paint Brush', icon: 'paint-brush'})
  }
}

class FillTool extends Tool {
  constructor() {
    super({name: 'fill', title: 'Fill Bucket (replace color)', className: 'fill-button'})
  }
}

class SelectTool extends Tool {
  constructor() {
    super({name: 'select', title: 'Select', className: 'select-button'})
  }
}

class RectTool extends Tool {
  constructor() {
    super({name: 'rect', title: 'Rectangle', className: 'rect-button'})
  }
}

class CircleTool extends Tool {
  constructor() {
    super({name: 'circle', title: 'Elipse', className: 'circle-button'})
  }
}

class ResizeTool extends Tool {
  constructor() {
    super({name: 'resize', title: 'Resize', icon: 'arrows'})
  }
}

class EyeDropperTool extends Tool {
  constructor() {
    super({name: 'eyeDropper', title: 'select color', icon: 'eyedropper'})
  }
}

var TOOLS = [
  new NewTool(),
  new OpenTool(),
  new UploadTool(),
  new SaveTool(),
  new SaveAsTool(),
  null,
  new BrushTool(),
  new FillTool(),
  new SelectTool(),
  new RectTool(),
  new CircleTool(),
  new ResizeTool(),
  new EyeDropperTool()
]
