window.PAINT = window.PAINT || {};
PAINT.addMessage = function(text) {
  var logs = document.getElementById("logs");
  var e = document.createElement("li");
  e.innerText = text;
  logs.appendChild(e);
  logs.scrollTop = logs.scrollHeight;
}
window.PAINT.gallery = new uR.Storage("PAINT");

PAINT.gallery.startSaveAs = function() { alert("startSaveAs Not Implimented!"); }
PAINT.gallery.saveImage = function saveImage(name) {
  if (name) { PAINT.current_image.name = name; }
  if (!PAINT.current_image.name) { startSaveAs(); return; }
  this.set(PAINT.current_image.name,PAINT.current_image.toJSON());
  PAINT.addMessage(`${name} saved!`);
}
PAINT.gallery.autoSave = function autoSave(dataURL) {
  var name = "__autosave";
  var data = PAINT.current_image.toJSON();
  data.dataURL = dataURL || data.dataURL;
  this.set(name, data);
  PAINT.addMessage(`${name} saved!`);
}
