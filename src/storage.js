window.PAINT = window.PAINT || {};
PAINT.gallery = JSON.parse(localStorage.getItem("gallery") || "{}");
PAINT.addMessage = function(text) {
  $("#logs").append($("<li>"+text+"</li>"));
  $("#logs").scrollTop($("#logs")[0].scrollHeight);
}
window.PAINT.storage = (function (){
  function startSaveAs() { alert("startSaveAs Not Implimented!"); }
  function saveImage(name) {
    if (name) { PAINT.current_image.name = name; }
    if (!PAINT.current_image.name) { startSaveAs(); return; }
    PAINT.gallery[PAINT.current_image.name] = PAINT.current_image.toJSON();
    localStorage.setItem("gallery",JSON.stringify(PAINT.gallery));
    PAINT.addMessage(`${name} saved!`)
  }
  function autoSave(dataURL) {
    var name = "__autosave";
    PAINT.gallery[name] = PAINT.current_image.toJSON();
    PAINT.gallery[name].dataURL = dataURL || PAINT.gallery[name].dataURL;
    localStorage.setItem("gallery",JSON.stringify(PAINT.gallery));
    PAINT.addMessage(`${name} saved!`)
  }

  return {
    saveImage: saveImage,
    autoSave: autoSave,
  }
})();
