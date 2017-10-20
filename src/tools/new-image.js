PAINT.NewImage = class NewImage extends PAINT.DialogTool {
  constructor() {
    super({name: 'new-image', title: 'New Image', icon: 'file-o'});
  }
  getOpts() {
    return {
      title: "Create New Image",
      schema: [
        { name: 'width', value: PAINT.current_image.WIDTH, type: 'number'},
        { name: 'height', value: PAINT.current_image.HEIGHT, type: 'number'}
      ],
      submit: function(tag) {
        var w = parseInt(document.getElementById("id_width").value);
        var h = parseInt(document.getElementById("id_height").value);
        new PAINT.Image({w: w, h: h});
        PAINT.addMessage(`A new ${w}x${h} image has been created.`)
        tag.unmount();
      }
    }
  }
  accept(tag) {
  }
}
