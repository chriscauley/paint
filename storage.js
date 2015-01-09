var local_store = (function (){
  var gallery;
  // create buttons for local storage interface
  var tools = document.getElementById("tools");
  var save_button = createElement("button",{
    className: "fa fa-floppy-o",
    title: 'save',
    name: 'save',
    parent: tools
  });
  save_button.addEventListener("click",function(){saveImage(current_image)});
  
  var save_as_button = createElement("button",{
    className: "fa fa-floppy-o save-as-new",
    title: 'Save as New',
    name: 'saveAs',
    parent: tools
  });
  save_as_button.addEventListener("click",function(){startSaveAs();});

  function startSaveAs() {
    file_window.style.display = "block";
    title_bar.innerHTML = "Save File As";
  }

  // create html elements

  var file_window = createElement("div",{ "id": "file_window",parent: tools});
  var title_bar = createElement("div",{className: "title-bar",parent: file_window});
  var file_list = createElement("div",{className: "file-list",parent: file_window});
  var file_name = createElement("input", {
    type: "text",
    placeholder: "File Name",
    name: "file-name",
    parent: file_window
  });
  var file_button = createElement("button", {
    name: "save-as-button",
    innerHTML: "Save File",
    parent: file_window
  });
  file_button.addEventListener('click',function() {
    current_image.name = file_name.value;
    saveImage();
  });

  // functions!
  function save() {
    localStorage.setItem("gallery",JSON.stringify(gallery));
    resetFileList();
    file_window.style.display = "none";
  }
  function saveImage() {
    if (!current_image.name) { startSaveAs(); return; }
    current_image.dataURL = canvas.toDataURL();
    gallery[current_image.name] = current_image;
    save();
  }
  function loadImage(name) {
    var image = gallery[name];
    WIDTH = image.width;
    HEIGHT = image.height;
    resetCanvas();
    for (var i=0;i<image.actions.length;i++) {
      actions.push(new CanvasAction(image.actions[i]));
    }
    file_window.style.display = "none";
  }

  function resetFileList() {
    var images = [];
    for (image_name in gallery) { images.push(image_name); }
    images = images.sort();
    for (var i=0;i<images.length;i++) {
      image_name = images[i];
      image = gallery[image_name];
      var a = createElement("a",{
        style: {backgroundImage: 'url('+image.dataURL+')'},
        className: 'file',
        name: image_name,
        parent: file_list,
      });
      a.addEventListener('click',(function() { loadImage(this.name)}).bind(a));
    }
  }

  function init() {
    gallery = JSON.parse(localStorage.getItem("gallery") || "{}");
    window.gallery = gallery;
    resetFileList();
  }
  init();
})();
