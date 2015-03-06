var local_store = (function (){
  var gallery,file_action;

  // create buttons for local storage interface
  var tools = document.getElementById("tools");

  var new_button = createElement("button",{
    className: "fa fa-file-o",
    title: 'New Image',
    name: 'new',
    parent: tools
  });
  new_button.addEventListener("click",function(){newImage();});

  var open_button = createElement("button",{
    className: "fa fa-folder-open-o",
    title: 'Open Image',
    name: 'open',
    parent: tools
  });
  open_button.addEventListener("click",function(){startOpenImage();});

  var upload_button = createElement("button",{
    className: "fa fa-upload",
    title: 'Upload Image',
    name: 'upload',
    parent: tools,
  });

  var save_button = createElement("button",{
    className: "fa fa-floppy-o",
    title: 'save',
    name: 'save',
    parent: tools
  });
  save_button.addEventListener("click",function(){saveImage()});

  var save_as_button = createElement("button",{
    className: "fa fa-floppy-o save-as-new",
    title: 'Save as New',
    name: 'saveAs',
    parent: tools
  });
  save_as_button.addEventListener("click",function(){startSaveAs();});

  tools.appendChild(createElement("hr",{}));

  function openFileWindow() {
    resetFileList();
    file_window.style.display = "block";
  }

  function startOpenImage() {
    openFileWindow();
    file_action = "load";
    title_bar.innerHTML = "Open Image";
  }

  function newImage() {
    alert("Not Implimented");
  }

  function startSaveAs() {
    openFileWindow();
    file_action = "save";
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
  var cancel_button = createElement("button", {
    name: "cancel-button",
    innerHTML: "Cancel",
    parent: file_window
  });
  cancel_button.addEventListener('click',function() { file_window.style.display = "none"; });
  var file_button = createElement("button", {
    name: "save-as-button",
    innerHTML: "Save File",
    parent: file_window
  });
  file_button.addEventListener('click',function() {
    current_image.name = file_name.value;
    saveImage();
  });
  upload_button = createElement("input", {
    name: 'upload-file',
    type: 'file',
    parent: file_window,
    id: 'upload-file',
    style: { 'display': 'none' },
  });
  upload_button.addEventListener("change", function() {
    if (!this.files) { console.log("no files"); return }
    var file = this.files[0];
    var fr = new FileReader();
    function pasteDataURL(src) {
      var img = document.createElement("img");
      img.src = src;
      file_window.appendChild(img);
    }
    fr.onload = function() { pasteDataURL(fr.result) }
    fr.readAsDataURL(file);
  });
  upload_label = createElement("label", {
    htmlFor: 'upload-file',
    parent: file_window,
    innerHTML: 'upload from computer'
  });

  // functions!
  function addMessage(msg) {
    var e = createElement("div", {
      className: 'msg',
      innerHTML: msg,
      parent: document.getElementById("wrapper"),
    });
    setTimeout(function(){ e.style.marginTop="-50px"; },5000)
  }
  function save() {
    localStorage.setItem("gallery",JSON.stringify(gallery));
    addMessage("image saved!")
    file_window.style.display = "none";
  }
  function saveImage(name) {
    if (name) { current_image.name = name; }
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
    current_image.name = name;
    addMessage("image loaded!")
  }

  function resetFileList() {
    file_list.innerHTML = '';
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
      a.addEventListener('click',(function() { clickImage(this.name)}).bind(a));
    }
  }
  function clickImage(name) {
    if (file_action == "save") { saveImage(name); }
    else if (file_action == "load") { loadImage(name); }
    file_window.style.display = "none";
    current_image.name = undefined;
  }

  function init() {
    gallery = JSON.parse(localStorage.getItem("gallery") || "{}");
    window.gallery = gallery;
  }
  init();
})();
