window.PAINT = window.PAINT || {};
PAINT.addMessage = function(text) {
  var logs = document.getElementById("logs");
  var e = document.createElement("li");
  e.innerText = text;
  logs.appendChild(e);
  logs.scrollTop = logs.scrollHeight;
}
window.PAINT.storage = new uR.Storage("PAINT");

PAINT.storage.startSaveAs = function() { alert("startSaveAs Not Implimented!"); }
PAINT.storage.saveImage = function saveImage(name) {
  if (name) { PAINT.current_image.name = name; }
  if (!PAINT.current_image.name) { startSaveAs(); return; }
  PAINT.storage.set(PAINT.current_image.name,PAINT.current_image.toJSON());
  PAINT.addMessage(`${name} saved!`)
}
PAINT.storage.autoSave = function autoSave(dataURL) {
  var name = "__autosave";
  var data = PAINT.current_image.toJSON();
  data.dataURL = dataURL || data.dataURL;
  PAINT.storage.set(name, data);
  PAINT.addMessage(`${name} saved!`)
}
