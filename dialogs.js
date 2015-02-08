function FormRow(name,options) {
  var row = createElement('div', {
    className: 'form-row'
  });
  var label = createElement('label', {
    name: name,
    for: "id_"+name
  });
  label.innerHTML = options.verbose || name;
  row.appendChild(label);
  var input = createElement('input', {
    name: name,
    type: options.type,
    id: "id_"+name,
  });
  if (options.value) { input.value = options.value; }
  row.appendChild(input);
  return row;
}

function openResizeDialog() {
  var mask = createElement("div", {
    className: "dialog-mask",
    parent: document.body,
  });
  var dialog = createElement("div", {
    className: "dialog",
    parent: document.body,
  });
  var width_input = new FormRow('width',{type: 'number', value: canvas.width});
  var height_input = new FormRow('height',{type: 'number', value: canvas.height});
  dialog.appendChild(width_input);
  dialog.appendChild(height_input);
  function closeDialog() {
    dialog.parentNode.removeChild(dialog);
    mask.parentNode.removeChild(mask);
  }
  function setSize() {
    width = parseInt(document.getElementById('id_width').value);
    height = parseInt(document.getElementById('id_height').value);
    if (WIDTH == width && HEIGHT == height) { return; }
    current_action = new CanvasAction({});
    current_action.WIDTH = width;
    current_action.HEIGHT = height;
    finishAction();
  }
  var close = createElement('button', {
    innerHTML: 'Cancel',
    parent: dialog,
    className: 'closebutton',
  });
  close.addEventListener("click",closeDialog);
  var accept = createElement('button', {
    innerHTML: 'Okay',
    parent: dialog,
    className: 'okaybutton',
  });
  accept.addEventListener("click",function() { setSize(); closeDialog(); });
}
