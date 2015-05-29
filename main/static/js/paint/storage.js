window.PAINT = window.PAINT || {};
window.PAINT.storage = (function (){
  // functions!
  PAINT.addMessage = function(text) {
    $(".canvas-wrapper").append("<msg></msg>");
    riot.mount("msg",{text:text});
  }
  function startSaveAs() { alert("startSaveAs Not Implimented!"); }
  function saveImage(name) {
    if (name) { PAINT.current_image.name = name; }
    if (!PAINT.current_image.name) { startSaveAs(); return; }
    PAINT.gallery[PAINT.current_image.name] = PAINT.current_image.toJSON();
    localStorage.setItem("gallery",JSON.stringify(PAINT.gallery));
    PAINT.addMessage("image saved!")
  }
  function loadImage(name) {
    new PAINT.Image(PAINT.gallery[name]);
    addMessage("Image loaded!");
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
    PAINT.gallery = JSON.parse(localStorage.getItem("gallery") || "{}");
  }
  init();
  return {
    saveImage: saveImage,
    loadImage: loadImage
  }
})();
