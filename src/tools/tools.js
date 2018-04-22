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
        var names = PAINT.storage.keys.filter((n) n != "__autosave");
        names.sort();
        return names.map((name) => PAINT.storage.get(name))
      }
      console.log(getItems();
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
