function FormRow(name,options) {
  var row = createElement('div', {
    className: 'pure-control-group'
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

function Dialog(options) {
  options.onClose = options.onClose || function() {};
  var mask = createElement("div", {
    className: "dialog-mask",
    parent: document.body,
  });
  var dialog = createElement("div", {
    className: "dialog",
    parent: document.body,
  });
  var title = createElement("div", {
    className: "title-bar border-box",
    parent: dialog,
    innerHTML: options.title,
  });
  function closeDialog(success) {
    if (success) { options.onClose(); }
    dialog.parentNode.removeChild(dialog);
    mask.parentNode.removeChild(mask);
  }
  var buttons = createElement("div", {
    className: "buttons border-box",
    parent: dialog,
  })
  var close = createElement('button', {
    innerHTML: 'Cancel',
    parent: buttons,
    className: 'pure-button button-error',
  });
  close.addEventListener("click",function() { closeDialog(false) });
  var accept = createElement('button', {
    innerHTML: 'Okay',
    parent: buttons,
    className: 'pure-button button-success',
  });
  accept.addEventListener("click",function() { closeDialog(true); });
  dialog.appendChild(options.createBody());
}

function openResizeDialog() {
  new Dialog({
    createBody: function() {
      var div = createElement("div",{className: "pure-form pure-form-aligned"});
      var width_input = new FormRow('width',{type: 'number', value: canvas.width});
      var height_input = new FormRow('height',{type: 'number', value: canvas.height});
      div.appendChild(width_input);
      div.appendChild(height_input);
      return div;
    },
    onClose: function setSize() {
      width = parseInt(document.getElementById('id_width').value);
      height = parseInt(document.getElementById('id_height').value);
      if (WIDTH == width && HEIGHT == height) { return; }
      current_action = new CanvasAction({});
      current_action.WIDTH = width;
      current_action.HEIGHT = height;
      actions.push(current_action);
      finishAction();
    },
    title: "Resize Image",
  })
}

function openFilesDialog() {
  new Dialog({
    createBody: function() {

    },
    onClose: function setSize() {
      
    },
    title: "Load File",
  });
}
