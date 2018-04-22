PAINT.Upload = class Upload extends PAINT.Tool {
  constructor() {
    super({name: 'upload', title: 'Upload Image', icon: 'upload'})
    this.input = document.createElement('input');
    this.input.type = 'file';
    var that = this;
      this.input.addEventListener('change',function() {
        var fr = new FileReader();
        var file = that.input.files[0];
        if (!that.input.value) { return }
        var fname = that.input.value.replace("/","\\").split("\\").pop();
        fr.onload = function() {
          //#! TODO: this should be added to the library (saved) and a bulk uploader is needed.
          new PAINT.Image({dataURL:fr.result,name: fname});
          PAINT.addMessage(`Image "${fname}" uploaded successfully.`)
          PAINT.gallery.autoSave(fr.result);
          that.input.value = '';
        }
        fr.readAsDataURL(file);
      });
    }
  select() {
    this.input.click();
  }
}
