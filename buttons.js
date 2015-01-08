function createElement(type,options) {
  var element = document.createElement(type);
  for (key in options) { element[key] = options[key] }
  return element;
}

function createButtons() {
  var tools = document.getElementById("tools");
  var brush = createElement("button",{
    title: "brush",
    className: "fa fa-paint-brush active",
    name: "brush"
  });
  tools.appendChild(brush);
  brush.addEventListener("click",function() {changeTool("brush")});

  var select = createElement("button",{
    title: "select",
    className: "select-button",
    name: "select"
  });
  select.addEventListener("click",function() {changeTool("select")});
  tools.appendChild(select);

  var rect = createElement("button", {
    title: "rect",
    className: "rect-button",
    name: "rect",
  });
  rect.addEventListener("click",function() {changeTool("rect")});
  tools.appendChild(rect);

  var circle = createElement("button", {
    title: "circle",
    className: "circle-button",
    name: "circle",
  });
  circle.addEventListener("click",function() {changeTool("circle")});
  tools.appendChild(circle);

  var tools_bot = document.getElementById("tools_bot");
  var fg_picker = createElement("input",{
    value: "#cb3594",
    type: "color",
    className: "color-picker fg"
  });
  function setFG() { fg_color = fg_picker.value; }
  setFG();
  fg_picker.addEventListener("change",setFG.bind(fg_picker));
  tools_bot.appendChild(fg_picker);

  var bg_picker = createElement("input",{
    value: "#FFFFFF",
    type: "color",
    className: "color-picker bg"
  });
  function setBG() { bg_color = bg_picker.value; }
  setBG();
  bg_picker.addEventListener("change",setBG.bind(bg_picker));
  tools_bot.appendChild(bg_picker);

  var size_picker = createElement("input",{
    id: "size_picker",
    size: 2,
    value: 4,
  });
  function setSize() { active_size = size_picker.value; }
  setSize();
  size_picker.addEventListener("change",setSize.bind(size_picker));
  tools.appendChild(size_picker);

  var container = createElement("div",{className: "alpha-container"});
  var alpha_picker = createElement("input",{
    type: "range",
    max: "1",
    min: "0",
    step: "0.01",
    value: "1"
  });
  var alpha_display = createElement("span",{className: "fg_alpha"});
  container.appendChild(alpha_display);
  container.appendChild(alpha_picker);
  function setAlpha() { alpha = alpha_picker.value; alpha_display.innerHTML = alpha; }
  setAlpha();
  alpha_picker.addEventListener("input",setAlpha.bind(alpha_picker));
  tools_bot.appendChild(container);

}
