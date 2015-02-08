function createButtons() {
  var tools = document.getElementById("tools");
  var brush = createElement("button",{
    title: "brush",
    className: "fa fa-paint-brush active",
    name: "brush",
    parent: tools
  });
  brush.addEventListener("click",function() {changeTool("brush")});

  var select = createElement("button",{
    title: "select",
    className: "select-button",
    name: "select",
    parent: tools
  });
  select.addEventListener("click",function() {changeTool("select")});

  var rect = createElement("button", {
    title: "rect",
    className: "rect-button",
    name: "rect",
    parent: tools
  });
  rect.addEventListener("click",function() {changeTool("rect")});

  var circle = createElement("button", {
    title: "circle",
    className: "circle-button",
    name: "circle",
    parent: tools
  });
  circle.addEventListener("click",function() {changeTool("circle")});

  var resize = createElement("button", {
    title: "resize",
    className: " fa fa-arrows",
    name: "resize",
    parent: tools
  });
  resize.addEventListener("click",function() { openResizeDialog(); });

  var tools_bot = document.getElementById("tools_bot");
  var fg_picker = createElement("input",{
    value: "#cb3594",
    type: "color",
    className: "color-picker fg",
    parent: tools_bot,
  });
  function setFG() { fg_color = fg_picker.value; }
  setFG();
  fg_picker.addEventListener("change",setFG.bind(fg_picker));

  var bg_picker = createElement("input",{
    value: "#FFFFFF",
    type: "color",
    className: "color-picker bg",
    parent: bg_picker,
  });
  function setBG() { bg_color = bg_picker.value; }
  setBG();
  bg_picker.addEventListener("change",setBG.bind(bg_picker));

  var size_picker = createElement("input",{
    id: "size_picker",
    size: 2,
    value: 4,
    parent: size_picker,
  });
  function setSize() { active_size = size_picker.value; }
  setSize();
  size_picker.addEventListener("change",setSize.bind(size_picker));


  var container = createElement("div",{className: "alpha-container"});
  var alpha_picker = createElement("input",{
    type: "range",
    max: "1",
    min: "0",
    step: "0.01",
    value: "1",
    parent: container
  });
  var alpha_display = createElement("span",{className: "fg_alpha",parent: container});
  function setAlpha() { alpha = alpha_picker.value; alpha_display.innerHTML = alpha; }
  setAlpha();
  alpha_picker.addEventListener("input",setAlpha.bind(alpha_picker));
  tools_bot.appendChild(container);

}
