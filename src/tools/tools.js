window.PAINT = window.PAINT || {};
(function() {
  class Open extends DialogTool {
    constructor() {
      super({name: 'open', title: 'Open Image', icon: 'folder-open-o'})
    }
    click(e,tag) {
      new PAINT.Image(e.item);
      PAINT.addMessage(`${e.item.name} loaded`);
      tag.unmount();
    }
    getWindowData() {
      function getItems()  {
        var names = [];
        var items = [];
        for (var n in PAINT.gallery) { names.push(n) }
        names.sort()
        for (var i=0;i<names.length;i++) {
          if (names[i] == "__autosave") { continue }
          items.push(PAINT.gallery[names[i]]);
        }
        return items;
      }
      return {
        title: "Open Image",
        getItems: getItems,
        hide_okay: true
      }
    }
  }

  class Save extends Tool {
    constructor() {
      super({name: 'save', title: 'Save Image', icon: 'floppy-o'})
    }
    select() {
      super.select();
      if (PAINT.current_image.name) {
        PAINT.storage.saveImage(PAINT.current_image.name);
        super.accept(tag);
      } else {
        document.querySelector("[name=saveAs]").click();
      }
    }
  }

  class SaveAs extends DialogTool {
    constructor() {
      super({name: 'saveAs', title: 'Save Image As', icon: 'floppy-o', className: 'save-as-new'})
    }
    getWindowData() {
      return {
        title: "Save Image As",
        form: [
          {name: 'filename', title: 'Enter A Name', value: "", placeholder: 'Enter a name', type: 'text'},
        ]
      }
    }
    accept(tag) {
      PAINT.storage.saveImage(document.getElementById("id_filename").value);
      super.accept(tag);
    }
  }
})()
